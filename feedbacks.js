import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

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
		description: 'Change style based on play status of cue ID. Requires Mitti 2.1.0',
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
		description: 'Change style based on active status of cue ID. Requires Mitti 2.1.0',
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
		description: 'Change style based on selected status of cue ID. Requires Mitti 2.1.0',
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
		name: 'Cue ID - Audio Enabled',
		description: 'Change style if audio is enabled on a cue',
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

	feedbacks['cuePauseAtBeginningStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Pause At Beginning Enabled',
		description: 'Change style if pause at beginning is enabled on a cue',
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
			return this.cues[value]?.togglePauseAtBeginning > 0
		},
	}

	feedbacks['cuePauseAtEndStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Pause At End Enabled',
		description: 'Change style if pause at end is enabled on a cue',
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
			return this.cues[value]?.togglePauseAtEnd > 0
		},
	}

	feedbacks['cueFadeInStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Fade In Enabled',
		description: 'Change style if fade in is enabled on a cue',
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
			return this.cues[value]?.toggleFadeIn > 0
		},
	}

	feedbacks['cueFadeOutStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Fade Out Enabled',
		description: 'Change style if fade out is enabled on a cue',
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
			return this.cues[value]?.toggleFadeOut > 0
		},
	}

	feedbacks['cueLoopStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Loop Enabled',
		description: 'Change style if loop is enabled on a cue',
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
			return this.cues[value]?.toggleLoop > 0
		},
	}

	feedbacks['cueTransitionStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Transition Enabled',
		description: 'Change style if transition is enabled on a cue',
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
			return this.cues[value]?.toggleTransition > 0
		},
	}

	feedbacks['cueGotoStatus'] = {
		type: 'boolean',
		name: 'Cue ID - Goto Enabled',
		description: 'Change style if goto is enabled on a cue',
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
			return this.cues[value]?.toggleGoto > 0
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

	feedbacks['audioOutputs'] = {
		type: 'boolean',
		name: 'Audio Outputs Active',
		description: 'Change style if the audio outputs are active',
		defaultStyle: {
			bgcolor: ColorGreen,
		},
		options: [],
		callback: () => {
			return this.states.audioOutputs
		},
	}

	return feedbacks
}
