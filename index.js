const instance_skel = require('../../instance_skel')
const actions = require('./actions')
const presets = require('./presets')
const { updateVariableDefinitions } = require('./variables')
const { initFeedbacks } = require('./feedbacks')

const OSC = require('osc')

let debug
let log

class instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
			...presets,
		})

		this.updateVariableDefinitions = updateVariableDefinitions
	}

	static GetUpgradeScripts() {
		return [
			instance_skel.CreateConvertToBooleanFeedbackUpgradeScript({
				playStatus: true,
			}),
		]
	}

	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'IP Address',
				tooltip: 'The IP of the computer running Mitti',
				width: 6,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'feedbackPort',
				label: 'Feedback Port',
				width: 5,
				tooltip: 'The port designated for Feedback in the OSC/UDP Controls tab in Mitti',
				default: 1234,
				regex: this.REGEX_PORT,
			},
		]
	}

	updateConfig(config) {
		this.config = config

		this.initPresets()
		this.initVariables()
		this.initFeedbacks()
		this.initOSC()
	}

	destroy() {
		this.debug('destroy', this.id)
		if (this.listener) {
			this.listener.close()
		}

		this.cues = {}
	}

	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_WARNING, 'Connecting')
		this.actions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()

		if (this.config.host) {
			this.initOSC()
		}
	}

	initVariables() {
		this.updateVariableDefinitions()
	}

	initFeedbacks() {
		const feedbacks = initFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	initPresets() {
		this.setPresetDefinitions(this.getPresets())
	}

	actions() {
		this.setActions(this.getActions())
	}

	sendCommand(command, value) {
		if (value || value === 0) {
			this.oscSend(this.config.host, 51000, `/mitti/${command}`, [
				{
					type: 's',
					value: value,
				},
			])
		} else {
			this.oscSend(this.config.host, 51000, `/mitti/${command}`, [])
		}
	}

	conformCueID(cueID) {
		this.parseVariables(cueID, (value) => {
			cueID = value
		})
		if (!cueID.match(/^(current|previous|next)$/)) {
			cueID = cueID.toUpperCase().slice(0, 6)
		}
		return cueID
	}

	initOSC() {
		this.status(this.STATUS_OK)

		this.cues = {}
		this.states = {}

		if (this.listener) {
			this.listener.close()
		}

		this.listener = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.feedbackPort,
			broadcast: true,
			metadata: true,
		})

		this.listener.open()
		this.listener.on('ready', () => {
			this.sendCommand('resendOSCFeedback')
		})
		this.listener.on('error', (err) => {
			if (err.code == 'EADDRINUSE') {
				this.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is already in use.`)
				this.status(this.STATUS_ERROR)
			}
		})

		this.listener.on('message', (message) => {
			let value = message?.args[0]?.value

			if (message.address === '/mitti/currentCueName') {
				this.states.currentCueName = value
				this.setVariable('currentCueName', value != '-' ? value : 'None')
				this.checkFeedbacks('playingCueName', 'playingCueID')
			} else if (message.address === '/mitti/currentCueID') {
				this.states.currentCueID = value
				this.setVariable('currentCueID', value != '-' ? value : 'None')
				this.checkFeedbacks('playingCueName', 'playingCueID')
			} else if (message.address === '/mitti/previousCueName') {
				this.setVariable('previousCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/nextCueName') {
				this.setVariable('nextCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/selectedCueName') {
				this.setVariable('selectedCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/selectedCueID') {
				this.states.selectedCueID = value
				this.setVariable('selectedCueID', value != '-' ? value : 'None')
				this.checkFeedbacks('selectedCueID')
			} else if (message.address === '/mitti/cueTimeLeft') {
				let cueTimeLeft = value
				let cueTimeSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `-${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				this.setVariables({
					cueTimeLeft: cueTimeHHMMSS,
					cueTimeLeft_h: cueTimeHH,
					cueTimeLeft_m: cueTimeMM,
					cueTimeLeft_s: cueTimeSS,
				})

				this.states.timeRemaining = parseInt(cueTimeHH) * 120 + parseInt(cueTimeMM) * 60 + parseInt(cueTimeSS)
				this.checkFeedbacks('timeRemaining')
			} else if (message.address === '/mitti/currentCueTRT') {
				let currentCueTRT = value
				let cueTimeSplit = currentCueTRT.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				this.setVariable('currentCueTRT', cueTimeHHMMSS)
			} else if (message.address === '/mitti/togglePlay') {
				this.states.playing = value === 0 ? 'Paused' : 'Playing'
				this.setVariable('playStatus', this.states.playing)
				this.checkFeedbacks('playStatus', 'playingCueName', 'playingCueID')
			} else if (message.address.match(/(^\/mitti\/[0-9]+)/i)) {
				let cueInfo = message.address.match(/(\/mitti\/)([0-9]+)(\/)(\S*)/i)

				if (cueInfo) {
					let cue = cueInfo[2]
					let param = cueInfo[4]

					if (!this.cues[cue] && cue != 0 && param === 'cueName') {
						this.cues[cue] = {}
						this.cues[cue][param] = value
						this.initVariables()
						this.initPresets()
					} else if (this.cues[cue] && cue != 0 && param === 'deleted') {
						delete this.cues[cue]
						this.initVariables()
						this.initPresets()
					} else {
						if (param === 'cueName') {
							this.setVariable(`cue_${cue}_cueName`, value)
						}
					}
				}
			}
		})
	}
}
exports = module.exports = instance
