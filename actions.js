export function getActions() {
	let actions = {
		play: {
			name: 'Play',
			options: [],
			callback: () => {
				this.sendCommand('play')
			},
		},
		toggle_play: {
			name: 'Pause / Resume',
			options: [],
			callback: () => {
				this.sendCommand('togglePlay')
			},
		},
		stop: {
			name: 'Pause',
			options: [],
			callback: () => {
				this.sendCommand('stop')
			},
		},
		panic: {
			name: 'Panic',
			options: [],
			callback: () => {
				this.sendCommand('panic')
			},
		},
		rewind: {
			name: 'Rewind',
			options: [],
			callback: () => {
				this.sendCommand('rewind')
			},
		},
		jump_prev: {
			name: 'Jump to previous cue',
			options: [],
			callback: () => {
				this.sendCommand('jumpToPrevCue')
			},
		},
		jump_next: {
			name: 'Jump to next cue',
			options: [],
			callback: () => {
				this.sendCommand('jumpToNextCue')
			},
		},
		jump_selected: {
			name: 'Jump to selected cue',
			options: [],
			callback: () => {
				this.sendCommand('jumpToSelectedCue')
			},
		},
		select_prev: {
			name: 'Select previous cue',
			options: [],
			callback: () => {
				this.sendCommand('selectPrevCue')
			},
		},
		select_next: {
			name: 'Select next cue',
			options: [],
			callback: () => {
				this.sendCommand('selectNextCue')
			},
		},
		goto_30: {
			name: 'Goto 30',
			options: [],
			callback: () => {
				this.sendCommand('goto30')
			},
		},
		goto_20: {
			name: 'Goto 20',
			options: [],
			callback: () => {
				this.sendCommand('goto20')
			},
		},
		goto_10: {
			name: 'Goto 10',
			options: [],
			callback: () => {
				this.sendCommand('goto10')
			},
		},
		play_select: {
			name: 'Play Selected Cue',
			options: [],
			callback: () => {
				this.sendCommand('playSelectedCue')
			},
		},
		fullscreenToggle: {
			name: 'Toggle Fullscreen',
			options: [],
			callback: () => {
				this.sendCommand('toggleFullscreen')
			},
		},
		fullscreenOn: {
			name: 'Fullscreen On',
			options: [],
			callback: () => {
				this.sendCommand('fullscreenOn')
			},
		},
		fullscreenOff: {
			name: 'Fullscreen Off',
			options: [],
			callback: () => {
				this.sendCommand('fullscreenOff')
			},
		},
		plLoopToggle: {
			name: 'Toggle Playlist Loop',
			options: [],
			callback: () => {
				this.sendCommand('toggleLoop')
			},
		},
		plLoopOn: {
			name: 'Playlist Loop On',
			options: [],
			callback: () => {
				this.sendCommand('loopOn')
			},
		},
		plLoopOff: {
			name: 'Playlist Loop Off',
			options: [],
			callback: () => {
				this.sendCommand('loopOff')
			},
		},
		plTransToggle: {
			name: 'Toggle Playlist Transition on Play',
			options: [],
			callback: () => {
				this.sendCommand('toggleTransitionOnPlay')
			},
		},
		plTransOff: {
			name: 'Transition on Play Off',
			options: [],
			callback: () => {
				this.sendCommand('transitionOnPlayOff')
			},
		},
		plTransOn: {
			name: 'Transition on Play On',
			options: [],
			callback: () => {
				this.sendCommand('transitionOnPlayOn')
			},
		},
		resendOSCFeedback: {
			name: 'Resend OSC feedback',
			options: [],
			callback: () => {
				this.sendCommand('resendOSCFeedback')
			},
		},
		jump_cue: {
			name: 'Jump to specific cue',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/jump`)
			},
		},
		jumpCueName: {
			name: 'Jump to cue with name',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue Name',
					id: 'string',
				},
			],
			callback: (action) => {
				this.parseVariablesInString(action.options.string).then((value) => {
					action.options.string = value
					this.sendCommand('jumpToCueWithName', action.options.string)
				})
			},
		},
		select_cue: {
			name: 'Select Cue',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/select`)
			},
		},
		play_cue: {
			name: 'Play cue with number / ID',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/play`)
			},
		},
		playCueName: {
			name: 'Play cue with name',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue Name',
					id: 'string',
				},
			],
			callback: (action) => {
				this.parseVariablesInString(action.options.string).then((value) => {
					action.options.string = value
					this.sendCommand('playCueWithName', action.options.string)
				})
			},
		},
		audioOn: {
			name: 'Audio On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/audioOn`)
			},
		},
		audioOff: {
			name: 'Audio Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/audioOff`)
			},
		},
		toggleAudio: {
			name: 'Toggle Audio',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleAudio`)
			},
		},
		toggleFadeIn: {
			name: 'Toggle Fade In',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleFadeIn`)
			},
		},
		fadeInOn: {
			name: 'Fade In On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/fadeInOn`)
			},
		},
		fadeInOff: {
			name: 'Fade In Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/fadeInOff`)
			},
		},
		toggleFadeOut: {
			name: 'Toggle Fade Out',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleFadeOut`)
			},
		},
		fadeOutOn: {
			name: 'Fade Out On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/fadeOutOn`)
			},
		},
		fadeOutOff: {
			name: 'Fade Out Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/fadeOutOff`)
			},
		},
		toggleLoop: {
			name: 'Toggle Loop',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleLoop`)
			},
		},
		loopOn: {
			name: 'Loop On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/loopOn`)
			},
		},
		loopOff: {
			name: 'Loop Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/loopOff`)
			},
		},
		togglePauseAtBeginning: {
			name: 'Toggle Pause At Beginning',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/togglePauseAtBeginning`)
			},
		},
		pauseAtBeginningOn: {
			name: 'Pause At Beginning On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/pauseAtBeginningOn`)
			},
		},
		pauseAtBeginningOff: {
			name: 'Pause At Beginning Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/pauseAtBeginningOff`)
			},
		},
		togglePauseAtEnd: {
			name: 'Toggle Pause At End',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/togglePauseAtEnd`)
			},
		},
		pauseAtEndOn: {
			name: 'Pause At End On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/pauseAtEndOn`)
			},
		},
		pauseAtEndOff: {
			name: 'Pause At End Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/pauseAtEndOff`)
			},
		},
		toggleTransition: {
			name: 'Toggle Transition',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleTransition`)
			},
		},
		transitionOn: {
			name: 'Transition On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/transitionOn`)
			},
		},
		transitionOff: {
			name: 'Transition Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/transitionOff`)
			},
		},
		toggleVideoFx: {
			name: 'Toggle VideoFx',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/toggleVideoFx`)
			},
		},
		videoFxOn: {
			name: 'VideoFx On',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/videoFxOn`)
			},
		},
		videoFxOff: {
			name: 'VideoFx Off',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/videoFxOff`)
			},
		},
		scale: {
			name: 'Cue Scale',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/scaleAsPercent`, action.options.value)
			},
		},
		position: {
			name: 'Cue Position',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				if (action.options.valueX) {
					this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/posXAsPixels`, action.options.valueX)
				}
				if (action.options.valueY) {
					this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/posYAsPixels`, action.options.valueY)
				}
			},
		},
		crop: {
			name: 'Cue Crop',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				if (action.options.valueLeft) {
					this.sendCommand(
						`${await this.conformCueID(action.options.cuenumber)}/cropLeftAsPixels`,
						action.options.valueLeft
					)
				}
				if (action.options.valueRight) {
					this.sendCommand(
						`${await this.conformCueID(action.options.cuenumber)}/cropRightAsPixels`,
						action.options.valueRight
					)
				}
				if (action.options.valueTop) {
					this.sendCommand(
						`${await this.conformCueID(action.options.cuenumber)}/cropTopAsPixels`,
						action.options.valueTop
					)
				}
				if (action.options.valueBottom) {
					this.sendCommand(
						`${await this.conformCueID(action.options.cuenumber)}/cropBottomAsPixels`,
						action.options.valueBottom
					)
				}
			},
		},
		rotation: {
			name: 'Cue Rotation',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/rotateAsDegrees`, action.options.value)
			},
		},
		hue: {
			name: 'Cue Hue',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/hueAsDegrees`, action.options.value)
			},
		},
		saturation: {
			name: 'Cue Saturation',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(
					`${await this.conformCueID(action.options.cuenumber)}/saturationAsPercent`,
					action.options.value
				)
			},
		},
		vibrance: {
			name: 'Cue Vibrance',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/vibranceAsPercent`, action.options.value)
			},
		},
		brightness: {
			name: 'Cue Brightness',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(
					`${await this.conformCueID(action.options.cuenumber)}/brightnessAsPercent`,
					action.options.value
				)
			},
		},
		contrast: {
			name: 'Cue Contrast',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/contrastAsPercent`, action.options.value)
			},
		},
		opacity: {
			name: 'Cue Opacity',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(`${await this.conformCueID(action.options.cuenumber)}/opacityAsPercent`, action.options.value)
			},
		},
		volume: {
			name: 'Cue Volume',
			options: [
				{
					type: 'textinput',
					useVariables: true,
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
			callback: async (action) => {
				this.sendCommand(
					`${await this.conformCueID(action.options.cuenumber)}/volumeAsDecibels`,
					parseFloat(action.options.value)
				)
			},
		},
		mainFader: {
			name: 'Master Fader',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 'auto',
					choices: [
						{ id: 'auto', label: 'Auto-Fade' },
						{ id: 'custom', label: 'Custom Value' },
					],
				},
				{
					type: 'number',
					label: 'Fade Value (0 to 100)',
					id: 'value',
					default: 0,
					min: 0,
					max: 100,
					isVisible: (options) => options.mode === 'custom',
				},
			],
			callback: (action) => {
				if (action.options.mode == 'auto') {
					this.sendCommand(`autoFade`)
				} else {
					this.sendCommand(`mainFader`, parseFloat(action.options.value / 100))
				}
			},
		},
	}
	return actions
}
