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

// Each On / Off / Toggle set became one action with a State option, and Goto 30 / 20 / 10 became Goto End
const MergedActions: Record<string, [actionId: string, options: Record<string, string>]> = {
	toggleAudio: ['cueAudio', { state: 'toggle' }],
	audioOn: ['cueAudio', { state: 'on' }],
	audioOff: ['cueAudio', { state: 'off' }],
	toggleFadeIn: ['cueFadeIn', { state: 'toggle' }],
	fadeInOn: ['cueFadeIn', { state: 'on' }],
	fadeInOff: ['cueFadeIn', { state: 'off' }],
	toggleFadeOut: ['cueFadeOut', { state: 'toggle' }],
	fadeOutOn: ['cueFadeOut', { state: 'on' }],
	fadeOutOff: ['cueFadeOut', { state: 'off' }],
	toggleLoop: ['cueLoop', { state: 'toggle' }],
	loopOn: ['cueLoop', { state: 'on' }],
	loopOff: ['cueLoop', { state: 'off' }],
	toggleTransition: ['cueTransition', { state: 'toggle' }],
	transitionOn: ['cueTransition', { state: 'on' }],
	transitionOff: ['cueTransition', { state: 'off' }],
	toggleGoto: ['cueGoto', { state: 'toggle' }],
	gotoOn: ['cueGoto', { state: 'on' }],
	gotoOff: ['cueGoto', { state: 'off' }],
	togglePauseAtBeginning: ['cuePauseAtBeginning', { state: 'toggle' }],
	pauseAtBeginningOn: ['cuePauseAtBeginning', { state: 'on' }],
	pauseAtBeginningOff: ['cuePauseAtBeginning', { state: 'off' }],
	togglePauseAtEnd: ['cuePauseAtEnd', { state: 'toggle' }],
	pauseAtEndOn: ['cuePauseAtEnd', { state: 'on' }],
	pauseAtEndOff: ['cuePauseAtEnd', { state: 'off' }],
	toggleVideoFx: ['cueVideoFx', { state: 'toggle' }],
	videoFxOn: ['cueVideoFx', { state: 'on' }],
	videoFxOff: ['cueVideoFx', { state: 'off' }],
	plLoopToggle: ['playlistLoop', { state: 'toggle' }],
	plLoopOn: ['playlistLoop', { state: 'on' }],
	plLoopOff: ['playlistLoop', { state: 'off' }],
	plTransToggle: ['playlistTransition', { state: 'toggle' }],
	plTransOn: ['playlistTransition', { state: 'on' }],
	plTransOff: ['playlistTransition', { state: 'off' }],
	toggleVideoOutputs: ['videoOutputs', { state: 'toggle' }],
	videoOutputsOn: ['videoOutputs', { state: 'on' }],
	videoOutputsOff: ['videoOutputs', { state: 'off' }],
	toggleAudioOutputs: ['audioOutputs', { state: 'toggle' }],
	audioOutputsOn: ['audioOutputs', { state: 'on' }],
	audioOutputsOff: ['audioOutputs', { state: 'off' }],
	fullscreenToggle: ['fullscreen', { state: 'toggle' }],
	fullscreenOn: ['fullscreen', { state: 'on' }],
	fullscreenOff: ['fullscreen', { state: 'off' }],
	goto_30: ['gotoEnd', { seconds: '30' }],
	goto_20: ['gotoEnd', { seconds: '20' }],
	goto_10: ['gotoEnd', { seconds: '10' }],
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
		} else if (Object.hasOwn(MergedActions, action.actionId)) {
			const [actionId, options] = MergedActions[action.actionId]
			action.actionId = actionId
			for (const [id, value] of Object.entries(options)) action.options[id] = { isExpression: false, value }
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
