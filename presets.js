exports.getPresets = function () {
	const ColorWhite = this.rgb(255, 255, 255)
	const ColorBlack = this.rgb(0, 0, 0)
	const ColorRed = this.rgb(200, 0, 0)
	const ColorGreen = this.rgb(0, 200, 0)
	const ColorOrange = this.rgb(255, 102, 0)

	let presets = [
		{
			category: 'Playlist',
			label: 'Play',
			bank: {
				style: 'png',
				text: '',
				png64: this.ICON_PLAY_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				png64: this.ICON_PAUSE_INACTIVE,
				pngalignment: 'center:center',
				size: '18',
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorBlack,
				bgcolor: ColorGreen,
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
				color: ColorBlack,
				bgcolor: ColorOrange,
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
				color: ColorWhite,
				bgcolor: ColorRed,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorBlack,
				bgcolor: ColorGreen,
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
				color: ColorBlack,
				bgcolor: ColorGreen,
			},
			actions: [
				{
					action: 'playCueName',
					options: {
						string: '',
					},
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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
				color: ColorWhite,
				bgcolor: ColorBlack,
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

	for (let cueID in this.cues) {
		let cue = this.cues[cueID]

		let obj = {
			category: 'Play Cue by Name',
			label: `Play Cue ${cueID}`,
			bank: {
				style: 'text',
				text: `Play\\n$(mitti:cue_${cueID}_cueName)`,
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			actions: [
				{
					action: 'play_cue',
					options: {
						cuenumber: `${cueID}`,
					},
				},
			],
		}
		presets.push(obj)
	}

	return presets
}
