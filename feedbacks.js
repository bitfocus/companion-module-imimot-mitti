import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)
	const MittiBlue = combineRgb(73, 165, 231)
	const MittiGray = combineRgb(77, 77, 77)

	feedbacks['playStatus'] = {
		type: 'boolean',
		name: 'Play/Pause Status',
		description: 'Change style based on Play/Pause status',
		defaultStyle: {
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
		name: 'Cue Name - Playing',
		description: 'Change style based on play status of cue name',
		defaultStyle: {
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

	feedbacks['activeCueName'] = {
		type: 'boolean',
		name: 'Cue Name - Active',
		description: 'Change style based on active status of cue name',
		defaultStyle: {
			bgcolor: MittiBlue,
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
			return this.states.currentCueName == value
		},
	}

	feedbacks['selectedCueName'] = {
		type: 'boolean',
		name: 'Cue Name - Selected',
		description: 'Change style based on selected status of cue name',
		defaultStyle: {
			bgcolor: MittiGray,
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
			return this.states.selectedCueName == value
		},
	}

	feedbacks['playingCueID'] = {
		type: 'boolean',
		name: 'Cue ID - Playing',
		description: 'Change style based on play status of cue ID',
		defaultStyle: {
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

	feedbacks['activeCueID'] = {
		type: 'boolean',
		name: 'Cue ID - Active',
		description: 'Change style based on active status of cue ID',
		defaultStyle: {
			bgcolor: MittiBlue,
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
			return this.states.currentCueID == value
		},
	}

	feedbacks['selectedCueID'] = {
		type: 'boolean',
		name: 'Cue ID - Selected',
		description: 'Change style based on selected status of cue ID',
		defaultStyle: {
			bgcolor: MittiGray,
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

	feedbacks['cueAudioStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Audio Status',
		description: 'Change style if audio is enabled on a cue ID',
		defaultStyle: {
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
			return this.cues[value]?.toggleAudio > 0
		},
	}

	feedbacks['timeRemaining'] = {
		type: 'boolean',
		name: 'Time Remaining on Playing Cue',
		description: 'Change style if the time remaining of playing cue is less than selected amount',
		defaultStyle: {
			bgcolor: ColorOrange,
		},
		options: [
			{
				type: 'number',
				label: 'Seconds Remaining',
				id: 'time',
				default: 10,
				min: 0,
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
			bgcolor: ColorGreen,
		},
		options: [],
		callback: () => {
			return this.states.videoOutputs
		},
	}

	return feedbacks
}
