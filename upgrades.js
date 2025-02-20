import { CreateConvertToBooleanFeedbackUpgradeScript } from '@companion-module/base'

export default [
	CreateConvertToBooleanFeedbackUpgradeScript({
		playStatus: true,
	}),
	function v3_2_0(context, props) {
		let changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			if (action.actionId === 'scale') {
				action.options.splitScale = false
				action.options.valueH = 100
				action.options.valueV = 100
				changes.updatedActions.push(action)
			}
		}

		return changes
	},
	function v3_8_0(context, props) {
		let changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
		if (props.config) {
			let config = props.config
			if (config.feedbackAlert === undefined || config.feedbackAlert === null) {
				config.feedbackAlert = false
				changes.updatedConfig = config
			}
		}

		return changes
	},
]
