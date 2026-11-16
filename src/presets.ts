import type {
	CompanionPresetDefinitions,
	CompanionPresetSection,
	CompanionPresetAlternatives,
} from '@companion-module/base'
import type { StateActionId } from './actions.js'
import type { CueToggleFeedbackId, StateFlagFeedbackId } from './feedbacks.js'
import type MittiInstance from './main.js'
import type { ModuleSchema } from './main.js'
import { button, type PresetAction, type PresetFeedback } from './preset-design.js'

import {
	ColorGold,
	ColorSurface,
	ColorWhite,
	ColorRedDim,
	ColorDisabledText,
	ColorGreen,
	ColorOrange,
	ColorRed,
	MittiBlue,
	MittiGray,
	playlistCueIDs,
} from './utils.js'

export { PresetTextSizes } from './preset-design.js'

type Presets = Record<string, CompanionPresetAlternatives<ModuleSchema>>

interface SettingButtons {
	ids: { toggle?: string; on: string; off: string }
	name: string
	subject: string[]
	action: StateActionId
	// Cue settings target the current cue
	forCurrentCue: boolean
	// Builds the feedback that is true while the setting is on, or off when inverted
	state: ((isOff: boolean) => PresetFeedback) | null
	statusOnly?: boolean
}

// The live label uses the same variable that Mitti's current-cue feedback updates.
const CurrentCueStatusVariables = new Map<string, string>([
	['cueAudioStatus', 'currentCueAudio'],
	['cuePauseAtBeginningStatus', 'currentCuePauseAtBeginning'],
	['cuePauseAtEndStatus', 'currentCuePauseAtEnd'],
	['cueFadeInStatus', 'currentCueFadeIn'],
	['cueFadeOutStatus', 'currentCueFadeOut'],
	['cueLoopStatus', 'currentCueLoop'],
	['cueTransitionStatus', 'currentCueTransition'],
])

function settingButtons({
	ids,
	name,
	subject,
	action,
	forCurrentCue,
	state,
	statusOnly = false,
}: SettingButtons): Presets {
	const down = (setting: 'toggle' | 'on' | 'off') =>
		({
			actionId: action,
			options: forCurrentCue ? { cuenumber: 'current', state: setting } : { state: setting },
		}) as PresetAction
	const on = state?.(false)
	const off = state?.(true)
	const statusVariable = on && CurrentCueStatusVariables.get(on.feedbackId)
	const toggleFeedbacks = on ? [on] : []
	if (statusOnly && off) toggleFeedbacks.push(off)
	return {
		...(ids.toggle
			? {
					[ids.toggle]: button({
						name: `Toggle ${name}`,
						lines: [subject.join(' '), statusVariable ? `$(mitti:${statusVariable})` : 'Toggle'],
						down: [down('toggle')],
						feedbacks: toggleFeedbacks,
					}),
				}
			: {}),
		[ids.on]: button({
			name: name === 'Cue Audio' ? 'Unmute Cue Audio' : `${name} On`,
			lines: [subject.join(' '), name === 'Cue Audio' ? 'Unmute' : 'Set On'],
			down: [down('on')],
			feedbacks: on && !statusOnly ? [on] : [],
		}),
		[ids.off]: button({
			name: name === 'Cue Audio' ? 'Mute Cue Audio' : `${name} Off`,
			lines: [subject.join(' '), name === 'Cue Audio' ? 'Mute' : 'Set Off'],
			down: [down('off')],
			feedbacks: off && !statusOnly ? [off] : [],
		}),
	}
}

const enabledStyle = { bgcolor: MittiBlue, color: ColorWhite }
const selectedStyle = { bgcolor: MittiGray, color: ColorWhite }

const outputState =
	(feedbackId: StateFlagFeedbackId) =>
	(isOff: boolean): PresetFeedback => ({
		feedbackId,
		options: {},
		isInverted: isOff,
		style: isOff ? selectedStyle : enabledStyle,
	})

