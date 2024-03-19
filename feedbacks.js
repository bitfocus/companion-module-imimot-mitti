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
		name: 'Play/Pause status',
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
			return this.states.playing === feedback.options.playPause
		},
	}

	feedbacks['playingCueName'] = {
		type: 'boolean',
		name: 'Cue name is playing',
		description: 'Change style based on play status of cue name',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textinput',
				useVariables: true,
				label: 'Cue Name',
				id: 'cueName',
				default: '',
			},
		],
		callback: async (feedback, context) => {
			const value = await context.parseVariablesInString(feedback.options.cueName)
			return this.states.playing == 'Playing' && this.states.currentCueName == value
		},
	}

	feedbacks['playingCueID'] = {
		type: 'boolean',
		name: 'Cue ID is playing',
		description: 'Change style based on play status of cue ID',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textinput',
				useVariables: true,
				label: 'Cue ID',
				id: 'cueID',
				default: '',
			},
		],
		callback: async (feedback, context) => {
			const value = await this.conformCueID(context, feedback.options.cueID)
			return this.states.playing == 'Playing' && this.states.currentCueID == value
		},
	}

	feedbacks['selectedCueID'] = {
		type: 'boolean',
		name: 'Cue ID is selected',
		description: 'Change style based on selected status of cue ID',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'textinput',
				useVariables: true,
				label: 'Cue ID',
				id: 'cueID',
				default: '',
			},
		],
		callback: async (feedback, context) => {
			const value = await this.conformCueID(context, feedback.options.cueID)
			return this.states.selectedCueID == value
		},
	}

	feedbacks['timeRemaining'] = {
		type: 'boolean',
		name: 'Time remaining on playing cue',
		description: 'Change style if the time remaining of playing cue is less than selected amount',
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
			return this.states.timeRemaining <= feedback.options.time
		},
	}

	feedbacks['videoOutputs'] = {
		type: 'boolean',
		name: 'Video Outputs Active',
		description: 'Change style if the video outputs are active',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [],
		callback: () => {
			return this.states.videoOutputs
		},
	}

	return feedbacks
}
