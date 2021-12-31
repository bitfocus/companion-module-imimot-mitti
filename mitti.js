var instance_skel = require('../../instance_skel')
var OSC = require('osc')
var debug
var log

function instance(system, id, config) {
	var self = this
	// super-constructor
	instance_skel.apply(this, arguments)
	self.actions() // export actions

	return self
}

instance.GetUpgradeScripts = function () {
	return [
		instance_skel.CreateConvertToBooleanFeedbackUpgradeScript({
			playStatus: true,
		}),
	]
}

instance.prototype.updateConfig = function (config) {
	var self = this
	self.config = config
	self.init_presets()
	self.init_variables()
	self.init_feedbacks()
	self.init_osc()
}

instance.prototype.init = function () {
	var self = this
	self.status(self.STATE_OK) // status ok!
	self.init_presets()
	self.init_variables()
	self.init_feedbacks()
	self.init_osc()
	debug = self.debug
	log = self.log
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			tooltip: 'The IP of the computer running Mitti',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'feedbackPort',
			label: 'Feedback Port',
			width: 5,
			tooltip: 'The port designated for Feedback in the OSC/UDP Controls tab in Mitti',
			default: 51001,
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this
	if (self.listener) {
		self.listener.close()
	}
	debug('destroy', self.id)
}

