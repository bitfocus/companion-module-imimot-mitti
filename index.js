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
				tooltip: 'The IP address of the computer running Mitti',
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

	async conformCueID(context, cueID) {
		let cue = await context.parseVariablesInString(cueID)

		if (!cue.match(/^(current|previous|next)$/)) {
			cue = cue.toUpperCase().slice(0, 6)
		}
		return cue
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
			} else {
				this.log('error', `Error: ${err.message}`)
				this.updateStatus('bad_config', 'Feedback error')
			}
		})

		this.listener.on('message', (message) => {
			let address = message.address
			let value = message?.args[0]?.value

			if (address.match(/(^\/mitti\/[0-9]+)/i)) {
				let cueInfo = message.address.match(/(\/mitti\/)([0-9]+)(\/)(\S*)/i)
				let cue = cueInfo[2]
				let param = cueInfo[4]
				this.processCueUpdate(cue, param, value)
			} else if (address.match(/(^\/mitti\/current\/toggle)/i)) {
				let cueInfo = message.address.match(/(\/mitti\/current\/toggle)(\S*)/i)
				let param = cueInfo[2]
				this.processCueUpdate('current', param, value)
			} else {
				address = address.replace('/mitti/', '')
				this.processListenerUpdate(address, value)
			}
		})
	}

	processListenerUpdate(address, value) {
		switch (address) {
			case 'currentCueName':
				this.states.currentCueName = value
				this.setVariableValues({ currentCueName: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID')
				break
			case 'currentCueID':
				this.states.currentCueID = value
				this.setVariableValues({ currentCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID')
				break
			case 'previousCueName':
				this.setVariableValues({ previousCueName: value != '-' ? value : 'None' })
				break
			case 'nextCueName':
				this.setVariableValues({ nextCueName: value != '-' ? value : 'None' })
				break
			case 'selectedCueName':
				this.setVariableValues({ selectedCueName: value != '-' ? value : 'None' })
				break
			case 'selectedCueID':
				this.states.selectedCueID = value
				this.setVariableValues({ selectedCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('selectedCueID')
				break
			case 'cueTimeLeft':
				let cueTimeLeft = value
				let cueTimeLeftSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)
				if (cueTimeLeftSplit) {
					let cueTimeLeftHH = cueTimeLeftSplit?.groups?.hh
					let cueTimeLeftMM = cueTimeLeftSplit?.groups?.mm
					let cueTimeLeftSS = cueTimeLeftSplit?.groups?.ss
					let cueTimeLeftHHMMSS = `-${
						cueTimeLeftHH == '00' ? '' : cueTimeLeftHH + ':'
					}${cueTimeLeftMM}:${cueTimeLeftSS}`

					this.setVariableValues({
						cueTimeLeft: cueTimeLeftHHMMSS,
						cueTimeLeft_h: cueTimeLeftHH,
						cueTimeLeft_m: cueTimeLeftMM,
						cueTimeLeft_s: cueTimeLeftSS,
					})
					this.states.timeRemaining =
						parseInt(cueTimeLeftHH) * 120 + parseInt(cueTimeLeftMM) * 60 + parseInt(cueTimeLeftSS)
					this.checkFeedbacks('timeRemaining')
				}
				break
			case 'currentCueTRT':
				let currentCueTRT = value
				let cueTimeSplit = currentCueTRT.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)
				if (cueTimeSplit) {
					let cueTimeHH = cueTimeSplit?.groups?.hh
					let cueTimeMM = cueTimeSplit?.groups?.mm
					let cueTimeSS = cueTimeSplit?.groups?.ss
					let cueTimeHHMMSS = `${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

					this.setVariableValues({ currentCueTRT: cueTimeHHMMSS })
				}
				break
			case 'togglePlay':
				this.states.playing = value === 0 ? 'Paused' : 'Playing'
				this.setVariableValues({ playStatus: this.states.playing })
				this.checkFeedbacks('playStatus', 'playingCueName', 'playingCueID')
				break
			case 'playhead':
				this.states.playhead = value
				break
			default:
				break
		}
	}

	processCueUpdate(cue, param, value) {
		if (cue === 'current') {
			let status = value > 0 ? 'On' : 'Off'
			if (param === 'Audio') {
				status = value > 0 ? 'Unmuted' : 'Muted'
			}
			param = `currentCue${param}`
			this.setVariableValues({ [`${param}`]: status })
		} else {
			if (!this.cues[cue] && cue != 0 && param === 'cueName') {
				this.cues[cue] = {}
				this.cues[cue][param] = value
				this.initVariables()
				this.initPresets()
				this.setVariableValues({ [`cue_${cue}_cueName`]: value })
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
}
runEntrypoint(MittiInstance, UpgradeScripts)
