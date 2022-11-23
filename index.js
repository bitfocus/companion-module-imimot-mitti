import { InstanceBase, Regex, runEntrypoint } from '@companion-module/base'
import { getActions } from './actions.js'
import { getPresets } from './presets.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import UpgradeScripts from './upgrades.js'

import OSC from 'osc'

class MittiInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus('connecting', 'Connecting')

		this.initActions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()

		if (this.config.host) {
			this.initOSC()
		} else {
			this.updateStatus('bad_config', 'Missing IP Address')
		}
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'IP Address',
				tooltip: 'The IP of the computer running Mitti',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'feedbackPort',
				label: 'Feedback Port',
				width: 5,
				tooltip: 'The port designated for Feedback in the OSC/UDP Controls tab in Mitti',
				default: 1234,
				regex: Regex.PORT,
			},
		]
	}

	async configUpdated(config) {
		this.config = config

		this.initPresets()
		this.initVariables()
		this.initFeedbacks()
		this.initOSC()
	}

	async destroy() {
		//this.debug('destroy', this.id)
		if (this.listener) {
			this.listener.close()
		}

		this.cues = {}
	}

	initVariables() {
		const variables = getVariables.bind(this)()
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		const feedbacks = getFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	initPresets() {
		const presets = getPresets.bind(this)()
		this.setPresetDefinitions(presets)
	}

	initActions() {
		const actions = getActions.bind(this)()
		this.setActionDefinitions(actions)
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
		this.parseVariablesInString(cueID).then((value) => {
			cueID = value
			this.log(cueID)
			if (!cueID.match(/^(current|previous|next)$/)) {
				cueID = cueID.toUpperCase().slice(0, 6)
			}
			return cueID
		})
	}

	initOSC() {
		this.updateStatus('ok')

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
				this.updateStatus('bad_config', 'Feedback port conflict')
			}
		})

		this.listener.on('message', (message) => {
			let value = message?.args[0]?.value

			if (message.address === '/mitti/currentCueName') {
				this.states.currentCueName = value
				this.setVariableValues({ currentCueName: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID')
			} else if (message.address === '/mitti/currentCueID') {
				this.states.currentCueID = value
				this.setVariableValues({ currentCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID')
			} else if (message.address === '/mitti/previousCueName') {
				this.setVariableValues({ previousCueName: value != '-' ? value : 'None' })
			} else if (message.address === '/mitti/nextCueName') {
				this.setVariableValues({ nextCueName: value != '-' ? value : 'None' })
			} else if (message.address === '/mitti/selectedCueName') {
				this.setVariableValues({ selectedCueName: value != '-' ? value : 'None' })
			} else if (message.address === '/mitti/selectedCueID') {
				this.states.selectedCueID = value
				this.setVariableValues({ selectedCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('selectedCueID')
			} else if (message.address === '/mitti/cueTimeLeft') {
				let cueTimeLeft = value
				let cueTimeSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `-${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				this.setVariableValues({
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

				this.setVariableValues({ currentCueTRT: cueTimeHHMMSS })
			} else if (message.address === '/mitti/togglePlay') {
				this.states.playing = value === 0 ? 'Paused' : 'Playing'
				this.setVariableValues({ playStatus: this.states.playing })
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
							this.setVariableValues({ [`cue_${cue}_cueName`]: value })
						}
					}
				}
			}
		})
	}
}
runEntrypoint(MittiInstance, UpgradeScripts)