instance.prototype.init_presets = function () {
	var self = this
	var presets = [
		{
			category: 'Playlist',
			label: 'Play',
			bank: {
				style: 'png',
				text: '',
				png64: self.ICON_PLAY_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'play',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Pause / Resume',
			bank: {
				style: 'png',
				text: '',
				png64: self.ICON_PAUSE_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'toggle_play',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Play Selected',
			bank: {
				style: 'text',
				text: 'Play\\nSelected',
				size: '14',
				color: self.rgb(0, 0, 0),
				bgcolor: self.rgb(0, 255, 0),
			},
			actions: [
				{
					action: 'play_select',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Pause',
			bank: {
				style: 'text',
				text: 'Pause',
				size: '14',
				//color: '16777215',
				color: self.rgb(0, 0, 0),
				bgcolor: self.rgb(255, 255, 0),
			},
			actions: [
				{
					action: 'stop',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Panic',
			bank: {
				style: 'text',
				text: 'Panic',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(255, 0, 0),
			},
			actions: [
				{
					action: 'panic',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Rewind',
			bank: {
				style: 'text',
				text: 'Rewind',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'rewind',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Jump to previous',
			bank: {
				style: 'text',
				text: 'Jump\\nPrevious',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'jump_prev',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Jump to next',
			bank: {
				style: 'text',
				text: 'Jump\\nNext',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'jump_next',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Jump to selected',
			bank: {
				style: 'text',
				text: 'Jump\\nSelected',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'jump_selected',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Select previous',
			bank: {
				style: 'text',
				text: 'Select\\nPrevious',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'select_prev',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Select next',
			bank: {
				style: 'text',
				text: 'Select\\nNext',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'select_next',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Goto 30',
			bank: {
				style: 'text',
				text: 'Goto\\n30',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'goto_30',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Goto 20',
			bank: {
				style: 'text',
				text: 'Goto\\n20',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'goto_20',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Goto 10',
			bank: {
				style: 'text',
				text: 'Goto\\n10',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'goto_10',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Toggle Fullscreen',
			bank: {
				style: 'text',
				text: 'Toggle\\nFullscreen',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fullscreenToggle',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Fullscreen On',
			bank: {
				style: 'text',
				text: 'Fullscreen\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fullscreenOn',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Fullscreen Off',
			bank: {
				style: 'text',
				text: 'Fullscreen\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fullscreenOff',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Toggle Playlist Loop',
			bank: {
				style: 'text',
				text: 'Toggle\\nPlaylist\\nLoop',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plLoopToggle',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Playlist Loop On',
			bank: {
				style: 'text',
				text: 'Playlist\\nLoop\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plLoopOn',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Playlist Loop Off',
			bank: {
				style: 'text',
				text: 'Playlist\\nLoop\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plLoopOff',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Toggle Transition on Play',
			bank: {
				style: 'text',
				text: 'Toggle\\nTransition',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plTransToggle',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Transition on Play Off',
			bank: {
				style: 'text',
				text: 'Playlist\\nTransition\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plTransOff',
				},
			],
		},
		{
			category: 'Playlist',
			label: 'Transition on Play On',
			bank: {
				style: 'text',
				text: 'Playlist\\nTransition\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'plTransOn',
				},
			],
		},
		{
			category: 'Cue',
			label: 'Play Cue',
			bank: {
				style: 'text',
				text: 'Play\\nCue\\n(Number)',
				size: '14',
				color: self.rgb(0, 0, 0),
				bgcolor: self.rgb(0, 255, 0),
			},
			actions: [
				{
					action: 'play_cue',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Jump to cue with (name) and Play',
			bank: {
				style: 'text',
				text: 'Play\\nCue\\n(Name)',
				size: '14',
				color: self.rgb(0, 0, 0),
				bgcolor: self.rgb(0, 255, 0),
			},
			actions: [
				{
					action: 'jumpCueName',
					options: {
						string: '',
					},
				},
				{
					action: 'play',
					delay: '100',
				},
			],
		},
		{
			category: 'Cue',
			label: 'Jump to cue with name',
			bank: {
				style: 'text',
				text: 'Jump\\nCue\\n(Name)',
				size: '14',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'jumpCueName',
					options: {
						string: '',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Jump to specific cue',
			bank: {
				style: 'text',
				text: 'Jump\\nCue\\n(Number)',
				size: '14',
				//color: '16777215',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'jump_cue',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Select cue ',
			bank: {
				style: 'text',
				text: 'Select\\nCue\\n(Number)',
				size: '14',
				//color: '16777215',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'select_cue',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Fade In',
			bank: {
				style: 'text',
				text: 'Toggle\\nFade\\nIn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleFadeIn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Fade In On',
			bank: {
				style: 'text',
				text: 'Fade\\nIn\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fadeInOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Fade In Off',
			bank: {
				style: 'text',
				text: 'Fade\\nIn\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fadeInOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Fade Out',
			bank: {
				style: 'text',
				text: 'Toggle\\nFade\\nOut',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleFadeOut',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Fade Out On',
			bank: {
				style: 'text',
				text: 'Fade\\nOut\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fadeOutOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Fade Out Off',
			bank: {
				style: 'text',
				text: 'Fade\\nOut\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'fadeOutOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Audio',
			bank: {
				style: 'text',
				text: 'Toggle\\nAudio',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleAudio',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Audio ON',
			bank: {
				style: 'text',
				text: 'Audio\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'audioOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Audio OFF',
			bank: {
				style: 'text',
				text: 'Audio\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'audioOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Loop',
			bank: {
				style: 'text',
				text: 'Toggle\\nLoop',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleLoop',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Loop ON',
			bank: {
				style: 'text',
				text: 'Loop\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'loopOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'LOOP OFF',
			bank: {
				style: 'text',
				text: 'Loop\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'loopOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Pause at Beginning',
			bank: {
				style: 'text',
				text: 'Toggle\\nPause\\nBeginning',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'togglePauseAtBeginning',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Pause At Beginning On',
			bank: {
				style: 'text',
				text: 'Pause\\nBeginning\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'pauseAtBeginningOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Pause At Beginning Off',
			bank: {
				style: 'text',
				text: 'Pause\\nBeginning\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'pauseAtBeginningOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Pause at End',
			bank: {
				style: 'text',
				text: 'Toggle\\nPause\\nEnd',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'togglePauseAtEnd',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Pause At End On',
			bank: {
				style: 'text',
				text: 'Pause\\nEnd\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'pauseAtEndOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Pause At End Off',
			bank: {
				style: 'text',
				text: 'Pause\\nEnd\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'pauseAtEndOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle Transition',
			bank: {
				style: 'text',
				text: 'Toggle\\nTransition',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleTransition',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Transition On',
			bank: {
				style: 'text',
				text: 'Transition\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'transitionOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Transition Off',
			bank: {
				style: 'text',
				text: 'Transition\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'transitionOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'Toggle VideoFx',
			bank: {
				style: 'text',
				text: 'Toggle\\nVideoFx',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'toggleVideoFx',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'VideoFx On',
			bank: {
				style: 'text',
				text: 'VideoFx\\nOn',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'videoFxOn',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
		{
			category: 'Cue',
			label: 'VideoFx Off',
			bank: {
				style: 'text',
				text: 'VideoFx\\nOff',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 100),
			},
			actions: [
				{
					action: 'videoFxOff',
					options: {
						cuenumber: 'current',
					},
				},
			],
		},
	]

	self.setPresetDefinitions(presets)
}

instance.prototype.actions = function (system) {
	var self = this

	self.system.emit('instance_actions', self.id, {
		play: { label: 'Play' },
		toggle_play: { label: 'Pause / Resume' },
		stop: { label: 'Pause' },
		panic: { label: 'Panic' },
		rewind: { label: 'Rewind' },
		jump_prev: { label: 'Jump to previous cue' },
		jump_next: { label: 'Jump to next cue' },
		jump_selected: { label: 'Jump to selected cue' },
		select_prev: { label: 'Select previous cue' },
		select_next: { label: 'Select next cue' },
		goto_30: { label: 'Goto 30' },
		goto_20: { label: 'Goto 20' },
		goto_10: { label: 'Goto 10' },
		play_select: { label: 'Play Selected Cue' },
		fullscreenToggle: { label: 'Toggle Fullscreen' },
		fullscreenOn: { label: 'Fullscreen On' },
		fullscreenOff: { label: 'Fullscreen Off' },
		plLoopToggle: { label: 'Toggle Playlist Loop' },
		plLoopOn: { label: 'Playlist Loop On' },
		plLoopOff: { label: 'Playlist Loop Off' },
		plTransToggle: { label: 'Toggle Playlist Transition on Play' },
		plTransOff: { label: 'Transition on Play Off' },
		plTransOn: { label: 'Transition on Play On' },
		resendOSCFeedback: { label: 'Resend OSC feedback' },
		jump_cue: {
			label: 'Jump to specific cue',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		jumpCueName: {
			label: 'Jump to cue with name',
			options: [
				{
					type: 'textinput',
					label: 'Cue Name',
					id: 'string',
				},
			],
		},
		select_cue: {
			label: 'Select Cue',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		play_cue: {
			label: 'Play cue with number / ID',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		playCueName: {
			label: 'Play cue with name',
			options: [
				{
					type: 'textinput',
					label: 'Cue Name',
					id: 'string',
				},
			],
		},
		audioOn: {
			label: 'Audio On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		audioOff: {
			label: 'Audio On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleAudio: {
			label: 'Toggle Audio',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleFadeIn: {
			label: 'Toggle Fade In',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		fadeInOn: {
			label: 'Fade In On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		fadeInOff: {
			label: 'Fade In Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleFadeOut: {
			label: 'Toggle Fade Out',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		fadeOutOn: {
			label: 'Fade Out On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		fadeOutOff: {
			label: 'Fade Out Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleLoop: {
			label: 'Toggle Loop',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		loopOn: {
			label: 'Loop On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		loopOff: {
			label: 'Loop Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		togglePauseAtBeginning: {
			label: 'Toggle Pause At Beginning',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		pauseAtBeginningOn: {
			label: 'Pause At Beginning On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		pauseAtBeginningOff: {
			label: 'Pause At Beginning Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		togglePauseAtEnd: {
			label: 'Toggle Pause At End',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		pauseAtEndOn: {
			label: 'Pause At End On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		pauseAtEndOff: {
			label: 'Pause At End Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleTransition: {
			label: 'Toggle Transition',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		transitionOn: {
			label: 'Transition On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		transitionOff: {
			label: 'Transition Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		toggleVideoFx: {
			label: 'Toggle VideoFx',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		videoFxOn: {
			label: 'VideoFx On',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		videoFxOff: {
			label: 'VideoFx Off',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
		},
		scale: {
			label: 'Cue Scale',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Scale (%)',
					id: 'value',
					default: 0,
					min: 0,
					max: 200,
				},
			],
		},
		position: {
			label: 'Cue Position',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'textinput',
					label: 'Position X (pixels, optional)',
					id: 'valueX',
				},
				{
					type: 'textinput',
					label: 'Position Y (pixels, optional)',
					id: 'valueY',
				},
			],
		},
		crop: {
			label: 'Cue Crop',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'textinput',
					label: 'Crop Left (pixels, optional)',
					id: 'valueLeft',
				},
				{
					type: 'textinput',
					label: 'Crop Right (pixels, optional)',
					id: 'valueRight',
				},
				{
					type: 'textinput',
					label: 'Crop Top (pixels, optional)',
					id: 'valueTop',
				},
				{
					type: 'textinput',
					label: 'Crop Bottom (pixels, optional)',
					id: 'valueBottom',
				},
			],
		},
		rotation: {
			label: 'Cue Rotation',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Degrees (°)',
					id: 'value',
					default: 0,
					min: -180,
					max: 180,
				},
			],
		},
		hue: {
			label: 'Cue Hue',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Degrees (°)',
					id: 'value',
					default: 0,
					min: -180,
					max: 180,
				},
			],
		},
		saturation: {
			label: 'Cue Saturation',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Saturation (%)',
					id: 'value',
					default: 0,
					min: -100,
					max: 100,
				},
			],
		},
		vibrance: {
			label: 'Cue Vibrance',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Vibrance (%)',
					id: 'value',
					default: 0,
					min: -100,
					max: 100,
				},
			],
		},
		brightness: {
			label: 'Cue Brightness',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Brightness (%)',
					id: 'value',
					default: 0,
					min: -100,
					max: 100,
				},
			],
		},
		contrast: {
			label: 'Cue Brightness',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Contrast (%)',
					id: 'value',
					default: 0,
					min: -100,
					max: 100,
				},
			],
		},
		opacity: {
			label: 'Cue Opacity',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Opacity (%)',
					id: 'value',
					default: 100,
					min: 0,
					max: 100,
				},
			],
		},
		volume: {
			label: 'Cue Volume',
			options: [
				{
					type: 'textinput',
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Volume (db, -60 to 6)',
					id: 'value',
					default: 0,
					min: -60,
					max: 6,
				},
			],
		},
	})
}

instance.prototype.sendNoArg = function (str) {
	var self = this
	self.system.emit('osc_send', self.config.host, 51000, str, [])
	debug('Command =', str)
}

instance.prototype.sendArg = function (str, str2) {
	var self = this
	self.system.emit('osc_send', self.config.host, 51000, str, [str2])
	debug('Command =', str, str2)
}

instance.prototype.conformCueID = function (cueID) {
	if (!cueID.match(/^(current|previous|next)$/)) {
		cueID = cueID.toUpperCase().slice(0, 6)
	}
	return cueID
}

instance.prototype.action = function (action) {
	var self = this
	var cmd
	var arg
	var opt = action.options

	switch (action.action) {
		case 'play':
			cmd = '/mitti/play'
			self.sendNoArg(cmd)
			break

		case 'stop':
			cmd = '/mitti/stop'
			self.sendNoArg(cmd)
			break

		case 'panic':
			cmd = '/mitti/panic'
			self.sendNoArg(cmd)
			break

		case 'rewind':
			cmd = '/mitti/rewind'
			self.sendNoArg(cmd)
			break

		case 'jump_prev':
			cmd = '/mitti/jumpToPrevCue'
			self.sendNoArg(cmd)
			break

		case 'jump_next':
			cmd = '/mitti/jumpToNextCue'
			self.sendNoArg(cmd)
			break

		case 'jump_selected':
			cmd = '/mitti/jumpToSelectedCue'
			self.sendNoArg(cmd)
			break

		case 'select_prev':
			cmd = '/mitti/selectPrevCue'
			self.sendNoArg(cmd)
			break

		case 'select_next':
			cmd = '/mitti/selectNextCue'
			self.sendNoArg(cmd)
			break

		case 'goto_30':
			cmd = '/mitti/goto30'
			self.sendNoArg(cmd)
			break

		case 'goto_20':
			cmd = '/mitti/goto20'
			self.sendNoArg(cmd)
			break

		case 'goto_10':
			cmd = '/mitti/goto10'
			self.sendNoArg(cmd)
			break

		case 'toggle_play':
			cmd = '/mitti/togglePlay'
			self.sendNoArg(cmd)
			break

		case 'play_select':
			cmd = '/mitti/playSelectedCue'
			self.sendNoArg(cmd)
			break

		case 'locate':
			cmd = '/mitti/locate'
			self.sendNoArg(cmd)
			break

		case 'jump_cue':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/jump'
			self.sendNoArg(cmd)
			break

		case 'select_cue':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/select'
			self.sendNoArg(cmd)
			break

		case 'play_cue':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/play'
			self.sendNoArg(cmd)
			break

		case 'playCueName':
			arg = {
				type: 's',
				value: opt.string,
			}
			cmd = '/mitti/playCueWithName'
			self.sendArg(cmd, arg)
			break

		case 'fullscreenOn':
			cmd = '/mitti/fullscreenOn'
			self.sendNoArg(cmd)
			break

		case 'fullscreenOff':
			cmd = '/mitti/fullscreenOff'
			self.sendNoArg(cmd)
			break

		case 'fullscreenToggle':
			cmd = '/mitti/toggleFullscreen'
			self.sendNoArg(cmd)
			break

		case 'plLoopToggle':
			cmd = '/mitti/toggleLoop'
			self.sendNoArg(cmd)
			break

		case 'plLoopOn':
			cmd = '/mitti/loopOn'
			self.sendNoArg(cmd)
			break

		case 'plLoopOff':
			cmd = '/mitti/loopOff'
			self.sendNoArg(cmd)
			break

		case 'plTransToggle':
			cmd = '/mitti/toggleTransitionOnPlay'
			self.sendNoArg(cmd)
			break

		case 'plTransOff':
			cmd = '/mitti/transitionOnPlayOff'
			self.sendNoArg(cmd)
			break

		case 'plTransOn':
			cmd = '/mitti/transitionOnPlayOn'
			self.sendNoArg(cmd)
			break

		case 'resendOSCFeedback':
			cmd = '/mitti/resendOSCFeedback'
			self.sendNoArg(cmd)
			break

		case 'jumpCueName':
			arg = {
				type: 's',
				value: opt.string,
			}
			cmd = '/mitti/jumpToCueWithName'
			self.sendArg(cmd, arg)
			break

		case 'toggleAudio':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleAudio'
			self.sendNoArg(cmd)
			break

		case 'audioOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/audioOn'
			self.sendNoArg(cmd)
			break

		case 'audioOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/audioOff'
			self.sendNoArg(cmd)
			break

		case 'toggleFadeIn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleFadeIn'
			self.sendNoArg(cmd)
			break

		case 'fadeInOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/fadeInOn'
			self.sendNoArg(cmd)
			break

		case 'fadeInOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/fadeInOff'
			self.sendNoArg(cmd)
			break

		case 'toggleFadeOut':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleFadeOut'
			self.sendNoArg(cmd)
			break

		case 'fadeOutOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/fadeOutOn'
			self.sendNoArg(cmd)
			break

		case 'fadeOutOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/fadeOutOff'
			self.sendNoArg(cmd)
			break

		case 'toggleLoop':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleLoop'
			self.sendNoArg(cmd)
			break

		case 'loopOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/loopOn'
			self.sendNoArg(cmd)
			break

		case 'loopOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/loopOff'
			self.sendNoArg(cmd)
			break

		case 'togglePauseAtBeginning':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/togglePauseAtBeginning'
			self.sendNoArg(cmd)
			break

		case 'pauseAtBeginningOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/pauseAtBeginningOn'
			self.sendNoArg(cmd)
			break

		case 'pauseAtBeginningOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/pauseAtBeginningOff'
			self.sendNoArg(cmd)
			break

		case 'togglePauseAtEnd':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/togglePauseAtEnd'
			self.sendNoArg(cmd)
			break

		case 'pauseAtEndOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/pauseAtEndOn'
			self.sendNoArg(cmd)
			break

		case 'pauseAtEndOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/pauseAtEndOff'
			self.sendNoArg(cmd)
			break

		case 'toggleTransition':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleTransition'
			self.sendNoArg(cmd)
			break

		case 'transitionOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/transitionOn'
			self.sendNoArg(cmd)
			break

		case 'transitionOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/transitionOff'
			self.sendNoArg(cmd)
			break

		case 'toggleVideoFx':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/toggleVideoFx'
			self.sendNoArg(cmd)
			break

		case 'videoFxOn':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/videoFxOn'
			self.sendNoArg(cmd)
			break

		case 'videoFxOff':
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/videoFxOff'
			self.sendNoArg(cmd)
			break
		case 'scale':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/scaleAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'position':
			if (opt.valueX) {
				arg = {
					type: 's',
					value: opt.valueX,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/posXAsPixels'
				self.sendArg(cmd, arg)
			}
			if (opt.valueY) {
				arg = {
					type: 's',
					value: opt.valueY,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/posYAsPixels'
				self.sendArg(cmd, arg)
			}
			break
		case 'crop':
			if (opt.valueLeft) {
				arg = {
					type: 's',
					value: opt.valueLeft,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/cropLeftAsPixels'
				self.sendArg(cmd, arg)
			}
			if (opt.valueRight) {
				arg = {
					type: 's',
					value: opt.valueRight,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/cropRightAsPixels'
				self.sendArg(cmd, arg)
			}
			if (opt.valueTop) {
				arg = {
					type: 's',
					value: opt.valueTop,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/cropTopAsPixels'
				self.sendArg(cmd, arg)
			}
			if (opt.valueBottom) {
				arg = {
					type: 's',
					value: opt.valueBottom,
				}
				cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/cropBottomAsPixels'
				self.sendArg(cmd, arg)
			}
			break
		case 'rotation':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/rotateAsDegrees'
			self.sendArg(cmd, arg)
			break
		case 'hue':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/hueAsDegrees'
			self.sendArg(cmd, arg)
			break
		case 'saturation':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/saturationAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'vibrance':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/vibranceAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'brightness':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/brightnessAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'contrast':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/contrastAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'opacity':
			arg = {
				type: 's',
				value: opt.value,
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/opacityAsPercent'
			self.sendArg(cmd, arg)
			break
		case 'volume':
			arg = {
				type: 's',
				value: parseFloat(opt.value),
			}
			cmd = '/mitti/' + self.conformCueID(opt.cuenumber) + '/volumeAsDecibels'
			self.sendArg(cmd, arg)
			break
	}
}

instance.prototype.init_osc = function () {
	var self = this
	self.ready = true

	if (self.listener) {
		self.listener.close()
	}

	self.listener = new OSC.UDPPort({
		localAddress: '0.0.0.0',
		localPort: self.config.feedbackPort,
		broadcast: true,
		metadata: true,
	})

	self.listener.open()

	self.listener.on('ready', function () {
		self.ready = true
		self.system.emit('osc_send', self.config.host, 51000, '/mitti/resendOSCFeedback', [])
	})
	self.listener.on('error', function (err) {
		if (err.code == 'EADDRINUSE') {
			self.log('error', 'Error: Selected port in use.' + err.message)
		}
	})

	self.listener.on('message', function (message) {
		var a = message.address.split('/')
		if (message.address === '/mitti/currentCueName') {
			if (message.args.length > 0) {
				var currentCueName = message.args[0].value
				if (typeof currentCueName === 'string') {
					if (currentCueName === '-') {
						currentCueName = 'None'
					}
					self.setVariable('currentCueName', currentCueName)
				}
			}
		} else if (message.address === '/mitti/previousCueName') {
			if (message.args.length > 0) {
				var previousCueName = message.args[0].value
				if (typeof previousCueName === 'string') {
					if (previousCueName === '-') {
						previousCueName = 'None'
					}
					self.setVariable('previousCueName', previousCueName)
				}
			}
		} else if (message.address === '/mitti/nextCueName') {
			if (message.args.length > 0) {
				var nextCueName = message.args[0].value
				if (typeof nextCueName === 'string') {
					if (nextCueName === '-') {
						nextCueName = 'None'
					}
					self.setVariable('nextCueName', nextCueName)
				}
			}
		} else if (message.address === '/mitti/selectedCueName') {
			if (message.args.length > 0) {
				var selectedCueName = message.args[0].value
				if (typeof selectedCueName === 'string') {
					if (selectedCueName === '-') {
						selectedCueName = 'None'
					}
					self.setVariable('selectedCueName', selectedCueName)
				}
			}
		} else if (message.address === '/mitti/cueTimeLeft') {
			if (message.args.length > 0) {
				var cueTimeLeft = message.args[0].value
				let cueTimeSplit = cueTimeLeft.match(/^-(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `-${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				self.setVariable('cueTimeLeft', cueTimeHHMMSS)
				self.setVariable('cueTimeLeft_h', cueTimeHH)
				self.setVariable('cueTimeLeft_m', cueTimeMM)
				self.setVariable('cueTimeLeft_s', cueTimeSS)
			}
		} else if (message.address === '/mitti/currentCueTRT') {
			if (message.args.length > 0) {
				var currentCueTRT = message.args[0].value
				let cueTimeSplit = currentCueTRT.match(/^(?<hh>\d\d):(?<mm>\d\d):(?<ss>\d\d)/i)

				let cueTimeHH = cueTimeSplit.groups.hh
				let cueTimeMM = cueTimeSplit.groups.mm
				let cueTimeSS = cueTimeSplit.groups.ss
				let cueTimeHHMMSS = `${cueTimeHH == '00' ? '' : cueTimeHH + ':'}${cueTimeMM}:${cueTimeSS}`

				self.setVariable('currentCueTRT', cueTimeHHMMSS)
			}
		} else if (message.address === '/mitti/togglePlay') {
			if (message.args.length >= 0) {
				var togglePlayStatus = message.args[0].value
				if (typeof togglePlayStatus === 'number') {
					if (togglePlayStatus === 0) {
						self.playStatus = 'Paused'
					} else {
						self.playStatus = 'Playing'
					}
					self.setVariable('playStatus', self.playStatus)
					self.checkFeedbacks('playStatus')
				}
			}
		}
	})
}

instance.prototype.init_variables = function () {
	var self = this
	var variables = []

	var currentCueName = 'None'
	var previousCueName = 'None'
	var nextCueName = 'None'
	var selectedCueName = 'None'
	var cueTimeLeft = '-00:00:00'
	var currentCueTRT = '00:00:00'
	var playStatus = 'Paused'

	variables.push({
		label: 'Currently playing cue',
		name: 'currentCueName',
	})
	self.setVariable('currentCueName', currentCueName)

	variables.push({
		label: 'Previous cue in playlist',
		name: 'previousCueName',
	})
	self.setVariable('previousCueName', previousCueName)

	variables.push({
		label: 'Next cue in playlist',
		name: 'nextCueName',
	})
	self.setVariable('nextCueName', nextCueName)

	variables.push({
		label: 'Selected cue in playlist',
		name: 'selectedCueName',
	})
	self.setVariable('selectedCueName', selectedCueName)

	variables.push({
		label: 'Play/ Pause Status',
		name: 'playStatus',
	})
	self.setVariable('playStatus', playStatus)

	variables.push({
		label: 'Time remaining for current cue (-HH:MM:SS)',
		name: 'cueTimeLeft',
	})
	self.setVariable('cueTimeLeft', cueTimeLeft)

	variables.push({
		label: 'Time remaining for current cue (hours)',
		name: 'cueTimeLeft_h',
	})
	self.setVariable('cueTimeLeft_h', '00')

	variables.push({
		label: 'Time remaining for current cue (minutes)',
		name: 'cueTimeLeft_m',
	})
	self.setVariable('cueTimeLeft_m', '00')

	variables.push({
		label: 'Time remaining for current cue (seconds)',
		name: 'cueTimeLeft_s',
	})
	self.setVariable('cueTimeLeft_s', '00')

	variables.push({
		label: 'Total run time (TRT) for current cue',
		name: 'currentCueTRT',
	})
	self.setVariable('currentCueTRT', currentCueTRT)

	self.setVariableDefinitions(variables)
}

instance.prototype.init_feedbacks = function () {
	var self = this
	var feedbacks = {}

	feedbacks['playStatus'] = {
		type: 'boolean',
		label: 'Change colors based on Play/Pause status',
		description: 'Change colors based on Play/Pause status',
		style: {
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 200, 0),
		},
		options: [
			{
				type: 'dropdown',
				label: 'Status',
				id: 'playPause',
				default: 'Playing',
				choices: [
					{ id: 'Playing', label: 'Playing' },
					{ id: 'Paused', label: 'Paused' },
				],
			},
		],
	}
	self.setFeedbackDefinitions(feedbacks)
}

instance.prototype.feedback = function (feedback, bank) {
	var self = this

	if (feedback.type === 'playStatus') {
		if (self.playStatus === feedback.options.playPause) {
			return true
		}
	}

	return false
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
