import type {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionInputFieldNumber,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import type MittiInstance from './main.js'
import { conformCueID } from './utils.js'

type NoOptions = Record<string, never>
type CueOptions = { cuenumber: string }
type ForceCutOptions = { forceCut: boolean }

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
	jump_prev: { name: 'Jump to previous cue', command: 'jumpToPrevCue' },
	jump_next: { name: 'Jump to next cue', command: 'jumpToNextCue' },
	jump_selected: { name: 'Jump to selected cue', command: 'jumpToSelectedCue' },
	select_prev: { name: 'Select previous cue', command: 'selectPrevCue' },
	select_next: { name: 'Select next cue', command: 'selectNextCue' },
	goto_30: { name: 'Goto 30', command: 'goto30' },
	goto_20: { name: 'Goto 20', command: 'goto20' },
	goto_10: { name: 'Goto 10', command: 'goto10' },
	fullscreenToggle: { name: 'Toggle Fullscreen', command: 'toggleFullscreen' },
	fullscreenOn: { name: 'Fullscreen On', command: 'fullscreenOn' },
	fullscreenOff: { name: 'Fullscreen Off', command: 'fullscreenOff' },
	plLoopToggle: { name: 'Toggle Playlist Loop', command: 'toggleLoop' },
	plLoopOn: { name: 'Playlist Loop On', command: 'loopOn' },
	plLoopOff: { name: 'Playlist Loop Off', command: 'loopOff' },
	plTransToggle: { name: 'Toggle Playlist Transition on Play', command: 'toggleTransitionOnPlay' },
	plTransOff: { name: 'Transition on Play Off', command: 'transitionOnPlayOff' },
	plTransOn: { name: 'Transition on Play On', command: 'transitionOnPlayOn' },
	resendOSCFeedback: { name: 'Resend OSC feedback', command: 'resendOSCFeedback' },
	toggleVideoOutputs: {
		name: 'Toggle Video Outputs',
		description: 'Requires Mitti 2.8.0',
		command: 'toggleVideoOutputs',
	},
	videoOutputsOn: { name: 'Video Outputs On', description: 'Requires Mitti 2.8.0', command: 'videoOutputsOn' },
	videoOutputsOff: { name: 'Video Outputs Off', description: 'Requires Mitti 2.8.0', command: 'videoOutputsOff' },
	toggleAudioOutputs: { name: 'Toggle Audio Outputs', description: 'Requires Mitti 2.8.9', command: 'toggleAudio' },
	audioOutputsOn: { name: 'Audio Outputs On', description: 'Requires Mitti 2.8.9', command: 'unmuteAudio' },
	audioOutputsOff: { name: 'Audio Outputs Off', description: 'Requires Mitti 2.8.9', command: 'muteAudio' },
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
	jump_cue: { name: 'Jump to specific cue', command: 'jump' },
	select_cue: { name: 'Select Cue', command: 'select' },
	audioOn: { name: 'Cue Audio On', command: 'audioOn' },
	audioOff: { name: 'Cue Audio Off', command: 'audioOff' },
	toggleAudio: { name: 'Toggle Cue Audio', command: 'toggleAudio' },
	toggleFadeIn: { name: 'Toggle Fade In', command: 'toggleFadeIn' },
	fadeInOn: { name: 'Fade In On', command: 'fadeInOn' },
	fadeInOff: { name: 'Fade In Off', command: 'fadeInOff' },
	toggleFadeOut: { name: 'Toggle Fade Out', command: 'toggleFadeOut' },
	fadeOutOn: { name: 'Fade Out On', command: 'fadeOutOn' },
	fadeOutOff: { name: 'Fade Out Off', command: 'fadeOutOff' },
	toggleGoto: { name: 'Toggle Goto Cue after End', command: 'toggleGoto' },
	gotoOn: { name: 'Goto after End On', command: 'gotoOn' },
	gotoOff: { name: 'Goto after End Off', command: 'gotoOff' },
	toggleLoop: { name: 'Toggle Loop', command: 'toggleLoop' },
	loopOn: { name: 'Loop On', command: 'loopOn' },
	loopOff: { name: 'Loop Off', command: 'loopOff' },
	togglePauseAtBeginning: { name: 'Toggle Pause At Beginning', command: 'togglePauseAtBeginning' },
	pauseAtBeginningOn: { name: 'Pause At Beginning On', command: 'pauseAtBeginningOn' },
	pauseAtBeginningOff: { name: 'Pause At Beginning Off', command: 'pauseAtBeginningOff' },
	togglePauseAtEnd: { name: 'Toggle Pause At End', command: 'togglePauseAtEnd' },
	pauseAtEndOn: { name: 'Pause At End On', command: 'pauseAtEndOn' },
	pauseAtEndOff: { name: 'Pause At End Off', command: 'pauseAtEndOff' },
	toggleTransition: { name: 'Toggle Transition', command: 'toggleTransition' },
	transitionOn: { name: 'Transition On', command: 'transitionOn' },
	transitionOff: { name: 'Transition Off', command: 'transitionOff' },
	toggleVideoFx: { name: 'Toggle VideoFx', command: 'toggleVideoFx' },
	videoFxOn: { name: 'VideoFx On', command: 'videoFxOn' },
	videoFxOff: { name: 'VideoFx Off', command: 'videoFxOff' },
} as const satisfies Record<string, CommandAction>

