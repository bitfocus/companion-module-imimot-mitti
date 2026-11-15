import type {
	CompanionFeedbackDefinition,
	CompanionFeedbackDefinitions,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import { ColorGreen, ColorOrange, MittiBlue, MittiGray, conformCueID } from './utils.js'
import type MittiInstance from './main.js'
import type { MittiState } from './api.js'

interface FeedbackText {
	name: string
	description: string
}

// Feedbacks that are true when a toggle is enabled on the chosen cue
const CueToggleFeedbacks = {
	cueAudioStatus: {
		name: 'Cue ID - Audio Enabled',
		description: 'Change style if audio is enabled on a cue',
		field: 'toggleAudio',
	},
	cuePauseAtBeginningStatus: {
		name: 'Cue ID - Pause At Beginning Enabled',
		description: 'Change style if pause at beginning is enabled on a cue',
		field: 'togglePauseAtBeginning',
	},
	cuePauseAtEndStatus: {
		name: 'Cue ID - Pause At End Enabled',
		description: 'Change style if pause at end is enabled on a cue',
		field: 'togglePauseAtEnd',
	},
	cueFadeInStatus: {
		name: 'Cue ID - Fade In Enabled',
		description: 'Change style if fade in is enabled on a cue',
		field: 'toggleFadeIn',
	},
	cueFadeOutStatus: {
		name: 'Cue ID - Fade Out Enabled',
		description: 'Change style if fade out is enabled on a cue',
		field: 'toggleFadeOut',
	},
	cueLoopStatus: {
		name: 'Cue ID - Loop Enabled',
		description: 'Change style if loop is enabled on a cue',
		field: 'toggleLoop',
	},
	cueTransitionStatus: {
		name: 'Cue ID - Transition Enabled',
		description: 'Change style if transition is enabled on a cue',
		field: 'toggleTransition',
	},
	cueGotoStatus: {
		name: 'Cue ID - Goto Enabled',
		description: 'Change style if goto is enabled on a cue',
		field: 'toggleGoto',
	},
} as const satisfies Record<string, FeedbackText & { field: string }>

export type CueToggleFeedbackId = keyof typeof CueToggleFeedbacks

// The feedback to recheck when a cue's toggle field changes, eg `toggleLoop` -> `cueLoopStatus`
export const CueToggleFeedbackIds = new Map<string, keyof typeof CueToggleFeedbacks>(
	Object.entries(CueToggleFeedbacks).map(([id, { field }]) => [field, id as keyof typeof CueToggleFeedbacks]),
)

// Boolean module states: Enabled unchecked matches a known false state.
const StateFlagFeedbacks = {
	cueAudioMuted: {
		name: 'Current Cue - Audio Muted',
		description: 'Change style when the current cue is known to have muted audio',
		state: 'currentCueAudioMuted',
	},
	videoOutputs: {
		name: 'Video Outputs Active',
		description: 'Change style if the video outputs are active',
		state: 'videoOutputs',
	},
	audioOutputs: {
		name: 'Audio Outputs Active',
		description: 'Change style if the audio outputs are active',
		state: 'audioOutputs',
	},
	inFromPlayheadEnabled: {
		name: 'Set In from Playhead Available',
		description: 'Change style if it is currently possible to use the "Set In from Playhead" action',
		state: 'inFromPlayheadEnabled',
	},
	outFromPlayheadEnabled: {
		name: 'Set Out from Playhead Available',
		description: 'Change style if it is currently possible to use the "Set Out from Playhead" action',
		state: 'outFromPlayheadEnabled',
	},
} as const satisfies Record<string, FeedbackText & { state: keyof MittiState }>

export type StateFlagFeedbackId = keyof typeof StateFlagFeedbacks

export function hasEnabledFeedbackOption(feedbackId: string): boolean {
	return Object.hasOwn(CueToggleFeedbacks, feedbackId) || Object.hasOwn(StateFlagFeedbacks, feedbackId)
}

type CueNameFeedbackId = 'playingCueName' | 'activeCueName' | 'selectedCueName'

type CueIDFeedbackId = 'playingCueID' | 'activeCueID' | 'selectedCueID'

export type FeedbacksSchema = {
	[K in keyof typeof StateFlagFeedbacks]: { type: 'boolean'; options: { enabled?: boolean } }
} & {
	[K in CueToggleFeedbackId]: { type: 'boolean'; options: { cueID: string; enabled?: boolean } }
} & {
	[K in CueNameFeedbackId]: { type: 'boolean'; options: { cueName: string } }
} & { [K in CueIDFeedbackId]: { type: 'boolean'; options: { cueID: string } } } & {
	playStatus: { type: 'boolean'; options: { playPause: string } }
	selectedCuePlaying: { type: 'boolean'; options: Record<string, never> }
	timeRemaining: { type: 'boolean'; options: { time: number } }
}

const cueIDOption: CompanionInputFieldTextInput<'cueID'> = {
	type: 'textinput',
	useVariables: true,
	label: 'Cue ID',
	id: 'cueID',
	default: '',
}

const cueNameOption: CompanionInputFieldTextInput<'cueName'> = {
	type: 'textinput',
	useVariables: true,
	label: 'Cue Name',
	id: 'cueName',
	default: '',
}

function mapFeedbacks<
	TTable extends Record<string, FeedbackText>,
	TSchema extends FeedbacksSchema[keyof TTable & keyof FeedbacksSchema],
>(
	table: TTable,
	build: (entry: TTable[keyof TTable]) => CompanionFeedbackDefinition<TSchema>,
): Record<keyof TTable, CompanionFeedbackDefinition<TSchema>> {
	return Object.fromEntries(
		Object.entries(table).map(([id, entry]) => [id, build(entry as TTable[keyof TTable])]),
	) as Record<keyof TTable, CompanionFeedbackDefinition<TSchema>>
}

export function getFeedbacks(self: MittiInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	return {
		selectedCuePlaying: {
			type: 'boolean',
			name: 'Selected Cue - Playing',
			description: 'Change style when the selected cue is currently playing',
			defaultStyle: { bgcolor: ColorGreen },
			options: [],
			callback: () => {
				const selected = self.states.selectedCueID
				return (
					self.states.playing === 'Playing' &&
					selected !== undefined &&
					selected !== '' &&
					selected !== '-' &&
					self.states.currentCueID == selected
				)
			},
		},
		...mapFeedbacks(CueToggleFeedbacks, ({ field, ...text }) => ({
			...text,
			type: 'boolean',
			defaultStyle: {
				bgcolor: ColorGreen,
			},
			options: [cueIDOption, { type: 'checkbox', id: 'enabled', label: 'Enabled', default: true }],
			callback: (feedback) => {
				const cueID = conformCueID(feedback.options.cueID)
				const value = self.cues[cueID]?.[field]
				return (
					value !== undefined &&
					Number.isFinite(Number(value)) &&
					Number(value) > 0 === (feedback.options.enabled ?? true)
				)
			},
		})),
		...mapFeedbacks(StateFlagFeedbacks, ({ state, ...text }) => ({
			...text,
			type: 'boolean',
			defaultStyle: {
				bgcolor: ColorGreen,
			},
			options: [{ type: 'checkbox', id: 'enabled', label: 'Enabled', default: true }],
			callback: (feedback) => {
				return self.states[state] !== undefined && self.states[state] === (feedback.options.enabled ?? true)
			},
		})),
		playStatus: {
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
				return self.states.playing === feedback.options.playPause
			},
		},
		playingCueName: {
			type: 'boolean',
			name: 'Cue Name - Playing',
			description: 'Change style based on play status of cue name',
			defaultStyle: {
				bgcolor: ColorGreen,
			},
			options: [cueNameOption],
			callback: (feedback) => {
				const value = feedback.options.cueName
				return self.states.playing == 'Playing' && self.states.currentCueName == value
			},
		},
		activeCueName: {
			type: 'boolean',
			name: 'Cue Name - Active',
			description: 'Change style based on active status of cue name',
			defaultStyle: {
				bgcolor: MittiBlue,
			},
			options: [cueNameOption],
			callback: (feedback) => {
				const value = feedback.options.cueName
				return self.states.currentCueName == value
			},
		},
		selectedCueName: {
			type: 'boolean',
			name: 'Cue Name - Selected',
			description: 'Change style based on selected status of cue name',
			defaultStyle: {
				bgcolor: MittiGray,
			},
			options: [cueNameOption],
			callback: (feedback) => {
				const value = feedback.options.cueName
				return self.states.selectedCueName == value
			},
		},
		playingCueID: {
			type: 'boolean',
			name: 'Cue ID - Playing',
			description: 'Change style based on play status of cue ID. Requires Mitti 2.1.0',
			defaultStyle: {
				bgcolor: ColorGreen,
			},
			options: [cueIDOption],
			callback: (feedback) => {
				const value = conformCueID(feedback.options.cueID)
				return self.states.playing == 'Playing' && self.states.currentCueID == value
			},
		},
		activeCueID: {
			type: 'boolean',
			name: 'Cue ID - Active',
			description: 'Change style based on active status of cue ID. Requires Mitti 2.1.0',
			defaultStyle: {
				bgcolor: MittiBlue,
			},
			options: [cueIDOption],
			callback: (feedback) => {
				const value = conformCueID(feedback.options.cueID)
				return self.states.currentCueID == value
			},
		},
		selectedCueID: {
			type: 'boolean',
			name: 'Cue ID - Selected',
			description: 'Change style based on selected status of cue ID. Requires Mitti 2.1.0',
			defaultStyle: {
				bgcolor: MittiGray,
			},
			options: [cueIDOption],
			callback: (feedback) => {
				const value = conformCueID(feedback.options.cueID)
				return self.states.selectedCueID == value
			},
		},
		timeRemaining: {
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
					max: 359999,
				},
			],
			callback: (feedback) => {
				return self.states.timeRemaining !== undefined && self.states.timeRemaining <= feedback.options.time
			},
		},
	}
}
