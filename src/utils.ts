import { combineRgb } from '@companion-module/base'
import type { CueState } from './api.js'

// Dark state fills keep white text readable on small control-surface displays.
export const ColorWhite = combineRgb(245, 247, 250)
export const ColorSurface = combineRgb(41, 41, 41)
export const ColorMuted = combineRgb(181, 181, 181)
export const ColorGreen = combineRgb(19, 91, 63)
export const ColorRed = combineRgb(143, 35, 53)
export const ColorRedDim = combineRgb(76, 28, 39)
export const ColorGold = combineRgb(112, 78, 19)
export const ColorOrange = combineRgb(125, 69, 18)
export const MittiBlue = combineRgb(22, 76, 119)
export const MittiCyan = combineRgb(0, 182, 232)
export const MittiGray = combineRgb(70, 70, 70)
export const ColorDisabledText = combineRgb(118, 118, 118)

// Keys come from OSC addresses, so use a prototype-less object to keep names like `__proto__` as plain keys
export function createRecord<T>(): Record<string, T> {
	return Object.create(null) as Record<string, T>
}

// `cues` also holds state for the current/previous/next cues and Mitti's cue 0, which aren't real playlist cues
const NON_PLAYLIST_CUES = new Set(['current', 'previous', 'next', '0'])

// A cue only counts once Mitti has named it; stray updates for a deleted cue can recreate a nameless entry
export function playlistCueIDs(cues: Record<string, CueState>): string[] {
	return Object.keys(cues).filter((cueID) => !NON_PLAYLIST_CUES.has(cueID) && cues[cueID]?.cueName !== undefined)
}

export function conformCueID(cueID: string): string {
	let cue = String(cueID ?? '').trim()

	if (!cue.match(/^(current|selected|previous|next|all)$/)) {
		cue = cue.toUpperCase().slice(0, 6)
	}
	return cue
}
