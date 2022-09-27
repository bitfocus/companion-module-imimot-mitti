const instance_skel = require('../../instance_skel')
const actions = require('./actions')
const presets = require('./presets')
const { updateVariableDefinitions } = require('./variables')
const { initFeedbacks } = require('./feedbacks')
//const upgradeScripts = require('./upgrades')

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
				label: 'Target IP',
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

		this.status(this.STATE_OK)
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

	action(action) {
		let cmd
		let arg
		let opt = action.options

		switch (action.action) {
			case 'play':
				cmd = '/mitti/play'
				this.sendNoArg(cmd)
				break

			case 'stop':
				cmd = '/mitti/stop'
				this.sendNoArg(cmd)
				break

			case 'panic':
				cmd = '/mitti/panic'
				this.sendNoArg(cmd)
				break

			case 'rewind':
				cmd = '/mitti/rewind'
				this.sendNoArg(cmd)
				break

			case 'jump_prev':
				cmd = '/mitti/jumpToPrevCue'
				this.sendNoArg(cmd)
				break

			case 'jump_next':
				cmd = '/mitti/jumpToNextCue'
				this.sendNoArg(cmd)
				break

			case 'jump_selected':
				cmd = '/mitti/jumpToSelectedCue'
				this.sendNoArg(cmd)
				break

			case 'select_prev':
				cmd = '/mitti/selectPrevCue'
				this.sendNoArg(cmd)
				break

			case 'select_next':
				cmd = '/mitti/selectNextCue'
				this.sendNoArg(cmd)
				break

			case 'goto_30':
				cmd = '/mitti/goto30'
				this.sendNoArg(cmd)
				break

			case 'goto_20':
				cmd = '/mitti/goto20'
				this.sendNoArg(cmd)
				break

			case 'goto_10':
				cmd = '/mitti/goto10'
				this.sendNoArg(cmd)
				break

			case 'toggle_play':
				cmd = '/mitti/togglePlay'
				this.sendNoArg(cmd)
				break

			case 'play_select':
				cmd = '/mitti/playSelectedCue'
				this.sendNoArg(cmd)
				break

			case 'locate':
				cmd = '/mitti/locate'
				this.sendNoArg(cmd)
				break

			case 'jump_cue':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/jump'
				this.sendNoArg(cmd)
				break

			case 'select_cue':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/select'
				this.sendNoArg(cmd)
				break

			case 'play_cue':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/play'
				this.sendNoArg(cmd)
				break

			case 'playCueName':
				this.parseVariables(opt.string, (value) => {
					opt.string = value
				})
				arg = {
					type: 's',
					value: opt.string,
				}
				cmd = '/mitti/playCueWithName'
				this.sendArg(cmd, arg)
				break

			case 'fullscreenOn':
				cmd = '/mitti/fullscreenOn'
				this.sendNoArg(cmd)
				break

			case 'fullscreenOff':
				cmd = '/mitti/fullscreenOff'
				this.sendNoArg(cmd)
				break

			case 'fullscreenToggle':
				cmd = '/mitti/toggleFullscreen'
				this.sendNoArg(cmd)
				break

			case 'plLoopToggle':
				cmd = '/mitti/toggleLoop'
				this.sendNoArg(cmd)
				break

			case 'plLoopOn':
				cmd = '/mitti/loopOn'
				this.sendNoArg(cmd)
				break

			case 'plLoopOff':
				cmd = '/mitti/loopOff'
				this.sendNoArg(cmd)
				break

			case 'plTransToggle':
				cmd = '/mitti/toggleTransitionOnPlay'
				this.sendNoArg(cmd)
				break

			case 'plTransOff':
				cmd = '/mitti/transitionOnPlayOff'
				this.sendNoArg(cmd)
				break

			case 'plTransOn':
				cmd = '/mitti/transitionOnPlayOn'
				this.sendNoArg(cmd)
				break

			case 'resendOSCFeedback':
				cmd = '/mitti/resendOSCFeedback'
				this.sendNoArg(cmd)
				break

			case 'jumpCueName':
				this.parseVariables(opt.string, (value) => {
					opt.string = value
				})
				arg = {
					type: 's',
					value: opt.string,
				}
				cmd = '/mitti/jumpToCueWithName'
				this.sendArg(cmd, arg)
				break

			case 'toggleAudio':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleAudio'
				this.sendNoArg(cmd)
				break

			case 'audioOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/audioOn'
				this.sendNoArg(cmd)
				break

			case 'audioOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/audioOff'
				this.sendNoArg(cmd)
				break

			case 'toggleFadeIn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleFadeIn'
				this.sendNoArg(cmd)
				break

			case 'fadeInOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/fadeInOn'
				this.sendNoArg(cmd)
				break

			case 'fadeInOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/fadeInOff'
				this.sendNoArg(cmd)
				break

			case 'toggleFadeOut':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleFadeOut'
				this.sendNoArg(cmd)
				break

			case 'fadeOutOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/fadeOutOn'
				this.sendNoArg(cmd)
				break

			case 'fadeOutOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/fadeOutOff'
				this.sendNoArg(cmd)
				break

			case 'toggleLoop':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleLoop'
				this.sendNoArg(cmd)
				break

			case 'loopOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/loopOn'
				this.sendNoArg(cmd)
				break

			case 'loopOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/loopOff'
				this.sendNoArg(cmd)
				break

			case 'togglePauseAtBeginning':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/togglePauseAtBeginning'
				this.sendNoArg(cmd)
				break

			case 'pauseAtBeginningOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/pauseAtBeginningOn'
				this.sendNoArg(cmd)
				break

			case 'pauseAtBeginningOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/pauseAtBeginningOff'
				this.sendNoArg(cmd)
				break

			case 'togglePauseAtEnd':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/togglePauseAtEnd'
				this.sendNoArg(cmd)
				break

			case 'pauseAtEndOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/pauseAtEndOn'
				this.sendNoArg(cmd)
				break

			case 'pauseAtEndOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/pauseAtEndOff'
				this.sendNoArg(cmd)
				break

			case 'toggleTransition':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleTransition'
				this.sendNoArg(cmd)
				break

			case 'transitionOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/transitionOn'
				this.sendNoArg(cmd)
				break

			case 'transitionOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/transitionOff'
				this.sendNoArg(cmd)
				break

			case 'toggleVideoFx':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/toggleVideoFx'
				this.sendNoArg(cmd)
				break

			case 'videoFxOn':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/videoFxOn'
				this.sendNoArg(cmd)
				break

			case 'videoFxOff':
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/videoFxOff'
				this.sendNoArg(cmd)
				break
			case 'scale':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/scaleAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'position':
				if (opt.valueX) {
					arg = {
						type: 's',
						value: opt.valueX,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/posXAsPixels'
					this.sendArg(cmd, arg)
				}
				if (opt.valueY) {
					arg = {
						type: 's',
						value: opt.valueY,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/posYAsPixels'
					this.sendArg(cmd, arg)
				}
				break
			case 'crop':
				if (opt.valueLeft) {
					arg = {
						type: 's',
						value: opt.valueLeft,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/cropLeftAsPixels'
					this.sendArg(cmd, arg)
				}
				if (opt.valueRight) {
					arg = {
						type: 's',
						value: opt.valueRight,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/cropRightAsPixels'
					this.sendArg(cmd, arg)
				}
				if (opt.valueTop) {
					arg = {
						type: 's',
						value: opt.valueTop,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/cropTopAsPixels'
					this.sendArg(cmd, arg)
				}
				if (opt.valueBottom) {
					arg = {
						type: 's',
						value: opt.valueBottom,
					}
					cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/cropBottomAsPixels'
					this.sendArg(cmd, arg)
				}
				break
			case 'rotation':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/rotateAsDegrees'
				this.sendArg(cmd, arg)
				break
			case 'hue':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/hueAsDegrees'
				this.sendArg(cmd, arg)
				break
			case 'saturation':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/saturationAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'vibrance':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/vibranceAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'brightness':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/brightnessAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'contrast':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/contrastAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'opacity':
				arg = {
					type: 's',
					value: opt.value,
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/opacityAsPercent'
				this.sendArg(cmd, arg)
				break
			case 'volume':
				arg = {
					type: 's',
					value: parseFloat(opt.value),
				}
				cmd = '/mitti/' + this.conformCueID(opt.cuenumber) + '/volumeAsDecibels'
				this.sendArg(cmd, arg)
				break
			case 'mainFader':
				if (opt.mode == 'auto') {
					cmd = '/mitti/autoFade'
					this.sendNoArg(cmd)
				} else {
					arg = {
						type: 's',
						value: parseFloat(opt.value / 100),
					}
					cmd = '/mitti/mainFader'
					this.sendArg(cmd, arg)
				}

				break
		}
	}

	sendNoArg(str) {
		this.oscSend(this.config.host, 51000, str, [])
	}

	sendArg(str, str2) {
		this.oscSend(this.config.host, 51000, str, [str2])
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
		this.ready = true

		this.cues = {}

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
			this.ready = true
			this.oscSend(this.config.host, 51000, '/mitti/resendOSCFeedback', [])
		})
		this.listener.on('error', (err) => {
			if (err.code == 'EADDRINUSE') {
				this.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is currently in use.`)
			}
		})

		this.listener.on('message', (message) => {
			let value = message?.args[0]?.value

			if (message.address === '/mitti/currentCueName') {
				this.setVariable('currentCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/currentCueID') {
				this.setVariable('currentCueID', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/previousCueName') {
				this.setVariable('previousCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/nextCueName') {
				this.setVariable('nextCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/selectedCueName') {
				this.setVariable('selectedCueName', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/selectedCueID') {
				this.setVariable('selectedCueID', value != '-' ? value : 'None')
			} else if (message.address === '/mitti/cueTimeLeft') {
				let cueTimeLeft = value
				let cueTimeSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `-${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				this.setVariable('cueTimeLeft', cueTimeHHMMSS)
				this.setVariable('cueTimeLeft_h', cueTimeHH)
				this.setVariable('cueTimeLeft_m', cueTimeMM)
				this.setVariable('cueTimeLeft_s', cueTimeSS)
			} else if (message.address === '/mitti/currentCueTRT') {
				let currentCueTRT = value
				let cueTimeSplit = currentCueTRT.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				this.setVariable('currentCueTRT', cueTimeHHMMSS)
			} else if (message.address === '/mitti/togglePlay') {
				this.playStatus = value === 0 ? 'Paused' : 'Playing'
				this.setVariable('playStatus', this.playStatus)
				this.checkFeedbacks('playStatus')
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