const currentCueIsOn =
	(feedbackId: CueToggleFeedbackId) =>
	(isOff: boolean): PresetFeedback => ({
		feedbackId,
		options: { cueID: 'current' },
		isInverted: isOff,
		style: isOff ? selectedStyle : enabledStyle,
	})

const playStateFeedbacks: PresetFeedback[] = [
	{ feedbackId: 'playStatus', options: { playPause: 'Playing' }, style: { bgcolor: ColorGreen } },
	{ feedbackId: 'playStatus', options: { playPause: 'Paused' }, style: { bgcolor: ColorGold } },
]

const pauseResumeFeedbacks: PresetFeedback[] = [
	{
		feedbackId: 'playStatus',
		options: { playPause: 'Playing' },
		style: { bgcolor: ColorGreen, text: 'TRANSPORT\nPAUSE' },
	},
	{
		feedbackId: 'playStatus',
		options: { playPause: 'Paused' },
		style: { bgcolor: ColorGold, text: 'TRANSPORT\nRESUME' },
	},
]

const selectedPlayingFeedback: PresetFeedback = {
	feedbackId: 'playingCueID',
	options: { cueID: '$(mitti:selectedCueID)' },
	style: { bgcolor: ColorGreen },
}

type PresetGroup = { id: string; name: string; description?: string; presets: Presets }
type PresetSection = { id: string; name: string; groups: PresetGroup[] }

const cueTarget = { isExpression: true, value: '$(local:cue_target)' } as const

function cueTargetButton(name: string, label: string, action: PresetAction): CompanionPresetAlternatives<ModuleSchema> {
	return button({
		name,
		lines: [label, cueTarget.value],
		size: 'fit',
		down: [action],
		localVariables: [{ variableType: 'simple', variableName: 'cue_target', startupValue: '' }],
		missingValue: 'SET TARGET',
	})
}

