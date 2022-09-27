exports.initFeedbacks = function () {
	const feedbacks = {}

	const ColorWhite = this.rgb(255, 255, 255)
	const ColorBlack = this.rgb(0, 0, 0)
	const ColorRed = this.rgb(200, 0, 0)
	const ColorGreen = this.rgb(0, 200, 0)
	const ColorOrange = this.rgb(255, 102, 0)

	feedbacks['playStatus'] = {
		type: 'boolean',
		label: 'Change colors based on Play/Pause status',
		description: 'Change colors based on Play/Pause status',
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
			if (this.playStatus === feedback.options.playPause) {
				return true
			}
		},
	}

	this.setFeedbackDefinitions(feedbacks)

	return feedbacks
}
