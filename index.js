import { InstanceBase, Regex, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { getActions } from './actions.js'
import { getPresets } from './presets.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import UpgradeScripts from './upgrades.js'

import OSC from 'osc'
import ciao from '@homebridge/ciao'

class MittiInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.connection = {
			ip: null,
			connected: null,
			testService: null,
			testTimeout: null,
			lastPong: null,
			bonjourResponder: null,
			bonjourService: null,
		}

		this.parseIpAndPort()
		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()

		if (this.connection.ip) {
			this.initOSC()
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'Unable to determine IP Address')
		}
	}

	getConfigFields() {
		return [
			{
				type: 'bonjour-device',
				id: 'bonjourHost',
				label: 'Mitti Connection',
				tooltip:
					'This dropdown attempts to discover active Mitti instances on the network. You can also select "Manual" to enter a custom IP address.',
				width: 10,
			},
			{
				type: 'static-text',
				id: 'hostFiller',
				width: 10,
				label: '',
				isVisible: (options) => !!options['bonjourHost'],
				value: '',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'IP Address',
				tooltip: 'The IP address of the computer running Mitti',
				width: 10,
				regex: Regex.IP,
				isVisible: (options) => !options['bonjourHost'],
			},
			{
				type: 'textinput',
				id: 'feedbackPort',
				label: 'Feedback Port',
				width: 4,
				tooltip: 'The port designated for Feedback in the OSC/UDP Controls tab in Mitti',
				default: 51001,
				regex: Regex.PORT,
			},
			{
				type: 'checkbox',
				id: 'feedbackAlert',
				label: 'Feedback Alert',
				tooltip:
					'If enabled, the module status will change to "Error" if not receiving responses from Mitti. Disable if you wish to use the module without feedback.',
				default: true,
			},
		]
	}

	async configUpdated(config) {
		this.config = config

		this.parseIpAndPort()
		this.updateStatus(InstanceStatus.Connecting)

		if (this.connection.ip) {
			this.initPresets()
			this.initVariables()
			this.initFeedbacks()
			this.initOSC()
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'Unable to determine IP Address')
		}
	}

	async destroy() {
		if (this.listener) {
			this.listener.close()
		}

		this.stopTestService()
		this.stopBonjourService()

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

	parseIpAndPort() {
		const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

		if (this.config.bonjourHost) {
			const [ip, rawPort] = this.config.bonjourHost.split(':')
			const port = Number(rawPort)
			if (ip.match(ipRegex) && !isNaN(port)) {
				this.connection.ip = ip
			}
		} else if (this.config.host) {
			if (this.config.host.match(ipRegex)) {
				this.connection.ip = this.config.host
			}
		}
		return null
	}

	sendCommand(command, value) {
		if (value || value === 0) {
			this.oscSend(this.connection.ip, 51000, `/mitti/${command}`, [
				{
					type: 's',
					value: value,
				},
			])
		} else {
			this.oscSend(this.connection.ip, 51000, `/mitti/${command}`, [])
		}
	}

	async conformCueID(context, cueID) {
		let cue = await context.parseVariablesInString(cueID)

		if (!cue?.match(/^(current|selected|previous|next|all)$/)) {
			cue = cue.toUpperCase().slice(0, 6)
		}
		return cue
	}

	initOSC() {
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
			this.updateStatus(InstanceStatus.Ok)
			this.connection.connected = true

			this.sendCommand('resendOSCFeedback')

			if (this.config.feedbackAlert) {
				this.startTestService()
			} else {
				this.stopTestService()
			}

			this.startBonjourService()
		})

		this.listener.on('error', (err) => {
			this.connection.connected = false
			if (err.code == 'EADDRINUSE') {
				this.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is already in use.`)
				this.updateStatus(InstanceStatus.BadConfig, 'Feedback port conflict')
			} else {
				this.log('error', `Error: ${err.message}`)
				this.updateStatus(InstanceStatus.BadConfig, 'Feedback Unavailable')
			}
		})

		this.listener.on('message', (message) => {
			let address = message.address
			let value = message?.args[0]?.value

			if (address.match(/(^\/mitti\/current\/toggle)/i)) {
				let cueInfo = message.address.match(/(\/mitti\/current\/toggle)(\S*)/i)
				let param = cueInfo[2]
				this.processCueUpdate('current', param, value)
			} else if (address.match(/(^\/mitti\/\S*\/)/i)) {
				let cueInfo = message.address.match(/(\/mitti\/)(\S*)(\/)(\S*)/i)
				let cue = cueInfo[2]
				let param = cueInfo[4]
				if (cue !== 'previous' && cue !== 'next' && cue !== 'current') {
					this.processCueUpdate(cue, param, value)
				}
			} else {
				address = address.replace('/mitti/', '')
				this.processListenerUpdate(address, value)
			}
		})
	}

	testConnection() {
		this.connection.testService = setInterval(() => {
			this.sendCommand('ping')

			this.connection.testTimeout = setTimeout(() => {
				if (Date.now() - 4000 > this.connection.lastPong) {
					if (this.connection.connected === true) {
						this.connection.connected = false
						this.updateStatus(InstanceStatus.ConnectionFailure, 'Feedback Unavailable')
						this.log(
							'error',
							'Feedback unavailable, unable to receive response from Mitti. Check you OSC Feedback settings in both Mitti and Companion.',
						)
					}
				} else {
					if (this.connection.connected === false) {
						this.connection.connected = true
						this.updateStatus(InstanceStatus.Ok)
						this.log('info', 'Connected to Mitti')
					}
				}
			}, 2000)
		}, 4000)
	}

	startTestService() {
		this.stopTestService()
		this.log('debug', 'Starting Connection Test')
		this.testConnection()
	}

	stopTestService() {
		if (this.connection.testService) {
			this.log('debug', 'Stopping Connection Test')
			clearInterval(this.connection.testService)
			this.connection.testService = null
		}
		if (this.connection.testTimeout) {
			clearTimeout(this.connection.testTimeout)
			this.connection.testTimeout = null
		}
	}

	startBonjourService() {
		this.stopBonjourService()

		this.connection.bonjourResponder = ciao.getResponder()

		let name = `Companion-Mitti-Module:${this.config.feedbackPort}`
		if (this.connection.bonjourResponder) {
			this.connection.bonjourService = this.connection.bonjourResponder.createService({
				name: name,
				type: 'osc',
				protocol: 'udp',
				port: this.config.feedbackPort,
			})

			this.connection.bonjourService
				.advertise()
				.then(() => {
					this.log('debug', `Bonjour advertised as ${name}`)
				})
				.catch((err) => {
					this.log('debug', `Bonjour error: ${err}`)
				})
		}
	}

	stopBonjourService() {
		if (this.connection.bonjourService) {
			this.connection.bonjourService.destroy().then(() => {
				this.log('debug', `Bonjour advertisement destroyed`)

				if (this.connection.bonjourResponder) {
					this.connection.bonjourResponder.shutdown().then(() => {
						this.log('debug', `Bonjour responder destroyed`)
					})
				}
			})
		}
	}

	processListenerUpdate(address, value) {
		switch (address) {
			case 'currentCueName':
				this.states.currentCueName = value
				this.setVariableValues({ currentCueName: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID', 'activeCueName')
				break
			case 'currentCueID':
				this.states.currentCueID = value
				this.setVariableValues({ currentCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('playingCueName', 'playingCueID', 'activeCueID')
				break
			case 'previousCueName':
				this.setVariableValues({ previousCueName: value != '-' ? value : 'None' })
				break
			case 'nextCueName':
				this.setVariableValues({ nextCueName: value != '-' ? value : 'None' })
				break
			case 'selectedCueName':
				this.states.selectedCueName = value
				this.setVariableValues({ selectedCueName: value != '-' ? value : 'None' })
				this.checkFeedbacks('selectedCueName')
				break
			case 'selectedCueID':
				this.states.selectedCueID = value
				this.setVariableValues({ selectedCueID: value != '-' ? value : 'None' })
				this.checkFeedbacks('selectedCueID')
				break
			case 'cueTimeLeft':
				{
					let cueTimeLeft = value
					let cueTimeLeftSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)
					if (cueTimeLeftSplit) {
						let cueTimeLeftHH = cueTimeLeftSplit?.groups?.hh
						let cueTimeLeftMM = cueTimeLeftSplit?.groups?.mm
						let cueTimeLeftSS = cueTimeLeftSplit?.groups?.ss
						let cueTimeLeftShort = `-${cueTimeLeftHH == '00' ? '' : cueTimeLeftHH + ':'}${cueTimeLeftMM}:${cueTimeLeftSS}`
						let cueTimeLeftFull = `-${cueTimeLeftHH}:${cueTimeLeftMM}:${cueTimeLeftSS}`

						this.setVariableValues({
							cueTimeLeft: cueTimeLeftShort,
							cueTimeLeft_hhmmss: cueTimeLeftFull,
							cueTimeLeft_h: cueTimeLeftHH,
							cueTimeLeft_m: cueTimeLeftMM,
							cueTimeLeft_s: cueTimeLeftSS,
						})
						this.states.timeRemaining =
							parseInt(cueTimeLeftHH) * 120 + parseInt(cueTimeLeftMM) * 60 + parseInt(cueTimeLeftSS)
						this.checkFeedbacks('timeRemaining')
					}
				}
				break
			case 'cueTimeElapsed':
				{
					let cueTimeElapsed = value
					let cueTimeElapsedSplit = cueTimeElapsed.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)
					if (cueTimeElapsedSplit) {
						let cueTimeElapsedHH = cueTimeElapsedSplit?.groups?.hh
						let cueTimeElapsedMM = cueTimeElapsedSplit?.groups?.mm
						let cueTimeElapsedSS = cueTimeElapsedSplit?.groups?.ss
						let cueTimeElapsedShort = `${
							cueTimeElapsedHH == '00' ? '' : cueTimeElapsedMM + ':'
						}${cueTimeElapsedMM}:${cueTimeElapsedSS}`
						let cueTimeElapsedFull = `${cueTimeElapsedHH}:${cueTimeElapsedMM}:${cueTimeElapsedSS}`

						this.setVariableValues({
							cueTimeElapsed: cueTimeElapsedShort,
							cueTimeElapsed_hhmmss: cueTimeElapsedFull,
							cueTimeElapsed_h: cueTimeElapsedHH,
							cueTimeElapsed_m: cueTimeElapsedMM,
							cueTimeElapsed_s: cueTimeElapsedSS,
						})
					}
				}
				break
			case 'currentCueTRT':
				{
					let currentCueTRT = value
					let cueTimeSplit = currentCueTRT.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)
					if (cueTimeSplit) {
						let cueTimeHH = cueTimeSplit?.groups?.hh
						let cueTimeMM = cueTimeSplit?.groups?.mm
						let cueTimeSS = cueTimeSplit?.groups?.ss
						let cueTimeShort = `${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`
						let cueTimeFull = `${cueTimeHH}:${cueTimeMM}:${cueTimeSS}`

						this.setVariableValues({
							currentCueTRT: cueTimeShort,
							currentCueTRT_hhmmss: cueTimeFull,
							currentCueTRT_h: cueTimeHH,
							currentCueTRT_m: cueTimeMM,
							currentCueTRT_s: cueTimeSS,
						})
					}
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
			case 'toggleVideoOutputs':
				this.states.videoOutputs = value == 1 ? true : false
				this.setVariableValues({ video_outputs: this.states.videoOutputs ? 'Active' : 'Off' })
				this.checkFeedbacks('videoOutputs')
				break
			case 'pong':
				this.connection.lastPong = Date.now()
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
			if (!this.cues[cue]?.cueName && cue != 0 && param === 'cueName') {
				if (!this.cues[cue]) {
					this.cues[cue] = {}
				}
				this.cues[cue][param] = value
				this.initVariables()
				this.initPresets()
				this.setVariableValues({ [`cue_${cue}_cueName`]: value })
			} else if (this.cues[cue] && cue != 0 && param === 'deleted') {
				delete this.cues[cue]
				this.initVariables()
				this.initPresets()
			} else {
				if (!this.cues[cue]) {
					this.cues[cue] = {}
				}
				this.cues[cue][param] = value

				switch (param) {
					case 'cueName':
						this.setVariableValues({ [`cue_${cue}_cueName`]: value })
						break
					case 'toggleAudio':
						this.checkFeedbacks('cueAudioStatus')
						break
					case 'togglePauseAtBeginning':
						this.checkFeedbacks('cuePauseAtBeginningStatus')
						break
					case 'togglePauseAtEnd':
						this.checkFeedbacks('cuePauseAtEndStatus')
						break
					case 'toggleFadeIn':
						this.checkFeedbacks('cueFadeInStatus')
						break
					case 'toggleFadeOut':
						this.checkFeedbacks('cueFadeOutStatus')
						break
					case 'toggleLoop':
						this.checkFeedbacks('cueLoopStatus')
						break
					case 'toggleTransition':
						this.checkFeedbacks('cueTransitionStatus')
						break
					case 'toggleGoto':
						this.checkFeedbacks('cueGotoStatus')
						break
					default:
						break
				}
			}
		}
	}
}
runEntrypoint(MittiInstance, UpgradeScripts)