const PrimarySections: PresetSection[] = [
	{
		id: 'playlistActions',
		name: 'Transport Control',
		groups: [
			{
				id: 'playlistGraphics',
				name: 'Transport',
				presets: {
					playPlaylist: button({
						name: 'Play Playlist',
						lines: ['Playlist', 'Play'],
						icon: 'playlist',
						down: [{ actionId: 'play', options: {} }],
						feedbacks: [playStateFeedbacks[0]],
					}),
					playSelected: button({
						name: 'Play Selected Cue',
						lines: ['Selected Cue', 'Play'],
						icon: 'selectedCue',
						down: [{ actionId: 'play_select', options: { forceCut: false } }],
						feedbacks: [selectedPlayingFeedback],
					}),
					pauseResume: button({
						name: 'Pause / Resume',
						lines: ['Transport', 'Pause / Resume'],
						icon: 'playPause',
						down: [{ actionId: 'toggle_play', options: {} }],
						feedbacks: pauseResumeFeedbacks,
					}),
					pause: button({
						name: 'Pause',
						lines: ['Transport', 'Pause'],
						icon: 'pause',
						down: [{ actionId: 'stop', options: {} }],
						feedbacks: [playStateFeedbacks[1]],
					}),
					selectedCueStatus: button({
						name: 'Selected Cue - Play on Press',
						lines: ['Selected', '$(mitti:selectedCueName)'],
						hint: 'PRESS TO PLAY',
						size: 'fit',
						down: [{ actionId: 'play_select', options: { forceCut: false } }],
						feedbacks: [selectedPlayingFeedback],
					}),
				},
			},
			{
				id: 'playlistTextCueNav',
				name: 'Jump & Select',
				presets: {
					jumpPrevious: button({
						name: 'Jump to Previous Cue',
						lines: ['Jump Cue', 'Previous'],
						icon: 'previous',
						down: [{ actionId: 'jump_prev', options: {} }],
					}),
					jumpNext: button({
						name: 'Jump to Next Cue',
						lines: ['Jump Cue', 'Next'],
						icon: 'next',
						down: [{ actionId: 'jump_next', options: {} }],
					}),
					jumpSelected: button({
						name: 'Jump to Selected Cue',
						lines: ['Jump', 'Selected'],
						down: [{ actionId: 'jump_selected', options: {} }],
					}),
					selectPrevious: button({
						name: 'Select Previous Cue',
						lines: ['Select', 'Previous'],
						down: [{ actionId: 'select_prev', options: {} }],
					}),
					selectNext: button({
						name: 'Select Next Cue',
						lines: ['Select', 'Next'],
						down: [{ actionId: 'select_next', options: {} }],
					}),
				},
			},
			{
				id: 'playlistPlayhead',
				name: 'Playhead',
				presets: {
					rewindText: button({
						name: 'Rewind',
						lines: ['Transport', 'Rewind'],
						size: 'primary',
						down: [{ actionId: 'rewind', options: {} }],
					}),
					goTo30: button({
						name: 'Goto 30',
						lines: ['Goto', '30'],
						mono: true,
						down: [{ actionId: 'gotoEnd', options: { seconds: '30' } }],
					}),
					goTo20: button({
						name: 'Goto 20',
						lines: ['Goto', '20'],
						mono: true,
						down: [{ actionId: 'gotoEnd', options: { seconds: '20' } }],
					}),
					goTo10: button({
						name: 'Goto 10',
						lines: ['Goto', '10'],
						mono: true,
						down: [{ actionId: 'gotoEnd', options: { seconds: '10' } }],
					}),
					scrubPlayheadMinusOne: button({
						name: 'Scrub -1 Second',
						lines: ['Scrub', '−1s'],
						mono: true,
						down: [{ actionId: 'scrubPlayhead', options: { value: '-01:00' } }],
					}),
					scrubPlayheadPlusOne: button({
						name: 'Scrub +1 Second',
						lines: ['Scrub', '+1s'],
						mono: true,
						down: [{ actionId: 'scrubPlayhead', options: { value: '+01:00' } }],
					}),
					scrubPlayheadRotary: button({
						name: 'Scrub Playhead - Rotary Knob',
						lines: ['Scrub Knob', '±1s'],
						hint: 'PRESS +1s',
						mono: true,
						down: [{ actionId: 'scrubPlayhead', options: { value: '+01:00' } }],
						rotateLeft: [{ actionId: 'scrubPlayhead', options: { value: '-01:00' } }],
						rotateRight: [{ actionId: 'scrubPlayhead', options: { value: '+01:00' } }],
					}),
				},
			},
			{
				id: 'playlistEmergency',
				name: 'Emergency',
				presets: {
					panic: button({
						name: 'Panic',
						lines: ['Emergency', 'Panic'],
						size: 'primary',
						bgcolor: ColorRed,
						down: [{ actionId: 'panic', options: {} }],
					}),
				},
			},
			{
				id: 'playlistText',
				name: 'Text Alternatives',
				presets: {
					playPlaylistText: button({
						name: 'Play Playlist',
						lines: ['Playlist', 'Play'],
						size: 'primary',
						down: [{ actionId: 'play', options: {} }],
						feedbacks: [playStateFeedbacks[0]],
					}),
					playSelectedText: button({
						name: 'Play Selected Cue',
						lines: ['Selected Cue', 'Play'],
						down: [{ actionId: 'play_select', options: { forceCut: false } }],
						feedbacks: [selectedPlayingFeedback],
					}),
					pauseResumeText: button({
						name: 'Pause / Resume',
						lines: ['Transport', 'Pause / Resume'],
						down: [{ actionId: 'toggle_play', options: {} }],
						feedbacks: pauseResumeFeedbacks,
					}),
					pauseText: button({
						name: 'Pause',
						lines: ['Transport', 'Pause'],
						size: 'primary',
						down: [{ actionId: 'stop', options: {} }],
						feedbacks: [playStateFeedbacks[1]],
					}),
					jumpPreviousText: button({
						name: 'Jump to Previous Cue',
						lines: ['Jump', 'Previous'],
						down: [{ actionId: 'jump_prev', options: {} }],
					}),
					jumpNextText: button({
						name: 'Jump to Next Cue',
						lines: ['Jump', 'Next'],
						down: [{ actionId: 'jump_next', options: {} }],
					}),
				},
			},
		],
	},
	{
		id: 'cueStatus',
		name: 'Cue Status',
		groups: [
			{
				id: 'playlistStatus',
				name: 'Status',
				presets: {
					currentCueStatus: button({
						name: 'Current Cue',
						lines: ['Current', '$(mitti:currentCueName)'],
						size: 'fit',
					}),
					nextCueStatus: button({ name: 'Next Cue', lines: ['Next', '$(mitti:nextCueName)'], size: 'fit' }),
					previousCueStatus: button({
						name: 'Previous Cue',
						lines: ['Previous', '$(mitti:previousCueName)'],
						size: 'fit',
					}),
					playStauts: button({
						name: 'Play Status',
						lines: ['Status', '$(mitti:playStatus)'],
						feedbacks: playStateFeedbacks,
					}),
				},
			},
			{
				id: 'playlistTimers',
				name: 'Timing',
				presets: {
					currentCueTimeRemaining: button({
						name: 'Cue Time Remaining',
						lines: ['Remaining', '$(mitti:cueTimeLeft)'],
						mono: true,
						progress: true,
						// Keep the value readable: amber at 10s, red at 5s, one dim pulse at 1s.
						feedbacks: [
							{ feedbackId: 'timeRemaining', options: { time: 10 }, style: { bgcolor: ColorOrange } },
							{ feedbackId: 'timeRemaining', options: { time: 5 }, style: { bgcolor: ColorRed } },
							{ feedbackId: 'timeRemaining', options: { time: 1 }, style: { bgcolor: ColorRedDim } },
							{ feedbackId: 'timeRemaining', options: { time: 0 }, style: { bgcolor: ColorRed } },
						],
					}),
					currentCueTimeElapsed: button({
						name: 'Cue Time Elapsed',
						lines: ['Elapsed', '$(mitti:cueTimeElapsed)'],
						mono: true,
						progress: true,
					}),
					currentCueTRT: button({
						name: 'Cue Total Run Time',
						lines: ['Run Time', '$(mitti:currentCueTRT)'],
						mono: true,
					}),
				},
			},
		],
	},
	{
		id: 'currentCueActions',
		name: 'Current Cue Settings',
		groups: [
			{
				id: 'currentCueVolume',
				name: 'Cue Audio & Volume',
				presets: {
					...settingButtons({
						ids: { toggle: 'toggleAudio', on: 'audioOn', off: 'audioOff' },
						name: 'Cue Audio',
						subject: ['Cue Audio'],
						action: 'cueAudio',
						forCurrentCue: true,
						state: currentCueIsOn('cueAudioStatus'),
						statusOnly: true,
					}),
					currentCueVolumeStatus: button({
						name: 'Cue Volume Status',
						lines: ['Volume', '$(mitti:currentCueVolume) dB'],
						mono: true,
					}),
					currentCueVolumeMinusOne: button({
						name: 'Decrease Cue Volume by 1 dB',
						lines: ['Volume', '-1 dB'],
						mono: true,
						down: [{ actionId: 'adjustVolume', options: { value: -1 } }],
					}),
					currentCueVolumePlusOne: button({
						name: 'Increase Cue Volume by 1 dB',
						lines: ['Volume', '+1 dB'],
						mono: true,
						down: [{ actionId: 'adjustVolume', options: { value: 1 } }],
					}),
					currentCueVolumeReset: button({
						name: 'Reset Cue Volume',
						lines: ['Reset Volume', '0 dB'],
						mono: true,
						down: [{ actionId: 'volume', options: { cuenumber: 'current', value: 0 } }],
					}),
					currentCueVolumeRotary: button({
						name: 'Cue Volume - Rotary Knob',
						lines: ['Vol Knob', '$(mitti:currentCueVolume) dB'],
						hint: 'PRESS TO RESET',
						mono: true,
						down: [{ actionId: 'volume', options: { cuenumber: 'current', value: 0 } }],
						rotateLeft: [{ actionId: 'adjustVolume', options: { value: -1 } }],
						rotateRight: [{ actionId: 'adjustVolume', options: { value: 1 } }],
					}),
				},
			},
			{
				id: 'currentCuePlaybackSpeed',
				name: 'Speed',
				presets: {
					currentCuePlaybackSpeedStatus: button({
						name: 'Cue Speed Status',
						lines: ['Speed', '$(mitti:currentCuePlaybackSpeed)%'],
						mono: true,
					}),
					currentCuePlaybackMinusFive: button({
						name: 'Decrease Cue Speed by 5%',
						lines: ['Speed', '-5%'],
						mono: true,
						down: [{ actionId: 'adjustPlaybackSpeed', options: { value: -5 } }],
					}),
					currentCuePlaybackPlusFive: button({
						name: 'Increase Cue Speed by 5%',
						lines: ['Speed', '+5%'],
						mono: true,
						down: [{ actionId: 'adjustPlaybackSpeed', options: { value: 5 } }],
					}),
					currentCuePlaybackReset: button({
						name: 'Reset Cue Speed',
						lines: ['Reset Speed', '100%'],
						mono: true,
						down: [{ actionId: 'playbackSpeed', options: { cuenumber: 'current', value: 100 } }],
					}),
					currentCuePlaybackRotary: button({
						name: 'Cue Speed - Rotary Knob',
						lines: ['Speed Knob', '$(mitti:currentCuePlaybackSpeed)%'],
						hint: 'PRESS TO RESET',
						mono: true,
						down: [{ actionId: 'playbackSpeed', options: { cuenumber: 'current', value: 100 } }],
						rotateLeft: [{ actionId: 'adjustPlaybackSpeed', options: { value: -5 } }],
						rotateRight: [{ actionId: 'adjustPlaybackSpeed', options: { value: 5 } }],
					}),
				},
			},
			{
				id: 'currentPlayback',
				name: 'Playback Options',
				presets: {
					...settingButtons({
						ids: { toggle: 'toggleFadeIn', on: 'fadeInOn', off: 'fadeInOff' },
						name: 'Fade In',
						subject: ['Fade In'],
						action: 'cueFadeIn',
						forCurrentCue: true,
						state: currentCueIsOn('cueFadeInStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'toggleFadeOut', on: 'fadeOutOn', off: 'fadeOutOff' },
						name: 'Fade Out',
						subject: ['Fade Out'],
						action: 'cueFadeOut',
						forCurrentCue: true,
						state: currentCueIsOn('cueFadeOutStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'toggleLoop', on: 'loopOn', off: 'loopOff' },
						name: 'Loop',
						subject: ['Loop'],
						action: 'cueLoop',
						forCurrentCue: true,
						state: currentCueIsOn('cueLoopStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'togglePauseAtBeginning', on: 'pauseAtBeginningOn', off: 'pauseAtBeginningOff' },
						name: 'Pause at Beginning',
						subject: ['Pause Start'],
						action: 'cuePauseAtBeginning',
						forCurrentCue: true,
						state: currentCueIsOn('cuePauseAtBeginningStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'togglePauseAtEnd', on: 'pauseAtEndOn', off: 'pauseAtEndOff' },
						name: 'Pause at End',
						subject: ['Pause End'],
						action: 'cuePauseAtEnd',
						forCurrentCue: true,
						state: currentCueIsOn('cuePauseAtEndStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'toggleTransition', on: 'transitionOn', off: 'transitionOff' },
						name: 'Transition',
						subject: ['Transition'],
						action: 'cueTransition',
						forCurrentCue: true,
						state: currentCueIsOn('cueTransitionStatus'),
						statusOnly: true,
					}),
					...settingButtons({
						ids: { toggle: 'toggleVideoFX', on: 'videoFXOn', off: 'videoFXOff' },
						name: 'Video FX',
						subject: ['Video FX'],
						action: 'cueVideoFx',
						forCurrentCue: true,
						// Mitti doesn't report a cue's VideoFx state
						state: null,
					}),
				},
			},
			{
				id: 'currentInOut',
				name: 'In / Out',
				presets: {
					setInFromPlayhead: button({
						name: 'Set In From Playhead',
						lines: ['Playhead', 'Set In'],
						down: [{ actionId: 'setInFromPlayhead', options: {} }],
						feedbacks: [
							{
								feedbackId: 'inFromPlayheadEnabled',
								options: {},
								isInverted: true,
								style: { bgcolor: ColorSurface, color: ColorDisabledText },
							},
						],
					}),
					setOutFromPlayhead: button({
						name: 'Set Out From Playhead',
						lines: ['Playhead', 'Set Out'],
						down: [{ actionId: 'setOutFromPlayhead', options: {} }],
						feedbacks: [
							{
								feedbackId: 'outFromPlayheadEnabled',
								options: {},
								isInverted: true,
								style: { bgcolor: ColorSurface, color: ColorDisabledText },
							},
						],
					}),
				},
			},
		],
	},
]

const ConfigureCueTargetGroup: PresetGroup = {
	id: 'configureCueTarget',
	name: 'Configure a Cue Target',
	description:
		'Place a preset on a button. In the button editor, open Local Variables and enter the cue ID or exact cue name in the Current Value field for cue_target.',
	presets: {
		playCue: cueTargetButton('Play Cue by ID', 'Play by ID', {
			actionId: 'play_cue',
			options: { cuenumber: cueTarget, forceCut: false },
		}),
		jumpToCueWithNamePlay: cueTargetButton('Play Cue by Name', 'Play by Name', {
			actionId: 'playCueName',
			options: { forceCut: false, string: cueTarget },
		}),
		jumpToCueWithName: cueTargetButton('Jump to Cue by Name', 'Jump by Name', {
			actionId: 'jumpCueName',
			options: { string: cueTarget },
		}),
		jumpToSpecificCue: cueTargetButton('Jump to Cue by ID', 'Jump by ID', {
			actionId: 'jump_cue',
			options: { cuenumber: cueTarget },
		}),
		selectCue: cueTargetButton('Select Cue by ID', 'Select by ID', {
			actionId: 'select_cue',
			options: { cuenumber: cueTarget },
		}),
	},
}

const PlaylistSetupSection: PresetSection = {
	id: 'playlistSetup',
	name: 'Playlist Settings',
	groups: [
		{
			id: 'playlistLoop',
			name: 'Playlist Loop',
			presets: {
				...settingButtons({
					ids: { toggle: 'togglePlaylistLoop', on: 'playlistLoopOn', off: 'playlistLoopOff' },
					name: 'Playlist Loop',
					subject: ['Playlist', 'Loop'],
					action: 'playlistLoop',
					forCurrentCue: false,
					// Mitti's playlist loop state isn't tracked by the module
					state: null,
				}),
			},
		},
		{
			id: 'playlistTransitionOnPlay',
			name: 'Transition on Play',
			presets: {
				...settingButtons({
					ids: { toggle: 'toggleTransitionOnPlay', on: 'transitionOnPlayOn', off: 'transitionOnPlayOff' },
					name: 'Transition on Play',
					subject: ['Play Transition'],
					action: 'playlistTransition',
					forCurrentCue: false,
					// Mitti's transition on play state isn't tracked by the module
					state: null,
				}),
			},
		},
	],
}

const OutputsSection: PresetSection = {
	id: 'outputs',
	name: 'Outputs',
	groups: [
		{
			id: 'videoOutput',
			name: 'Video Outputs',
			presets: {
				videoOutputsActive: button({
					name: 'Video Outputs - Status / Toggle',
					lines: ['Video Out', '$(mitti:video_outputs)'],
					down: [{ actionId: 'videoOutputs', options: { state: 'toggle' } }],
					feedbacks: [outputState('videoOutputs')(false), outputState('videoOutputs')(true)],
				}),
				...settingButtons({
					ids: { on: 'videoOutputsOn', off: 'videoOutputsOff' },
					name: 'Video Outputs',
					subject: ['Video Out'],
					action: 'videoOutputs',
					forCurrentCue: false,
					state: outputState('videoOutputs'),
					statusOnly: true,
				}),
			},
		},
		{
			id: 'audioOutput',
			name: 'Audio Outputs',
			presets: {
				audioOutputsActive: button({
					name: 'Audio Outputs - Status / Toggle',
					lines: ['Audio Out', '$(mitti:audio_outputs)'],
					down: [{ actionId: 'audioOutputs', options: { state: 'toggle' } }],
					feedbacks: [outputState('audioOutputs')(false), outputState('audioOutputs')(true)],
				}),
				...settingButtons({
					ids: { on: 'audioOutputsOn', off: 'audioOutputsOff' },
					name: 'Audio Outputs',
					subject: ['Audio Out'],
					action: 'audioOutputs',
					forCurrentCue: false,
					state: outputState('audioOutputs'),
					statusOnly: true,
				}),
			},
		},
		{
			id: 'fullscreen',
			name: 'Fullscreen',
			presets: {
				...settingButtons({
					ids: { toggle: 'toggleFullscreen', on: 'fullscreenOn', off: 'fullscreenOff' },
					name: 'Fullscreen',
					subject: ['Fullscreen'],
					action: 'fullscreen',
					forCurrentCue: false,
					// Mitti doesn't report whether it is fullscreen
					state: null,
				}),
			},
		},
	],
}

function cuePresets(self: MittiInstance): Presets {
	const presets: Presets = {}
	for (const cueID of playlistCueIDs(self.cues)) {
		presets[`playCueID_${cueID}`] = button({
			name: `Play Cue ${cueID}`,
			// The label stays fixed while the cue name shrinks within its own bounds.
			lines: [`Play ${cueID}`, `$(mitti:cue_${cueID}_cueName)`],
			size: 'fit',
			down: [{ actionId: 'play_cue', options: { cuenumber: cueID, forceCut: false } }],
			feedbacks: [
				// Apply selection, activity, then playback in increasing priority.
				{ feedbackId: 'selectedCueID', options: { cueID }, style: selectedStyle },
				{ feedbackId: 'activeCueID', options: { cueID }, style: enabledStyle },
				{ feedbackId: 'playingCueID', options: { cueID }, style: { bgcolor: ColorGreen, color: ColorWhite } },
			],
		})
	}
	return presets
}

export function getPresets(self: MittiInstance): {
	structure: CompanionPresetSection<ModuleSchema>[]
	presets: CompanionPresetDefinitions<ModuleSchema>
} {
	const cues = cuePresets(self)
	const cueTargetGroups: PresetGroup[] = []
	if (Object.keys(cues).length > 0) {
		cueTargetGroups.push({ id: 'playCueById', name: 'Play Cue by ID', presets: cues })
	}
	cueTargetGroups.push(ConfigureCueTargetGroup)
	const sections: PresetSection[] = [
		...PrimarySections,
		{ id: 'cueActions', name: 'Cue Targets', groups: cueTargetGroups },
		PlaylistSetupSection,
		OutputsSection,
	]

	const structure: CompanionPresetSection<ModuleSchema>[] = []
	const presets: Presets = {}
	for (const { id, name, groups } of sections) {
		structure.push({
			id,
			name,
			definitions: groups.map((group) => ({
				id: group.id,
				type: 'simple' as const,
				name: group.name,
				description: group.description,
				presets: Object.keys(group.presets),
			})),
		})
		for (const group of groups) Object.assign(presets, group.presets)
	}

	return { structure, presets }
}
