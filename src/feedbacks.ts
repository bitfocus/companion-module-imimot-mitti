import type {
	CompanionFeedbackDefinition,
	CompanionFeedbackDefinitions,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import {
	ColorGreen,
	ColorOrange,
	MittiBlue,
	MittiGray,
	conformCueID,
	nameByGroup,
	type DefinitionGroups,
} from './utils.js'
import type MittiInstance from './main.js'
import type { MittiState } from './api.js'

interface FeedbackText {
	name: string
	description: string
}

// Feedbacks that are true when a toggle is enabled on the chosen cue
const CueToggleFeedbacks = {
	cueAudioStatus: {
		name: 'Audio Enabled',
		description: 'Change style if audio is enabled on a cue',
		field: 'toggleAudio',
	},
	cuePauseAtBeginningStatus: {
		name: 'Pause at Beginning Enabled',
		description: 'Change style if pause at beginning is enabled on a cue',
		field: 'togglePauseAtBeginning',
	},
	cuePauseAtEndStatus: {
		name: 'Pause at End Enabled',
		description: 'Change style if pause at end is enabled on a cue',
		field: 'togglePauseAtEnd',
	},
	cueFadeInStatus: {
		name: 'Fade In Enabled',
		description: 'Change style if fade in is enabled on a cue',
		field: 'toggleFadeIn',
	},
	cueFadeOutStatus: {
		name: 'Fade Out Enabled',
		description: 'Change style if fade out is enabled on a cue',
		field: 'toggleFadeOut',
	},
	cueLoopStatus: {
		name: 'Loop Enabled',
		description: 'Change style if loop is enabled on a cue',
		field: 'toggleLoop',
	},
	cueTransitionStatus: {
		name: 'Transition Enabled',
		description: 'Change style if transition is enabled on a cue',
		field: 'toggleTransition',
	},
	cueGotoStatus: {
		name: 'Goto after End Enabled',
		description: 'Change style if goto after end is enabled on a cue',
		field: 'toggleGoto',
	},
} as const satisfies Record<string, FeedbackText & { field: string }>

export type CueToggleFeedbackId = keyof typeof CueToggleFeedbacks

// The feedback to recheck when a cue's toggle field changes, eg `toggleLoop` -> `cueLoopStatus`
export const CueToggleFeedbackIds = new Map<string, keyof typeof CueToggleFeedbacks>(
	Object.entries(CueToggleFeedbacks).map(([id, { field }]) => [field, id as keyof typeof CueToggleFeedbacks]),
)

// Feedbacks with no options that mirror a boolean module state
const StateFlagFeedbacks = {
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
		name: 'Set In Available',
		description: 'Change style if it is currently possible to use the "Set In from Playhead" action',
		state: 'inFromPlayheadEnabled',
	},
	outFromPlayheadEnabled: {
		name: 'Set Out Available',
		description: 'Change style if it is currently possible to use the "Set Out from Playhead" action',
		state: 'outFromPlayheadEnabled',
	},
} as const satisfies Record<string, FeedbackText & { state: keyof MittiState }>

export type StateFlagFeedbackId = keyof typeof StateFlagFeedbacks

type CueNameFeedbackId = 'playingCueName' | 'activeCueName' | 'selectedCueName'

type CueIDFeedbackId = 'playingCueID' | 'activeCueID' | 'selectedCueID'

export type FeedbacksSchema = {
	[K in keyof typeof StateFlagFeedbacks]: { type: 'boolean'; options: Record<string, never> }
} & {
	[K in CueToggleFeedbackId]: { type: 'boolean'; options: { cueID: string } }
} & {
	[K in CueNameFeedbackId]: { type: 'boolean'; options: { cueName: string } }
} & { [K in CueIDFeedbackId]: { type: 'boolean'; options: { cueID: string } } } & {
	playStatus: { type: 'boolean'; options: { playPause: string } }
	timeRemaining: { type: 'boolean'; options: { time: number } }
}

// Cues without an ID report '' (or '-' for no cue), which must not match another cue that also has none
function isEmptyCueOption(cueID: string): boolean {
	return cueID === '' || cueID === '-'
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

type FeedbackId = keyof FeedbacksSchema

const FeedbackGroups: DefinitionGroups<FeedbackId> = [
	['Transport', ['playStatus', 'timeRemaining']],
	[
		'Cue Status',
		['playingCueID', 'activeCueID', 'selectedCueID', 'playingCueName', 'activeCueName', 'selectedCueName'],
	],
	[
		'Cue Settings',
		[
			'cueAudioStatus',
			'cueFadeInStatus',
			'cueFadeOutStatus',
			'cueLoopStatus',
			'cueTransitionStatus',
			'cueGotoStatus',
			'cuePauseAtBeginningStatus',
			'cuePauseAtEndStatus',
		],
	],
	['Playhead', ['inFromPlayheadEnabled', 'outFromPlayheadEnabled']],
	['Outputs', ['videoOutputs', 'audioOutputs']],
]

export const FeedbackGroupOrder: readonly FeedbackId[] = FeedbackGroups.flatMap(([, ids]) => ids)

export function getFeedbacks(self: MittiInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	return nameByGroup<FeedbackId, CompanionFeedbackDefinitions<FeedbacksSchema>>(
		{
			...mapFeedbacks(CueToggleFeedbacks, ({ field, ...text }) => ({
				...text,
				type: 'boolean',
				defaultStyle: {
					bgcolor: ColorGreen,
				},
				options: [cueIDOption],
				callback: (feedback) => {
					const cueID = conformCueID(feedback.options.cueID)
					return Number(self.cues[cueID]?.[field]) > 0
				},
			})),
			...mapFeedbacks(StateFlagFeedbacks, ({ state, ...text }) => ({
				...text,
				type: 'boolean',
				defaultStyle: {
					bgcolor: ColorGreen,
				},
				options: [],
				callback: () => {
					return self.states[state] === true
				},
			})),
			playStatus: {
				type: 'boolean',
				name: 'Play Status',
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
				name: 'Playing (by Name)',
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
				name: 'Active (by Name)',
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
				name: 'Selected (by Name)',
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
				name: 'Playing (by ID)',
				description: 'Change style based on play status of cue ID. Requires Mitti 2.1.0',
				defaultStyle: {
					bgcolor: ColorGreen,
				},
				options: [cueIDOption],
				callback: (feedback) => {
					const value = conformCueID(feedback.options.cueID)
					return !isEmptyCueOption(value) && self.states.playing == 'Playing' && self.states.currentCueID == value
				},
			},
			activeCueID: {
				type: 'boolean',
				name: 'Active (by ID)',
				description: 'Change style based on active status of cue ID. Requires Mitti 2.1.0',
				defaultStyle: {
					bgcolor: MittiBlue,
				},
				options: [cueIDOption],
				callback: (feedback) => {
					const value = conformCueID(feedback.options.cueID)
					return !isEmptyCueOption(value) && self.states.currentCueID == value
				},
			},
			selectedCueID: {
				type: 'boolean',
				name: 'Selected (by ID)',
				description: 'Change style based on selected status of cue ID. Requires Mitti 2.1.0',
				defaultStyle: {
					bgcolor: MittiGray,
				},
				options: [cueIDOption],
				callback: (feedback) => {
					const value = conformCueID(feedback.options.cueID)
					return !isEmptyCueOption(value) && self.states.selectedCueID == value
				},
			},
			timeRemaining: {
				type: 'boolean',
				name: 'Time Remaining',
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
		},
		FeedbackGroups,
	)
}
