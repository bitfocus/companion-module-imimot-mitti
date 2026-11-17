import type {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import type MittiInstance from './main.js'
import { conformCueID, nameByGroup, type DefinitionGroups } from './utils.js'

type NoOptions = Record<string, never>
type CueOptions = { cuenumber: string }
type ForceCutOptions = { forceCut: boolean }
type StateOptions = { state: string }

interface CommandAction {
	name: string
	description?: string
	command: string
}

// Actions with no options that send a single command
const SimpleActions = {
	play: { name: 'Play', command: 'play' },
	toggle_play: { name: 'Pause / Resume', command: 'togglePlay' },
	stop: { name: 'Pause', command: 'stop' },
	panic: { name: 'Panic', command: 'panic' },
	rewind: { name: 'Rewind', command: 'rewind' },
	jump_prev: { name: 'Jump to Previous Cue', command: 'jumpToPrevCue' },
	jump_next: { name: 'Jump to Next Cue', command: 'jumpToNextCue' },
	jump_selected: { name: 'Jump to Selected Cue', command: 'jumpToSelectedCue' },
	select_prev: { name: 'Select Previous Cue', command: 'selectPrevCue' },
	select_next: { name: 'Select Next Cue', command: 'selectNextCue' },
	resendOSCFeedback: { name: 'Resend OSC Feedback', command: 'resendOSCFeedback' },
	setInFromPlayhead: {
		name: 'Set In from Playhead',
		description: 'Requires Mitti 2.8.7',
		command: 'setInFromPlayhead',
	},
	setOutFromPlayhead: {
		name: 'Set Out from Playhead',
		description: 'Requires Mitti 2.8.7',
		command: 'setOutFromPlayhead',
	},
} as const satisfies Record<string, CommandAction>

// Actions that send `<cue>/<command>` for the chosen cue
const CueActions = {
	jump_cue: { name: 'Jump to Cue', command: 'jump' },
	select_cue: { name: 'Select Cue', command: 'select' },
} as const satisfies Record<string, CommandAction>

interface StateAction {
	name: string
	description?: string
	commands: Record<'toggle' | 'on' | 'off', string>
	// Labels for the On / Off choices, where Mitti's own wording differs
	labels?: { on: string; off: string }
}

const Mute = { on: 'Unmute', off: 'Mute' }

// Settings that Mitti can toggle or set on / off for the chosen cue, sent as `<cue>/<command>`
const CueStateActions = {
	cueAudio: { name: 'Audio', commands: { toggle: 'toggleAudio', on: 'audioOn', off: 'audioOff' }, labels: Mute },
	cueFadeIn: { name: 'Fade In', commands: { toggle: 'toggleFadeIn', on: 'fadeInOn', off: 'fadeInOff' } },
	cueFadeOut: { name: 'Fade Out', commands: { toggle: 'toggleFadeOut', on: 'fadeOutOn', off: 'fadeOutOff' } },
	cueLoop: { name: 'Loop', commands: { toggle: 'toggleLoop', on: 'loopOn', off: 'loopOff' } },
	cueTransition: {
		name: 'Transition',
		commands: { toggle: 'toggleTransition', on: 'transitionOn', off: 'transitionOff' },
	},
	cueGoto: { name: 'Goto after End', commands: { toggle: 'toggleGoto', on: 'gotoOn', off: 'gotoOff' } },
	cuePauseAtBeginning: {
		name: 'Pause at Beginning',
		commands: { toggle: 'togglePauseAtBeginning', on: 'pauseAtBeginningOn', off: 'pauseAtBeginningOff' },
	},
	cuePauseAtEnd: {
		name: 'Pause at End',
		commands: { toggle: 'togglePauseAtEnd', on: 'pauseAtEndOn', off: 'pauseAtEndOff' },
	},
	cueVideoFx: { name: 'Video FX', commands: { toggle: 'toggleVideoFx', on: 'videoFxOn', off: 'videoFxOff' } },
} as const satisfies Record<string, StateAction>

// Playlist and output settings that Mitti can toggle or set on / off
const StateActions = {
	playlistLoop: { name: 'Loop', commands: { toggle: 'toggleLoop', on: 'loopOn', off: 'loopOff' } },
	playlistTransition: {
		name: 'Transition on Play',
		commands: { toggle: 'toggleTransitionOnPlay', on: 'transitionOnPlayOn', off: 'transitionOnPlayOff' },
	},
	videoOutputs: {
		name: 'Video Outputs',
		description: 'Requires Mitti 2.8.0',
		commands: { toggle: 'toggleVideoOutputs', on: 'videoOutputsOn', off: 'videoOutputsOff' },
	},
	audioOutputs: {
		name: 'Audio Outputs',
		description: 'Requires Mitti 2.8.9',
		commands: { toggle: 'toggleAudio', on: 'unmuteAudio', off: 'muteAudio' },
		labels: Mute,
	},
	fullscreen: {
		name: 'Fullscreen',
		commands: { toggle: 'toggleFullscreen', on: 'fullscreenOn', off: 'fullscreenOff' },
	},
} as const satisfies Record<string, StateAction>

export type StateActionId = keyof typeof CueStateActions | keyof typeof StateActions

// Actions that send `<cue>/<command>` with a numeric value
const CueValueActions = {
	rotation: {
		name: 'Rotation',
		command: 'rotateAsDegrees',
		value: { label: 'Degrees (°)', default: 0, min: -180, max: 180 },
	},
	hue: { name: 'Hue', command: 'hueAsDegrees', value: { label: 'Degrees (°)', default: 0, min: -180, max: 180 } },
	saturation: {
		name: 'Saturation',
		command: 'saturationAsPercent',
		value: { label: 'Saturation (%)', default: 0, min: -100, max: 100 },
	},
	vibrance: {
		name: 'Vibrance',
		command: 'vibranceAsPercent',
		value: { label: 'Vibrance (%)', default: 0, min: -100, max: 100 },
	},
	brightness: {
		name: 'Brightness',
		command: 'brightnessAsPercent',
		value: { label: 'Brightness (%)', default: 0, min: -100, max: 100 },
	},
	contrast: {
		name: 'Contrast',
		command: 'contrastAsPercent',
		value: { label: 'Contrast (%)', default: 0, min: -100, max: 100 },
	},
	opacity: {
		name: 'Opacity',
		command: 'opacityAsPercent',
		value: { label: 'Opacity (%)', default: 100, min: 0, max: 100 },
	},
	volume: {
		name: 'Set Volume',
		command: 'volumeAsDecibels',
		value: { label: 'Volume (db, -60 to 12)', default: 0, min: -60, max: 12 },
	},
	playbackSpeed: {
		name: 'Set Playback Speed',
		command: 'playbackSpeed',
		value: { label: 'Speed (1% to 1200%)', default: 100, min: 1, max: 1200, range: true, step: 10 },
	},
} as const satisfies Record<string, CommandAction & { value: Omit<CompanionInputFieldNumber<'value'>, 'id' | 'type'> }>

const GotoEndSeconds = ['30', '20', '10'] as const

export type ActionsSchema = { [K in keyof typeof SimpleActions]: { options: NoOptions } } & {
	[K in keyof typeof CueActions]: { options: CueOptions }
} & { [K in keyof typeof CueStateActions]: { options: CueOptions & StateOptions } } & {
	[K in keyof typeof StateActions]: { options: StateOptions }
} & { [K in keyof typeof CueValueActions]: { options: CueOptions & { value: number } } } & {
	play_select: { options: ForceCutOptions }
	jumpCueName: { options: { string: string } }
	play_cue: { options: CueOptions & ForceCutOptions }
	playCueIndex: { options: { index: number } & ForceCutOptions }
	playCueName: { options: { string: string } & ForceCutOptions }
	setGotoToCueID: { options: CueOptions & { gotoCue: string } }
	scale: { options: CueOptions & { value: number; splitScale: boolean; valueH: number; valueV: number } }
	position: { options: CueOptions & { valueX: string; valueY: string } }
	crop: { options: CueOptions & { valueLeft: string; valueRight: string; valueTop: string; valueBottom: string } }
	adjustVolume: { options: { value: number } }
	mainFader: { options: { mode: string; value: number } }
	gotoEnd: { options: { seconds: string } }
	playhead: { options: { value: number } }
	scrubPlayhead: { options: { value: string } }
	locatePlayhead: { options: { value: string } }
	adjustPlaybackSpeed: { options: { value: number } }
}

type ActionId = keyof ActionsSchema

const ActionGroups: DefinitionGroups<ActionId> = [
	[
		'Transport',
		['play', 'toggle_play', 'stop', 'rewind', 'panic', 'play_select', 'play_cue', 'playCueIndex', 'playCueName'],
	],
	[
		'Navigate',
		['jump_cue', 'jump_next', 'jump_prev', 'jump_selected', 'jumpCueName', 'select_cue', 'select_next', 'select_prev'],
	],
	['Playhead', ['gotoEnd', 'playhead', 'scrubPlayhead', 'locatePlayhead', 'setInFromPlayhead', 'setOutFromPlayhead']],
	[
		'Cue Settings',
		[
			'cueAudio',
			'cueFadeIn',
			'cueFadeOut',
			'cueLoop',
			'cueTransition',
			'cueGoto',
			'setGotoToCueID',
			'cuePauseAtBeginning',
			'cuePauseAtEnd',
			'cueVideoFx',
		],
	],
	['Cue Volume & Speed', ['volume', 'adjustVolume', 'playbackSpeed', 'adjustPlaybackSpeed']],
	[
		'Cue Image',
		['opacity', 'brightness', 'contrast', 'saturation', 'vibrance', 'hue', 'rotation', 'scale', 'position', 'crop'],
	],
	['Playlist', ['playlistLoop', 'playlistTransition']],
	['Outputs', ['videoOutputs', 'audioOutputs', 'fullscreen', 'mainFader']],
	['Utility', ['resendOSCFeedback']],
]

export const ActionGroupOrder: readonly ActionId[] = ActionGroups.flatMap(([, ids]) => ids)

function stateOption(labels: { on: string; off: string } | undefined): CompanionInputFieldDropdown<'state'> {
	return {
		type: 'dropdown',
		label: 'State',
		id: 'state',
		default: 'toggle',
		choices: [
			{ id: 'toggle', label: 'Toggle' },
			{ id: 'on', label: labels?.on ?? 'On' },
			{ id: 'off', label: labels?.off ?? 'Off' },
		],
	}
}

function stateCommand(commands: StateAction['commands'], state: string): string | undefined {
	return Object.hasOwn(commands, state) ? commands[state as keyof StateAction['commands']] : undefined
}

const cueOption: CompanionInputFieldTextInput<'cuenumber'> = {
	type: 'textinput',
	tooltip: 'You can also use "current", "selected", "previous", "next" or "all"',
	useVariables: true,
	label: 'Cue number or ID',
	id: 'cuenumber',
	default: 'current',
}

const PositionCommands = { valueX: 'posXAsPixels', valueY: 'posYAsPixels' } as const
const CropCommands = {
	valueLeft: 'cropLeftAsPixels',
	valueRight: 'cropRightAsPixels',
	valueTop: 'cropTopAsPixels',
	valueBottom: 'cropBottomAsPixels',
} as const

// Each field is optional: only the ones with a value are sent
function sendCueValues<TField extends string>(
	self: MittiInstance,
	options: CueOptions & Record<TField, string>,
	commands: Record<TField, string>,
): void {
	const cue = conformCueID(options.cuenumber)
	if (!cue) return
	for (const [field, command] of Object.entries(commands) as [TField, string][]) {
		const value = options[field]
		if (value) self.api.sendValue(`${cue}/${command}`, value, 's')
	}
}

function mapActions<
	TTable extends Record<string, { name: string; description?: string }>,
	TSchema extends ActionsSchema[keyof TTable & keyof ActionsSchema],
>(
	table: TTable,
	build: (entry: TTable[keyof TTable]) => CompanionActionDefinition<TSchema>,
): Record<keyof TTable, CompanionActionDefinition<TSchema>> {
	return Object.fromEntries(
		Object.entries(table).map(([id, entry]) => [id, build(entry as TTable[keyof TTable])]),
	) as Record<keyof TTable, CompanionActionDefinition<TSchema>>
}

export function getActions(self: MittiInstance): CompanionActionDefinitions<ActionsSchema> {
	return nameByGroup<ActionId, CompanionActionDefinitions<ActionsSchema>>(
		{
			...mapActions(SimpleActions, ({ command, ...definition }) => ({
				...definition,
				options: [],
				callback: () => {
					self.api.sendCommand(command)
				},
			})),
			...mapActions(CueActions, ({ command, ...definition }) => ({
				...definition,
				options: [cueOption],
				callback: (action) => {
					const cueID = conformCueID(action.options.cuenumber)
					if (!cueID) return
					self.api.sendCommand(`${cueID}/${command}`)
				},
			})),
			...mapActions(CueStateActions, ({ commands, labels, ...definition }: StateAction) => ({
				...definition,
				options: [cueOption, stateOption(labels)],
				callback: (action) => {
					const cueID = conformCueID(action.options.cuenumber)
					const command = stateCommand(commands, action.options.state)
					if (!cueID || !command) return
					self.api.sendCommand(`${cueID}/${command}`)
					self.api.requestStateRefresh()
				},
			})),
			...mapActions(StateActions, ({ commands, labels, ...definition }: StateAction) => ({
				...definition,
				options: [stateOption(labels)],
				callback: (action) => {
					const command = stateCommand(commands, action.options.state)
					if (command) self.api.sendCommand(command)
				},
			})),
			...mapActions(CueValueActions, ({ command, value, ...definition }) => ({
				...definition,
				options: [cueOption, { ...value, type: 'number', id: 'value' as const }],
				callback: (action) => {
					const cue = conformCueID(action.options.cuenumber)
					if (!cue) return
					self.api.sendValue(`${cue}/${command}`, action.options.value, 's')
					self.api.requestStateRefresh()
				},
			})),
			play_select: {
				name: 'Play Selected Cue',
				options: [
					{
						type: 'checkbox',
						label: 'Force Cut',
						tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
						id: 'forceCut',
						default: false,
					},
				],
				callback: (action) => {
					if (action.options.forceCut) {
						self.api.sendCommand('playSelectedCueForceCut')
					} else {
						self.api.sendCommand('playSelectedCue')
					}
				},
			},
			jumpCueName: {
				name: 'Jump to Cue by Name',
				options: [
					{
						type: 'textinput',
						useVariables: true,
						label: 'Cue Name',
						id: 'string',
					},
				],
				callback: (action) => {
					const value = action.options.string
					if (!value?.trim()) return
					self.api.sendValue('jumpToCueWithName', value, 's')
				},
			},
			play_cue: {
				name: 'Play Cue by Number / ID',
				options: [
					{
						type: 'textinput',
						useVariables: true,
						label: 'Cue number or ID',
						id: 'cuenumber',
						default: '1',
					},
					{
						type: 'checkbox',
						label: 'Force Cut',
						tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
						id: 'forceCut',
						default: false,
					},
				],
				callback: (action) => {
					const cueID = conformCueID(action.options.cuenumber)
					if (!cueID) return
					if (action.options.forceCut) {
						self.api.sendValue(`playCueWithCueIDForceCut`, cueID, 's')
					} else {
						self.api.sendValue(`playCueWithCueID`, cueID, 's')
					}
				},
			},
			playCueIndex: {
				name: 'Play Cue at Index',
				options: [
					{
						type: 'number',
						label: 'Cue index',
						id: 'index',
						default: 1,
						min: 1,
						max: 999,
						asInteger: true,
					},
					{
						type: 'checkbox',
						label: 'Force Cut',
						tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
						id: 'forceCut',
						default: false,
					},
				],
				callback: (action) => {
					const index = action.options.index
					if (!Number.isInteger(index) || index < 1 || index > 999) {
						self.log('warn', 'Index must be a number between 1 and 999')
					} else {
						if (action.options.forceCut) {
							self.api.sendValue(`playCueAtIndexForceCut`, index, 'i')
						} else {
							self.api.sendValue(`playCueAtIndex`, index, 'i')
						}
					}
				},
			},
			playCueName: {
				name: 'Play Cue by Name',
				options: [
					{
						type: 'textinput',
						useVariables: true,
						label: 'Cue Name',
						id: 'string',
					},
					{
						type: 'checkbox',
						label: 'Force Cut',
						tooltip: 'Plays cue with an instant cut, regardless of whether a transition is enabled',
						id: 'forceCut',
						default: false,
					},
				],
				callback: (action) => {
					const value = action.options.string
					if (!value?.trim()) return
					if (action.options.forceCut) {
						self.api.sendValue('playCueWithNameForceCut', value, 's')
					} else {
						self.api.sendValue('playCueWithName', value, 's')
					}
				},
			},
			setGotoToCueID: {
				name: 'Set Goto Target',
				description: 'Requires Mitti 2.2.8',
				options: [
					cueOption,
					{
						type: 'textinput',
						useVariables: true,
						label: 'Goto Cue number or ID',
						id: 'gotoCue',
						default: '2',
					},
				],
				callback: (action) => {
					const cue = conformCueID(action.options.cuenumber)
					const gotoCue = conformCueID(action.options.gotoCue)
					if (!cue || !gotoCue) return
					self.api.sendValue(`${cue}/setGotoToCueID`, gotoCue, 's')
				},
			},
			scale: {
				name: 'Scale',
				options: [
					cueOption,
					{
						type: 'number',
						label: 'Scale (%)',
						id: 'value',
						default: 100,
						min: 0,
						max: 200,
						isVisibleExpression: `!$(options:splitScale)`,
					},
					{
						type: 'checkbox',
						label: 'Scale H/V Separately',
						id: 'splitScale',
						default: false,
						disableAutoExpression: true,
					},
					{
						type: 'number',
						label: 'Scale H (%)',
						id: 'valueH',
						default: 100,
						min: 0,
						max: 200,
						isVisibleExpression: `$(options:splitScale)`,
					},
					{
						type: 'number',
						label: 'Scale V (%)',
						id: 'valueV',
						default: 100,
						min: 0,
						max: 200,
						isVisibleExpression: `$(options:splitScale)`,
					},
				],
				callback: (action) => {
					const cue = conformCueID(action.options.cuenumber)
					if (!cue) return
					if (action.options.splitScale) {
						self.api.sendValue(`${cue}/scaleHAsPercent`, action.options.valueH, 's')
						self.api.sendValue(`${cue}/scaleVAsPercent`, action.options.valueV, 's')
					} else {
						self.api.sendValue(`${cue}/scaleAsPercent`, action.options.value, 's')
					}
				},
			},
			position: {
				name: 'Position',
				options: [
					cueOption,
					{
						type: 'textinput',
						label: 'Position X (pixels, optional)',
						id: 'valueX',
					},
					{
						type: 'textinput',
						label: 'Position Y (pixels, optional)',
						id: 'valueY',
					},
				],
				callback: (action) => {
					sendCueValues(self, action.options, PositionCommands)
				},
			},
			crop: {
				name: 'Crop',
				options: [
					cueOption,
					{
						type: 'textinput',
						label: 'Crop Left (pixels, optional)',
						id: 'valueLeft',
					},
					{
						type: 'textinput',
						label: 'Crop Right (pixels, optional)',
						id: 'valueRight',
					},
					{
						type: 'textinput',
						label: 'Crop Top (pixels, optional)',
						id: 'valueTop',
					},
					{
						type: 'textinput',
						label: 'Crop Bottom (pixels, optional)',
						id: 'valueBottom',
					},
				],
				callback: (action) => {
					sendCueValues(self, action.options, CropCommands)
				},
			},
			adjustVolume: {
				name: 'Adjust Current Cue Volume',
				options: [
					{
						type: 'number',
						label: 'Adjustment Amount (dB)',
						id: 'value',
						default: 1,
						min: -72,
						max: 72,
					},
				],
				callback: (action) => {
					if (self.states.currentCueVolume !== undefined) {
						let newValue = self.states.currentCueVolume + action.options.value
						if (newValue < -60) {
							newValue = -60
						}
						if (newValue > 12) {
							newValue = 12
						}
						self.api.sendValue(`current/volumeAsDecibels`, newValue, 's')
						// Mitti only reports the new volume on the refresh, so a quick next turn builds on this value
						self.states.currentCueVolume = newValue
						self.api.requestStateRefresh()
					}
				},
			},
			mainFader: {
				name: 'Master Fader',
				description: 'Requires Mitti 2.2.0',
				options: [
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						default: 'auto',
						disableAutoExpression: true,
						choices: [
							{ id: 'auto', label: 'Auto-Fade' },
							{ id: 'custom', label: 'Custom Value' },
						],
					},
					{
						type: 'number',
						label: 'Fade Value (0 to 100)',
						id: 'value',
						default: 0,
						min: 0,
						max: 100,
						isVisibleExpression: `$(options:mode) == 'custom'`,
					},
				],
				callback: (action) => {
					if (action.options.mode == 'auto') {
						self.api.sendCommand(`autoFade`)
					} else {
						self.api.sendValue(`mainFader`, action.options.value / 100, 's')
					}
				},
			},
			gotoEnd: {
				name: 'Goto End',
				description: 'Moves the playhead to a set time before the end of the cue',
				options: [
					{
						type: 'dropdown',
						label: 'Time before End',
						id: 'seconds',
						default: '30',
						choices: GotoEndSeconds.map((seconds) => ({ id: seconds, label: `${seconds} seconds` })),
					},
				],
				callback: (action) => {
					const seconds = String(action.options.seconds)
					if ((GotoEndSeconds as readonly string[]).includes(seconds)) self.api.sendCommand(`goto${seconds}`)
				},
			},
			playhead: {
				name: 'Scrub by Percent',
				options: [
					{
						type: 'number',
						label: 'Adjustment Amount (-100% to 100%)',
						id: 'value',
						default: 1,
						min: -100,
						max: 100,
						range: true,
						step: 1,
					},
				],
				callback: (action) => {
					const currentValue = self.states.playhead ? self.states.playhead : 0
					let newValue = currentValue * 100 + action.options.value
					newValue = newValue / 100

					if (newValue < 0) {
						newValue = 0
					}
					if (newValue > 1) {
						newValue = 1
					}
					self.api.sendValue(`playhead`, newValue, 's')
				},
			},
			scrubPlayhead: {
				name: 'Scrub by Timecode',
				description: 'Requires Mitti 2.8.9',
				options: [
					{
						type: 'textinput',
						label: 'Timecode Adjustment',
						tooltip:
							'Use + or - to move forward or backward, using the format hh:mm:ss:frames. Ex. +01:00 moves forward 1 seconds',
						id: 'value',
						default: '+01:00',
						useVariables: true,
					},
				],
				callback: (action) => {
					const value = action.options.value
					self.api.sendValue(`playheadScrub`, value, 's')
				},
			},
			locatePlayhead: {
				name: 'Locate Timecode',
				options: [
					{
						type: 'textinput',
						label: 'SMPTE Timecode',
						tooltip: 'Must use the format hh:mm:ss:frames',
						id: 'value',
						default: '00:00:00:00',
						useVariables: true,
					},
				],
				callback: (action) => {
					const value = action.options.value
					self.api.sendValue(`locateCurrentCue`, value, 's')
				},
			},
			adjustPlaybackSpeed: {
				name: 'Adjust Current Cue Playback Speed',
				options: [
					{
						type: 'number',
						label: 'Speed Adjustment Amount (%)',
						id: 'value',
						default: 5,
						min: -1199,
						max: 1199,
					},
				],
				callback: (action) => {
					if (self.states.currentCuePlaybackSpeed !== undefined) {
						let newValue = self.states.currentCuePlaybackSpeed + action.options.value
						if (newValue < 1) {
							newValue = 1
						}
						if (newValue > 1200) {
							newValue = 1200
						}
						self.api.sendValue(`current/playbackSpeed`, newValue, 's')
						self.states.currentCuePlaybackSpeed = newValue
						self.api.requestStateRefresh()
					}
				},
			},
		},
		ActionGroups,
	)
}