// Actions that send `<cue>/<command>` with a numeric value
const CueValueActions = {
	rotation: {
		name: 'Cue Rotation',
		command: 'rotateAsDegrees',
		value: { label: 'Degrees (°)', default: 0, min: -180, max: 180 },
	},
	hue: { name: 'Cue Hue', command: 'hueAsDegrees', value: { label: 'Degrees (°)', default: 0, min: -180, max: 180 } },
	saturation: {
		name: 'Cue Saturation',
		command: 'saturationAsPercent',
		value: { label: 'Saturation (%)', default: 0, min: -100, max: 100 },
	},
	vibrance: {
		name: 'Cue Vibrance',
		command: 'vibranceAsPercent',
		value: { label: 'Vibrance (%)', default: 0, min: -100, max: 100 },
	},
	brightness: {
		name: 'Cue Brightness',
		command: 'brightnessAsPercent',
		value: { label: 'Brightness (%)', default: 0, min: -100, max: 100 },
	},
	contrast: {
		name: 'Cue Contrast',
		command: 'contrastAsPercent',
		value: { label: 'Contrast (%)', default: 0, min: -100, max: 100 },
	},
	opacity: {
		name: 'Cue Opacity',
		command: 'opacityAsPercent',
		value: { label: 'Opacity (%)', default: 100, min: 0, max: 100 },
	},
	volume: {
		name: 'Set Cue Volume to Value',
		command: 'volumeAsDecibels',
		value: { label: 'Volume (db, -60 to 12)', default: 0, min: -60, max: 12 },
	},
	playbackSpeed: {
		name: 'Set Cue Playback Speed',
		command: 'playbackSpeed',
		value: { label: 'Speed (1% to 1200%)', default: 100, min: 1, max: 1200, range: true, step: 10 },
	},
} as const satisfies Record<string, CommandAction & { value: Omit<CompanionInputFieldNumber<'value'>, 'id' | 'type'> }>

export type ActionsSchema = { [K in keyof typeof SimpleActions]: { options: NoOptions } } & {
	[K in keyof typeof CueActions]: { options: CueOptions }
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
	playhead: { options: { value: number } }
	scrubPlayhead: { options: { value: string } }
	locatePlayhead: { options: { value: string } }
	adjustPlaybackSpeed: { options: { value: number } }
}

const cueToolTip = 'You can also use "current", "selected", "previous", "next" or "all"'

