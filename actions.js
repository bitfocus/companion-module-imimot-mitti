export function getActions() {
	let cueToolTip = 'You can also use "current", "selected", "previous", "next" or "all"'

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
			options: [
				{
					type: 'checkbox',
					label: 'Force Cut',
					tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
					id: 'forceCut',
					default: false,
				},
			],
			callback: (action) => {
				if (action.options.forceCut) {
					this.sendCommand('playSelectedCueForceCut')
				} else {
					this.sendCommand('playSelectedCue')
				}
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
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/jump`)
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
			callback: async (action) => {
				const value = await this.parseVariablesInString(action.options.string)
				this.sendCommand('jumpToCueWithName', value)
			},
		},
		select_cue: {
			name: 'Select Cue',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/select`)
			},
		},
		play_cue: {
			name: 'Play cue with number / ID',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'checkbox',
					label: 'Force Cut',
					tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
					id: 'forceCut',
					default: false,
				},
			],
			callback: async (action, context) => {
				const cueID = await this.conformCueID(context, action.options.cuenumber)
				if (action.options.forceCut) {
					this.sendCommand(`playCueWithCueIDForceCut`, cueID)
				} else {
					this.sendCommand(`playCueWithCueID`, cueID)
				}
			},
		},
		playCueIndex: {
			name: 'Play cue at index',
			options: [
				{
					type: 'textinput',
					tooltip: 'Must be a number between 1 and 999',
					useVariables: true,
					label: 'Cue index',
					id: 'index',
					default: '1',
				},
				{
					type: 'checkbox',
					label: 'Force Cut',
					tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
					id: 'forceCut',
					default: false,
				},
			],
			callback: async (action) => {
				let index = await this.parseVariablesInString(action.options.index)
				index = parseInt(index)
				if (isNaN(index) || index < 1 || index > 999) {
					this.log('warn', 'Index must be a number between 1 and 999')
				} else {
					if (action.options.forceCut) {
						this.sendCommand(`playCueAtIndexForceCut`, index, 'i')
					} else {
						this.sendCommand(`playCueAtIndex`, index, 'i')
					}
				}
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
				{
					type: 'checkbox',
					label: 'Force Cut',
					tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
					id: 'forceCut',
					default: false,
				},
			],
			callback: async (action) => {
				const value = await this.parseVariablesInString(action.options.string)
				if (action.options.forceCut) {
					this.sendCommand('playCueWithNameForceCut', value)
				} else {
					this.sendCommand('playCueWithName', value)
				}
			},
		},
		audioOn: {
			name: 'Audio On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/audioOn`)
			},
		},
		audioOff: {
			name: 'Audio Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/audioOff`)
			},
		},
		toggleAudio: {
			name: 'Toggle Audio',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleAudio`)
			},
		},
		toggleFadeIn: {
			name: 'Toggle Fade In',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleFadeIn`)
			},
		},
		fadeInOn: {
			name: 'Fade In On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/fadeInOn`)
			},
		},
		fadeInOff: {
			name: 'Fade In Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/fadeInOff`)
			},
		},
		toggleFadeOut: {
			name: 'Toggle Fade Out',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleFadeOut`)
			},
		},
		fadeOutOn: {
			name: 'Fade Out On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/fadeOutOn`)
			},
		},
		fadeOutOff: {
			name: 'Fade Out Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/fadeOutOff`)
			},
		},
		toggleGoto: {
			name: 'Toggle Goto Cue after End',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleGoto`)
			},
		},
		gotoOn: {
			name: 'Goto after End On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/gotoOn`)
			},
		},
		gotoOff: {
			name: 'Goto after End Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/gotoOff`)
			},
		},
		setGotoToCueID: {
			name: 'Set Goto after End Cue',
			description: 'Requires Mitti 2.2.8',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'textinput',
					useVariables: true,
					label: 'Goto Cue number or ID',
					id: 'gotoCue',
					default: '2',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/setGotoToCueID`,
					`${await this.conformCueID(context, action.options.gotoCue)}`,
				)
			},
		},
		toggleLoop: {
			name: 'Toggle Loop',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleLoop`)
			},
		},
		loopOn: {
			name: 'Loop On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/loopOn`)
			},
		},
		loopOff: {
			name: 'Loop Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/loopOff`)
			},
		},
		togglePauseAtBeginning: {
			name: 'Toggle Pause At Beginning',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/togglePauseAtBeginning`)
			},
		},
		pauseAtBeginningOn: {
			name: 'Pause At Beginning On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/pauseAtBeginningOn`)
			},
		},
		pauseAtBeginningOff: {
			name: 'Pause At Beginning Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/pauseAtBeginningOff`)
			},
		},
		togglePauseAtEnd: {
			name: 'Toggle Pause At End',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/togglePauseAtEnd`)
			},
		},
		pauseAtEndOn: {
			name: 'Pause At End On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/pauseAtEndOn`)
			},
		},
		pauseAtEndOff: {
			name: 'Pause At End Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/pauseAtEndOff`)
			},
		},
		toggleTransition: {
			name: 'Toggle Transition',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleTransition`)
			},
		},
		transitionOn: {
			name: 'Transition On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/transitionOn`)
			},
		},
		transitionOff: {
			name: 'Transition Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/transitionOff`)
			},
		},
		toggleVideoFx: {
			name: 'Toggle VideoFx',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/toggleVideoFx`)
			},
		},
		videoFxOn: {
			name: 'VideoFx On',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/videoFxOn`)
			},
		},
		videoFxOff: {
			name: 'VideoFx Off',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
			],
			callback: async (action, context) => {
				this.sendCommand(`${await this.conformCueID(context, action.options.cuenumber)}/videoFxOff`)
			},
		},
		scale: {
			name: 'Cue Scale',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Scale (%)',
					id: 'value',
					default: 100,
					min: 0,
					max: 200,
					isVisible: (options) => !options.splitScale,
				},
				{
					type: 'checkbox',
					label: 'Scale H/V Separately',
					id: 'splitScale',
					default: false,
				},
				{
					type: 'number',
					label: 'Scale H (%)',
					id: 'valueH',
					default: 100,
					min: 0,
					max: 200,
					isVisible: (options) => options.splitScale,
				},
				{
					type: 'number',
					label: 'Scale V (%)',
					id: 'valueV',
					default: 100,
					min: 0,
					max: 200,
					isVisible: (options) => options.splitScale,
				},
			],
			callback: async (action, context) => {
				let cue = await this.conformCueID(context, action.options.cuenumber)
				if (action.options.splitScale) {
					this.sendCommand(`${cue}/scaleHAsPercent`, action.options.valueH)
					this.sendCommand(`${cue}/scaleVAsPercent`, action.options.valueV)
				} else {
					this.sendCommand(`${cue}/scaleAsPercent`, action.options.value)
				}
			},
		},
		position: {
			name: 'Cue Position',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				if (action.options.valueX) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/posXAsPixels`,
						action.options.valueX,
					)
				}
				if (action.options.valueY) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/posYAsPixels`,
						action.options.valueY,
					)
				}
			},
		},
		crop: {
			name: 'Cue Crop',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				if (action.options.valueLeft) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/cropLeftAsPixels`,
						action.options.valueLeft,
					)
				}
				if (action.options.valueRight) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/cropRightAsPixels`,
						action.options.valueRight,
					)
				}
				if (action.options.valueTop) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/cropTopAsPixels`,
						action.options.valueTop,
					)
				}
				if (action.options.valueBottom) {
					this.sendCommand(
						`${await this.conformCueID(context, action.options.cuenumber)}/cropBottomAsPixels`,
						action.options.valueBottom,
					)
				}
			},
		},
		rotation: {
			name: 'Cue Rotation',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/rotateAsDegrees`,
					action.options.value,
				)
			},
		},
		hue: {
			name: 'Cue Hue',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/hueAsDegrees`,
					action.options.value,
				)
			},
		},
		saturation: {
			name: 'Cue Saturation',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/saturationAsPercent`,
					action.options.value,
				)
			},
		},
		vibrance: {
			name: 'Cue Vibrance',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/vibranceAsPercent`,
					action.options.value,
				)
			},
		},
		brightness: {
			name: 'Cue Brightness',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/brightnessAsPercent`,
					action.options.value,
				)
			},
		},
		contrast: {
			name: 'Cue Contrast',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/contrastAsPercent`,
					action.options.value,
				)
			},
		},
		opacity: {
			name: 'Cue Opacity',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/opacityAsPercent`,
					action.options.value,
				)
			},
		},
		volume: {
			name: 'Cue Volume',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
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
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/volumeAsDecibels`,
					parseFloat(action.options.value),
				)
			},
		},
		mainFader: {
			name: 'Master Fader',
			description: 'Requires Mitti 2.2.0',
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
		playhead: {
			name: 'Adjust Playhead',
			options: [
				{
					type: 'number',
					label: 'Adjustment Amount (-100% to 100%)',
					id: 'value',
					default: 1,
					min: -100,
					max: 100,
					range: true,
					step: 1,
				},
			],
			callback: (action) => {
				let currentValue = this.states.playhead ? this.states.playhead : 0
				let newValue = currentValue * 100 + action.options.value
				newValue = parseFloat(newValue / 100)

				if (newValue < 0) {
					newValue = 0
				}
				if (newValue > 1) {
					newValue = 1
				}
				this.sendCommand(`playhead`, newValue)
			},
		},
		playbackSpeed: {
			name: 'Set Cue Playback Speed',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'number',
					label: 'Speed as Percentage (1% to 1200%)',
					id: 'value',
					default: 100,
					min: 1,
					max: 1200,
					range: true,
					step: 10,
				},
			],
			callback: async (action, context) => {
				this.sendCommand(
					`${await this.conformCueID(context, action.options.cuenumber)}/playbackSpeed`,
					action.options.value,
				)
			},
		},
		toggleVideoOutputs: {
			name: 'Toggle Video Outputs',
			description: 'Requires Mitti 2.8.0',
			options: [],
			callback: () => {
				this.sendCommand('toggleVideoOutputs')
			},
		},
		videoOutputsOn: {
			name: 'Video Outputs On',
			description: 'Requires Mitti 2.8.0',
			options: [],
			callback: () => {
				this.sendCommand('videoOutputsOn')
			},
		},
		videoOutputsOff: {
			name: 'Video Outputs Off',
			description: 'Requires Mitti 2.8.0',
			options: [],
			callback: () => {
				this.sendCommand('videoOutputsOff')
			},
		},
		setInFromPlayhead: {
			name: 'Set In from Playhead',
			description: 'Requires Mitti 2.8.7',
			options: [],
			callback: async () => {
				this.sendCommand(`setInFromPlayhead`)
			},
		},
		setOutFromPlayhead: {
			name: 'Set Out from Playhead',
			description: 'Requires Mitti 2.8.7',
			options: [],
			callback: async () => {
				this.sendCommand(`setOutFromPlayhead`)
			},
		},
	}
	return actions
}
