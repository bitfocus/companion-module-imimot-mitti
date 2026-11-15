import {
	CreateConvertToBooleanFeedbackUpgradeScript,
	FixupNumericOrVariablesValueToExpressions,
	type CompanionStaticUpgradeResult,
	type CompanionStaticUpgradeScript,
} from '@companion-module/base'
import { DEFAULT_FEEDBACK_PORT, isValidPort, type MittiConfig } from './config.js'

const v3_2_0: CompanionStaticUpgradeScript<MittiConfig> = (_context, props) => {
	const changes: CompanionStaticUpgradeResult<MittiConfig, undefined> = {
		updatedConfig: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	for (const action of props.actions) {
		if (action.actionId === 'scale') {
			action.options.splitScale = { isExpression: false, value: false }
			action.options.valueH = { isExpression: false, value: 100 }
			action.options.valueV = { isExpression: false, value: 100 }
			changes.updatedActions.push(action)
		}
	}

	return changes
}

const v3_8_0: CompanionStaticUpgradeScript<MittiConfig> = (_context, props) => {
	const changes: CompanionStaticUpgradeResult<MittiConfig, undefined> = {
		updatedConfig: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}
	if (props.config) {
		const config = props.config
		if (config.feedbackAlert === undefined || config.feedbackAlert === null) {
			config.feedbackAlert = false
			changes.updatedConfig = config
		}
	}

	return changes
}

const v3_9_0: CompanionStaticUpgradeScript<MittiConfig> = (_context, props) => {
	const changes: CompanionStaticUpgradeResult<MittiConfig, undefined> = {
		updatedConfig: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	for (const action of props.actions) {
		if (action.actionId === 'play_select' || action.actionId === 'play_cue' || action.actionId === 'playCueName') {
			if (!action.options.forceCut) {
				action.options.forceCut = { isExpression: false, value: false }
				changes.updatedActions.push(action)
			}
		}
	}

	return changes
}

const v4_0_0: CompanionStaticUpgradeScript<MittiConfig> = (_context, props) => {
	const changes: CompanionStaticUpgradeResult<MittiConfig, undefined> = {
		updatedConfig: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}
	if (props.config) {
		const config = props.config
		const storedPort: unknown = config.feedbackPort
		if (typeof storedPort !== 'number') {
			const port = parseInt(String(storedPort))
			config.feedbackPort = isValidPort(port) ? port : DEFAULT_FEEDBACK_PORT
			changes.updatedConfig = config
		}
	}

	for (const action of props.actions) {
		if (action.actionId === 'playCueIndex') {
			action.options.index = FixupNumericOrVariablesValueToExpressions(action.options.index)
			changes.updatedActions.push(action)
		}
	}

	return changes
}

export const UpgradeScripts: CompanionStaticUpgradeScript<MittiConfig>[] = [
	CreateConvertToBooleanFeedbackUpgradeScript({
		playStatus: true,
	}),
	v3_2_0,
	v3_8_0,
	v3_9_0,
	v4_0_0,
]
