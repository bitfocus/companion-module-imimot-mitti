module.exports = {
	getActions() {
		let actions = {
			play: {
				label: 'Play',
				callback: () => {
					this.sendCommand('play')
				},
			},
			toggle_play: {
				label: 'Pause / Resume',
				callback: () => {
					this.sendCommand('togglePlay')
				},
			},
			stop: {
				label: 'Pause',
				callback: () => {
					this.sendCommand('stop')
				},
			},
			panic: {
				label: 'Panic',
				callback: () => {
					this.sendCommand('panic')
				},
			},
			rewind: {
				label: 'Rewind',
				callback: () => {
					this.sendCommand('rewind')
				},
			},
			jump_prev: {
				label: 'Jump to previous cue',
				callback: () => {
					this.sendCommand('jumpToPrevCue')
				},
			},
			jump_next: {
				label: 'Jump to next cue',
				callback: () => {
					this.sendCommand('jumpToNextCue')
				},
			},
			jump_selected: {
				label: 'Jump to selected cue',
				callback: () => {
					this.sendCommand('jumpToSelectedCue')
				},
			},
			select_prev: {
				label: 'Select previous cue',
				callback: () => {
					this.sendCommand('selectPrevCue')
				},
			},
			select_next: {
				label: 'Select next cue',
				callback: () => {
					this.sendCommand('selectNextCue')
				},
			},
			goto_30: {
				label: 'Goto 30',
				callback: () => {
					this.sendCommand('goto30')
				},
			},
			goto_20: {
				label: 'Goto 20',
				callback: () => {
					this.sendCommand('goto20')
				},
			},
			goto_10: {
				label: 'Goto 10',
				callback: () => {
					this.sendCommand('goto10')
				},
			},
			play_select: {
				label: 'Play Selected Cue',
				callback: () => {
					this.sendCommand('playSelectedCue')
				},
			},
			fullscreenToggle: {
				label: 'Toggle Fullscreen',
				callback: () => {
					this.sendCommand('toggleFullscreen')
				},
			},
			fullscreenOn: {
				label: 'Fullscreen On',
				callback: () => {
					this.sendCommand('fullscreenOn')
				},
			},
			fullscreenOff: {
				label: 'Fullscreen Off',
				callback: () => {
					this.sendCommand('fullscreenOff')
				},
			},
			plLoopToggle: {
				label: 'Toggle Playlist Loop',
				callback: () => {
					this.sendCommand('toggleLoop')
				},
			},
			plLoopOn: {
				label: 'Playlist Loop On',
				callback: () => {
					this.sendCommand('loopOn')
				},
			},
			plLoopOff: {
				label: 'Playlist Loop Off',
				callback: () => {
					this.sendCommand('loopOff')
				},
			},
			plTransToggle: {
				label: 'Toggle Playlist Transition on Play',
				callback: () => {
					this.sendCommand('toggleTransitionOnPlay')
				},
			},
			plTransOff: {
				label: 'Transition on Play Off',
				callback: () => {
					this.sendCommand('transitionOnPlayOff')
				},
			},
			plTransOn: {
				label: 'Transition on Play On',
				callback: () => {
					this.sendCommand('transitionOnPlayOn')
				},
			},
			resendOSCFeedback: {
				label: 'Resend OSC feedback',
				callback: () => {
					this.sendCommand('resendOSCFeedback')
				},
			},
			jump_cue: {
				label: 'Jump to specific cue',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand((`${this.conformCueID(action.options.cuenumber)}/jump`))
				},
			},
			jumpCueName: {
				label: 'Jump to cue with name',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue Name',
						id: 'string',
					},
				],
				callback: (action) => {
					this.parseVariables(action.options.string, (value) => {
						action.options.string = value
					})
					this.sendCommand('jumpToCueWithName', action.options.string)
				},
			},
			select_cue: {
				label: 'Select Cue',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/select`)
				},
			},
			play_cue: {
				label: 'Play cue with number / ID',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/play`)
				},
			},
			playCueName: {
				label: 'Play cue with name',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue Name',
						id: 'string',
					},
				],
				callback: (action) => {
					this.parseVariables(action.options.string, (value) => {
						action.options.string = value
					})
					this.sendCommand('playCueWithName', action.options.string)
				},
			},
			audioOn: {
				label: 'Audio On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/audioOn`)
				},
			},
			audioOff: {
				label: 'Audio Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/audioOff`)
				},
			},
			toggleAudio: {
				label: 'Toggle Audio',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleAudio`)
				},
			},
			toggleFadeIn: {
				label: 'Toggle Fade In',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleFadeIn`)
				},
			},
			fadeInOn: {
				label: 'Fade In On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/fadeInOn`)
				},
			},
			fadeInOff: {
				label: 'Fade In Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/fadeInOff`)
				},
			},
			toggleFadeOut: {
				label: 'Toggle Fade Out',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleFadeOut`)
				},
			},
			fadeOutOn: {
				label: 'Fade Out On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/fadeOutOn`)
				},
			},
			fadeOutOff: {
				label: 'Fade Out Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/fadeOutOff`)
				},
			},
			toggleLoop: {
				label: 'Toggle Loop',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleLoop`)
				},
			},
			loopOn: {
				label: 'Loop On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/loopOn`)
				},
			},
			loopOff: {
				label: 'Loop Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/loopOff`)
				},
			},
			togglePauseAtBeginning: {
				label: 'Toggle Pause At Beginning',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/togglePauseAtBeginning`)
				},
			},
			pauseAtBeginningOn: {
				label: 'Pause At Beginning On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/pauseAtBeginningOn`)
				},
			},
			pauseAtBeginningOff: {
				label: 'Pause At Beginning Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/pauseAtBeginningOff`)
				},
			},
			togglePauseAtEnd: {
				label: 'Toggle Pause At End',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/togglePauseAtEnd`)
				},
			},
			pauseAtEndOn: {
				label: 'Pause At End On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/pauseAtEndOn`)
				},
			},
			pauseAtEndOff: {
				label: 'Pause At End Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/pauseAtEndOff`)
				},
			},
			toggleTransition: {
				label: 'Toggle Transition',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleTransition`)
				},
			},
			transitionOn: {
				label: 'Transition On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/transitionOn`)
				},
			},
			transitionOff: {
				label: 'Transition Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/transitionOff`)
				},
			},
			toggleVideoFx: {
				label: 'Toggle VideoFx',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/toggleVideoFx`)
				},
			},
			videoFxOn: {
				label: 'VideoFx On',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/videoFxOn`)
				},
			},
			videoFxOff: {
				label: 'VideoFx Off',
				options: [
					{
						type: 'textwithvariables',
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: 'current',
					},
				],
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/videoFxOff`)
				},
			},
			scale: {
				label: 'Cue Scale',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/scaleAsPercent`, action.options.value)
				},
			},
			position: {
				label: 'Cue Position',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					if (action.options.valueX) {
						this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/posXAsPixels`, action.options.valueX)
					}
					if (action.options.valueY) {
						this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/posYAsPixels`, action.options.valueY)
					}
				},
			},
			crop: {
				label: 'Cue Crop',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					if (action.options.valueLeft) {
						this.sendCommand(
							`${this.conformCueID(action.options.cuenumber)}/cropLeftAsPixels`,
							action.options.valueLeft
						)
					}
					if (action.options.valueRight) {
						this.sendCommand(
							`${this.conformCueID(action.options.cuenumber)}/cropRightAsPixels`,
							action.options.valueRight
						)
					}
					if (action.options.valueTop) {
						this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/cropTopAsPixels`, action.options.valueTop)
					}
					if (action.options.valueBottom) {
						this.sendCommand(
							`${this.conformCueID(action.options.cuenumber)}/cropBottomAsPixels`,
							action.options.valueBottom
						)
					}
				},
			},
			rotation: {
				label: 'Cue Rotation',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/rotateAsDegrees`, action.options.value)
				},
			},
			hue: {
				label: 'Cue Hue',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/hueAsDegrees`, action.options.value)
				},
			},
			saturation: {
				label: 'Cue Saturation',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/saturationAsPercent`, action.options.value)
				},
			},
			vibrance: {
				label: 'Cue Vibrance',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/vibranceAsPercent`, action.options.value)
				},
			},
			brightness: {
				label: 'Cue Brightness',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/brightnessAsPercent`, action.options.value)
				},
			},
			contrast: {
				label: 'Cue Contrast',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/contrastAsPercent`, action.options.value)
				},
			},
			opacity: {
				label: 'Cue Opacity',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(`${this.conformCueID(action.options.cuenumber)}/opacityAsPercent`, action.options.value)
				},
			},
			volume: {
				label: 'Cue Volume',
				options: [
					{
						type: 'textwithvariables',
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
				callback: (action) => {
					this.sendCommand(
						`${this.conformCueID(action.options.cuenumber)}/volumeAsDecibels`,
						parseFloat(action.options.value)
					)
				},
			},
			mainFader: {
				label: 'Master Fader',
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
						isVisible: (action) => action.options.mode === 'custom',
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
	},
}
