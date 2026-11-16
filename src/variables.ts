import type { CompanionVariableDefinitions, CompanionVariableValue } from '@companion-module/base'
import { playlistCueIDs } from './utils.js'
import type MittiInstance from './main.js'

const StandardVariables = {
	currentCueName: { name: 'Name of the playing cue' },
	currentCueID: { name: 'Cue ID of the playing cue' },
	previousCueName: { name: 'Previous cue in playlist' },
	nextCueName: { name: 'Next cue in playlist' },
	selectedCueName: { name: 'Name of currently selected cue' },
	selectedCueID: { name: 'Cue ID of the currently selected cue' },
	playStatus: { name: 'Play/ Pause Status' },
	cueTimeLeft: { name: 'Time remaining for current cue, will shorten to -MM:SS if less than 1 hour' },
	cueTimeLeft_hhmmss: { name: 'Time remaining for current cue, will always show full -HH:MM:SS timecode' },
	cueTimeLeft_h: { name: 'Time remaining for current cue (hours)' },
	cueTimeLeft_m: { name: 'Time remaining for current cue (minutes)' },
	cueTimeLeft_s: { name: 'Time remaining for current cue (seconds)' },
	cueTimeLeft_total_seconds: { name: 'Time remaining for current cue in total seconds' },
	cueTimeElapsed: { name: 'Time elapsed for current cue, will shorten to MM:SS if less than 1 hour' },
	cueTimeElapsed_hhmmss: { name: 'Time elapsed for current cue, will always show full HH:MM:SS timecode' },
	cueTimeElapsed_h: { name: 'Time elapsed for current cue (hours)' },
	cueTimeElapsed_m: { name: 'Time elapsed for current cue (minutes)' },
	cueTimeElapsed_s: { name: 'Time elapsed for current cue (seconds)' },
	cueTimeElapsed_total_seconds: { name: 'Time elapsed for current cue in total seconds' },
	currentCueTRT: { name: 'Total run time (TRT) for current cue, will shorten to MM:SS if less than 1 hour' },
	currentCueTRT_hhmmss: { name: 'Total run time (TRT) for current cue, will always show full HH:MM:SS timecode' },
	currentCueTRT_h: { name: 'Total run time (TRT) for current cue (hours)' },
	currentCueTRT_m: { name: 'Total run time (TRT) for current cue (minutes)' },
	currentCueTRT_s: { name: 'Total run time (TRT) for current cue (seconds)' },
	currentCueTRT_total_seconds: { name: 'Total run time (TRT) for current cue in total seconds' },
	currentCueAudio: { name: 'Audio mute status for current cue' },
	currentCueVolume: { name: 'Audio volume for current cue in dB' },
	currentCuePauseAtBeginning: { name: 'Pause At Beginning status for current cue' },
	currentCuePauseAtEnd: { name: 'Pause At End status for current cue' },
	currentCueFadeIn: { name: 'Fade In status for current cue' },
	currentCueFadeOut: { name: 'Fade Out status for current cue' },
	currentCueLoop: { name: 'Loop status for current cue' },
	currentCueTransition: { name: 'Transition status for current cue' },
	currentCueGoto: { name: 'Goto status for current cue' },
	currentCuePlaybackSpeed: { name: 'Current playback speed for current cue' },
	video_outputs: { name: 'Current status of video outputs' },
	audio_outputs: { name: 'Current status of audio outputs' },
} satisfies Record<string, { name: string }>

export type VariablesSchema = Record<keyof typeof StandardVariables, CompanionVariableValue | undefined> & {
	[cueName: `cue_${string}_cueName`]: CompanionVariableValue | undefined
}

export function getVariables(self: MittiInstance): CompanionVariableDefinitions<VariablesSchema> {
	const variables: CompanionVariableDefinitions<VariablesSchema> = { ...StandardVariables }

	//Cue Variables
	for (const cueID of playlistCueIDs(self.cues)) {
		variables[`cue_${cueID}_cueName`] = { name: `Cue ${cueID} - Name` }
	}

	return variables
}

export function getCueVariableValues(self: MittiInstance): Partial<VariablesSchema> {
	const values: Partial<VariablesSchema> = {}
	for (const cueID of playlistCueIDs(self.cues)) {
		values[`cue_${cueID}_cueName`] = self.cues[cueID]?.cueName
	}
	return values
}
