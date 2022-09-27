module.exports = {
	getActions() {
		let actions = {
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
						label: 'Cue Name',
						id: 'string',
					},
				],
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
			},
			audioOff: {
				label: 'Audio On',
				options: [
					{
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
						type: 'textwithvariables',
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
			},
		}
		return actions
	},
}
