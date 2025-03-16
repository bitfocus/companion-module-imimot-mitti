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
	function v3_9_0(context, props) {
		let changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			if (action.actionId === 'play_select' || action.actionId === 'play_cue' || action.actionId === 'playCueName') {
				if (!action.options.forceCut) {
					action.options.forceCut = false
					changes.updatedActions.push(action)
				}
			}
		}

		return changes
	},
]