const cueOption: CompanionInputFieldTextInput<'cuenumber'> = {
	type: 'textinput',
	tooltip: cueToolTip,
	useVariables: true,
	label: 'Cue number or ID',
	id: 'cuenumber',
	default: 'current',
}

function mapActions<
	TTable extends Record<string, CommandAction>,
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
	return {
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
				const cueID = conformCueID(action.options.cuenumber?.trim())
				if (!cueID) return
				self.api.sendCommand(`${cueID}/${command}`)
			},
		})),
		...mapActions(CueValueActions, ({ command, value, ...definition }) => ({
			...definition,
			options: [cueOption, { ...value, type: 'number', id: 'value' as const }],
			callback: (action) => {
				self.api.sendValue(`${conformCueID(action.options.cuenumber)}/${command}`, action.options.value, 's')
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
			name: 'Jump to cue with name',
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
			name: 'Play cue with number / ID',
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
				const cueID = conformCueID(action.options.cuenumber?.trim())
				if (!cueID) return
				if (action.options.forceCut) {
					self.api.sendValue(`playCueWithCueIDForceCut`, cueID, 's')
				} else {
					self.api.sendValue(`playCueWithCueID`, cueID, 's')
				}
			},
		},
		playCueIndex: {
			name: 'Play cue at index',
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
				if (index < 1 || index > 999) {
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
			name: 'Play cue with name',
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
			name: 'Set Goto after End Cue',
			description: 'Requires Mitti 2.2.8',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
				{
					type: 'textinput',
					useVariables: true,
					label: 'Goto Cue number or ID',
					id: 'gotoCue',
					default: '2',
				},
			],
			callback: (action) => {
				self.api.sendValue(
					`${conformCueID(action.options.cuenumber)}/setGotoToCueID`,
					`${conformCueID(action.options.gotoCue)}`,
					's',
				)
			},
		},
		scale: {
			name: 'Cue Scale',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
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
				if (action.options.splitScale) {
					self.api.sendValue(`${cue}/scaleHAsPercent`, action.options.valueH, 's')
					self.api.sendValue(`${cue}/scaleVAsPercent`, action.options.valueV, 's')
				} else {
					self.api.sendValue(`${cue}/scaleAsPercent`, action.options.value, 's')
				}
			},
		},
		position: {
			name: 'Cue Position',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
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
				if (action.options.valueX) {
					self.api.sendValue(`${conformCueID(action.options.cuenumber)}/posXAsPixels`, action.options.valueX, 's')
				}
				if (action.options.valueY) {
					self.api.sendValue(`${conformCueID(action.options.cuenumber)}/posYAsPixels`, action.options.valueY, 's')
				}
			},
		},
		crop: {
			name: 'Cue Crop',
			options: [
				{
					type: 'textinput',
					tooltip: cueToolTip,
					useVariables: true,
					label: 'Cue number or ID',
					id: 'cuenumber',
					default: 'current',
				},
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
				if (action.options.valueLeft) {
					self.api.sendValue(
						`${conformCueID(action.options.cuenumber)}/cropLeftAsPixels`,
						action.options.valueLeft,
						's',
					)
				}
				if (action.options.valueRight) {
					self.api.sendValue(
						`${conformCueID(action.options.cuenumber)}/cropRightAsPixels`,
						action.options.valueRight,
						's',
					)
				}
				if (action.options.valueTop) {
					self.api.sendValue(`${conformCueID(action.options.cuenumber)}/cropTopAsPixels`, action.options.valueTop, 's')
				}
				if (action.options.valueBottom) {
					self.api.sendValue(
						`${conformCueID(action.options.cuenumber)}/cropBottomAsPixels`,
						action.options.valueBottom,
						's',
					)
				}
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
		playhead: {
			name: 'Scrub Playhead by Percent',
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
			name: 'Scrub Playhead with Timecode',
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
			name: 'Locate Playhead with Timecode',
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
				}
			},
		},
	}
}
