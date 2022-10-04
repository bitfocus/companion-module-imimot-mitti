exports.initFeedbacks = function () {
	const feedbacks = {}

	const ColorWhite = this.rgb(255, 255, 255)
	const ColorBlack = this.rgb(0, 0, 0)
	const ColorRed = this.rgb(200, 0, 0)
	const ColorGreen = this.rgb(0, 200, 0)
	const ColorOrange = this.rgb(255, 102, 0)

	feedbacks['playStatus'] = {
		type: 'boolean',
		label: 'Change style based on Play/Pause status',
		description: 'Change style based on Play/Pause status',
		style: {
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
		label: 'Change style if specific cue name is playing',
		description: 'Change style based on play status of cue name',
		style: {
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
			this.parseVariables(feedback.options.cueName, (value) => {
				feedback.options.cueName = value
			})
			if (this.states.playing == 'Playing' && this.states.currentCueName == feedback.options.cueName) {
				return true
			}
		},
	}

	feedbacks['playingCueID'] = {
		type: 'boolean',
		label: 'Change style if specific cue ID is playing',
		description: 'Change style based on play status of cue ID',
		style: {
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
		label: 'Change style if specific cue ID is selected',
		description: 'Change style based on selected status of cue ID',
		style: {
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
		label: 'Change style if time remaining is less than specified',
		description: 'Change style based on time remaining of playing cue',
		style: {
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

	this.setFeedbackDefinitions(feedbacks)

	return feedbacks
}
