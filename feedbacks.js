import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	feedbacks['playStatus'] = {
		type: 'boolean',
		name: 'Change style based on Play/Pause status',
		description: 'Change style based on Play/Pause status',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
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
		callback: (feedback) => {
			if (this.states.playing === feedback.options.playPause) {
				return true
			}
		},
	}

	feedbacks['playingCueName'] = {
		type: 'boolean',
		name: 'Change style if specific cue name is playing',
		description: 'Change style based on play status of cue name',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textwithvariables',
				label: 'Cue Name',
				id: 'cueName',
				default: '',
			},
		],
		callback: (feedback) => {
			this.parseVariablesInString(feedback.options.cueName, (value) => {
				feedback.options.cueName = value
			})
			if (this.states.playing == 'Playing' && this.states.currentCueName == feedback.options.cueName) {
				return true
			}
		},
	}

	feedbacks['playingCueID'] = {
		type: 'boolean',
		name: 'Change style if specific cue ID is playing',
		description: 'Change style based on play status of cue ID',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textwithvariables',
				label: 'Cue ID',
				id: 'cueID',
				default: '',
			},
		],
		callback: (feedback) => {
			if (this.states.playing == 'Playing' && this.states.currentCueID == this.conformCueID(feedback.options.cueID)) {
				return true
			}
		},
	}

	feedbacks['selectedCueID'] = {
		type: 'boolean',
		name: 'Change style if specific cue ID is selected',
		description: 'Change style based on selected status of cue ID',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textwithvariables',
				label: 'Cue ID',
				id: 'cueID',
				default: '',
			},
		],
		callback: (feedback) => {
			if (this.states.selectedCueID == this.conformCueID(feedback.options.cueID)) {
				return true
			}
		},
	}

	feedbacks['timeRemaining'] = {
		type: 'boolean',
		name: 'Change style if time remaining is less than specified',
		description: 'Change style based on time remaining of playing cue',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorOrange,
		},
		options: [
			{
				type: 'number',
				label: 'Seconds Remaining',
				id: 'time',
				default: 10,
			},
		],
		callback: (feedback) => {
			if (this.states.timeRemaining <= feedback.options.time) {
				return true
			}
		},
	}

	return feedbacks
}
