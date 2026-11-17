import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { MittiApi } from '../api.js'
import { getVariables } from '../variables.js'
import {
	asInstance,
	createApi,
	createFakeInstance,
	feedbacksChecked,
	flush,
	receive,
	variablesSet,
	type FakeInstance,
} from './helpers.js'

// Message values below are taken from a real Mitti 2.8.19 session

let fake: FakeInstance
let api: MittiApi

beforeEach(() => {
	fake = createFakeInstance()
	api = createApi(fake)
})

describe('player messages', () => {
	test('cue names are passed through, with "-" shown as None', async () => {
		receive(api, '/mitti/currentCueName', 'TestMovie.mp4')
		receive(api, '/mitti/nextCueName', '-')
		await flush()

		expect(variablesSet(fake)).toEqual({ currentCueName: 'TestMovie.mp4', nextCueName: 'None' })
		expect(fake.states.currentCueName).toBe('TestMovie.mp4')
		expect(feedbacksChecked(fake)).toEqual(['activeCueName', 'playingCueID', 'playingCueName'])
	})

	test('time left drops frames and the hours when they are zero', async () => {
		receive(api, '/mitti/cueTimeLeft', '-00:02:55:22')
		await flush()

		expect(variablesSet(fake)).toEqual({
			cueTimeLeft: '-02:55',
			cueTimeLeft_hhmmss: '-00:02:55',
			cueTimeLeft_h: '00',
			cueTimeLeft_m: '02',
			cueTimeLeft_s: '55',
			cueTimeLeft_total_seconds: 175,
		})
		expect(fake.states.timeRemaining).toBe(175)
		expect(feedbacksChecked(fake)).toEqual(['timeRemaining'])
	})

	test('time remaining counts hours as 3600 seconds', async () => {
		receive(api, '/mitti/cueTimeLeft', '-01:02:03:00')
		await flush()

		expect(fake.states.timeRemaining).toBe(3723)
		expect(variablesSet(fake).cueTimeLeft).toBe('-01:02:03')
	})

	test('time elapsed keeps the hours in the short form', async () => {
		receive(api, '/mitti/cueTimeElapsed', '01:05:09:12')
		await flush()

		expect(variablesSet(fake)).toMatchObject({
			cueTimeElapsed: '01:05:09',
			cueTimeElapsed_hhmmss: '01:05:09',
			cueTimeElapsed_total_seconds: 3909,
		})
	})

	test('total duration is numeric, including cues with zero duration', async () => {
		receive(api, '/mitti/currentCueTRT', '01:02:03:12')
		await flush()
		expect(variablesSet(fake).currentCueTRT_total_seconds).toBe(3723)
		receive(api, '/mitti/currentCueTRT', '00:00:00:00')
		await flush()
		expect(variablesSet(fake).currentCueTRT_total_seconds).toBe(0)
	})

	test('malformed timecodes are ignored', async () => {
		receive(api, '/mitti/cueTimeLeft', 'junk')
		receive(api, '/mitti/cueTimeElapsed', '-00:00:01:00')
		await flush()

		expect(fake.setVariableValues).not.toHaveBeenCalled()
		expect(fake.states.timeRemaining).toBeUndefined()
	})

	test('clearing the current cue removes its timing and allows identical timing for the next cue', async () => {
		const timing = [
			['cueTimeLeft', '-00:00:04:00', 4],
			['cueTimeElapsed', '00:00:06:00', 6],
			['currentCueTRT', '00:00:10:00', 10],
		] as const
		receive(api, '/mitti/currentCueID', '1')
		for (const [name, timecode] of timing) receive(api, `/mitti/${name}`, timecode)
		await flush()
		expect(fake.states.timeRemaining).toBe(4)

		fake.checkFeedbacks.mockClear()
		receive(api, '/mitti/currentCueID', '-')
		receive(api, '/mitti/cueTimeLeft', '-')
		for (const [name, timecode] of timing) receive(api, `/mitti/${name}`, timecode)
		await flush()
		expect(fake.states.timeRemaining).toBeUndefined()
		expect(feedbacksChecked(fake)).toContain('timeRemaining')
		const cleared = variablesSet(fake)
		for (const [name] of timing) {
			for (const suffix of ['', '_hhmmss', '_h', '_m', '_s', '_total_seconds']) {
				expect(cleared).toHaveProperty(`${name}${suffix}`, undefined)
			}
		}

		receive(api, '/mitti/currentCueID', '2')
		for (const [name, timecode] of timing) receive(api, `/mitti/${name}`, timecode)
		await flush()
		for (const [name, , seconds] of timing) expect(variablesSet(fake)[`${name}_total_seconds`]).toBe(seconds)
		expect(fake.states.timeRemaining).toBe(4)
	})

	test('play state and outputs map to their variables', async () => {
		receive(api, '/mitti/togglePlay', 0)
		receive(api, '/mitti/toggleVideoOutputs', 1)
		receive(api, '/mitti/toggleAudio', 0)
		await flush()

		expect(variablesSet(fake)).toEqual({ playStatus: 'Paused', video_outputs: 'Active', audio_outputs: 'Off' })
		expect(fake.states).toMatchObject({ playing: 'Paused', videoOutputs: true, audioOutputs: false })
	})

	test('the current cue volume does not overwrite the current cue name', async () => {
		receive(api, '/mitti/currentCueVolume', -6.456)
		await flush()

		expect(variablesSet(fake)).toEqual({ currentCueVolume: -6.46 })
	})

	test('pong only updates the heartbeat', async () => {
		receive(api, '/mitti/pong')
		await flush()

		expect(api['connection'].lastPong).toBeTypeOf('number')
		expect(fake.setVariableValues).not.toHaveBeenCalled()
	})
})

describe('current cue messages', () => {
	test('what Mitti 2.8.19 reports for the current cue sets only defined variables', async () => {
		const reported: [string, string | number][] = [
			['brightness', 0],
			['contrast', 0],
			['cueName', 'Opening Film'],
			['hue', 0],
			['opacity', 1],
			['playbackSpeed', 100],
			['posX', 0],
			['posY', 0],
			['rotate', 0],
			['saturation', 0],
			['scale', 0],
			['scaleAsPercent', 100],
			['toggleAudio', 1],
			['toggleFadeIn', 0],
			['toggleFadeOut', 0],
			['toggleGoto', 0],
			['toggleLoop', 1],
			['togglePauseAtBeginning', 0],
			['togglePauseAtEnd', 0],
			['toggleTransition', 0],
			['vibrance', 0],
			['volume', 0.9],
			['volumeAsDecibels', 2.37],
		]
		for (const [param, value] of reported) receive(api, `/mitti/current/${param}`, value)
		await flush()

		expect(variablesSet(fake)).toEqual({
			currentCueAudio: 'Unmuted',
			currentCueFadeIn: 'Off',
			currentCueFadeOut: 'Off',
			currentCueGoto: 'Off',
			currentCueLoop: 'On',
			currentCuePauseAtBeginning: 'Off',
			currentCuePauseAtEnd: 'Off',
			currentCueTransition: 'Off',
			currentCuePlaybackSpeed: 100,
			currentCueVolume: 2.37,
		})
		const defined = Object.keys(getVariables(asInstance(fake)))
		for (const id of Object.keys(variablesSet(fake))) expect(defined, id).toContain(id)
		// The cue's other values are still kept for the actions and feedbacks
		expect(fake.cues.current).toMatchObject({ opacity: 1, scaleAsPercent: 100, cueName: 'Opening Film' })
	})

	test('toggles become On / Off, except audio which is Muted / Unmuted', async () => {
		receive(api, '/mitti/current/toggleTransition', 1)
		receive(api, '/mitti/current/toggleLoop', 0)
		receive(api, '/mitti/current/toggleAudio', 0)
		await flush()

		expect(variablesSet(fake)).toEqual({
			currentCueTransition: 'On',
			currentCueLoop: 'Off',
			currentCueAudio: 'Muted',
		})
	})

	test('toggles recheck the feedbacks that presets point at the current cue', async () => {
		receive(api, '/mitti/current/toggleLoop', 1)
		await flush()

		expect(fake.cues.current).toEqual({ toggleLoop: 1 })
		expect(feedbacksChecked(fake)).toEqual(['cueLoopStatus'])
	})

	test('volume is rounded and remembered for the adjust volume action', async () => {
		receive(api, '/mitti/current/volumeAsDecibels', -3.6811299324035645)
		await flush()

		expect(variablesSet(fake)).toEqual({ currentCueVolume: -3.68 })
		expect(fake.states.currentCueVolume).toBe(-3.6811299324035645)
	})

	test('playback speed is remembered for the adjust speed action', async () => {
		receive(api, '/mitti/current/playbackSpeed', 100)
		await flush()

		expect(variablesSet(fake)).toEqual({ currentCuePlaybackSpeed: 100 })
		expect(fake.states.currentCuePlaybackSpeed).toBe(100)
	})

	test.each([undefined, '', 'abc'])('a volume or speed of %j is forgotten rather than stored as NaN', (value) => {
		receive(api, '/mitti/current/volumeAsDecibels', -3)
		receive(api, '/mitti/current/playbackSpeed', 100)
		receive(api, '/mitti/currentCueVolume', -3)
		receive(api, '/mitti/current/volumeAsDecibels', value)
		receive(api, '/mitti/current/playbackSpeed', value)
		expect(fake.states.currentCueVolume).toBeUndefined()
		expect(fake.states.currentCuePlaybackSpeed).toBeUndefined()

		receive(api, '/mitti/currentCueVolume', value)
		expect(fake.states.currentCueVolume).toBeUndefined()
	})
})

describe('playlist cue messages', () => {
	test('a new cue is stored and schedules the per-cue definitions', () => {
		receive(api, '/mitti/67/cueName', 'TestMovie.mp4')

		expect(fake.cues['67']).toEqual({ cueName: 'TestMovie.mp4' })
		expect(fake.scheduleCueDefinitions).toHaveBeenCalledOnce()
	})

	test('renaming a known cue updates its variable', async () => {
		receive(api, '/mitti/67/cueName', 'Old')
		receive(api, '/mitti/67/cueName', 'New')
		await flush()

		expect(variablesSet(fake)).toEqual({ cue_67_cueName: 'New' })
	})

	test('a toggle rechecks the matching feedback', async () => {
		receive(api, '/mitti/67/toggleLoop', 1)
		receive(api, '/mitti/67/toggleAudio', 1)
		receive(api, '/mitti/67/brightness', 0)
		await flush()

		expect(fake.cues['67']).toEqual({ toggleLoop: 1, toggleAudio: 1, brightness: 0 })
		expect(feedbacksChecked(fake)).toEqual(['cueAudioStatus', 'cueLoopStatus'])
	})

	test('deleting a cue removes it and schedules the per-cue definitions', () => {
		receive(api, '/mitti/67/cueName', 'TestMovie.mp4')
		fake.scheduleCueDefinitions.mockClear()
		receive(api, '/mitti/67/deleted')

		expect(fake.cues['67']).toBeUndefined()
		expect(fake.scheduleCueDefinitions).toHaveBeenCalledOnce()
	})

	test('a repeated delete does not bring the cue back', () => {
		receive(api, '/mitti/67/cueName', 'TestMovie.mp4')
		receive(api, '/mitti/67/deleted')
		fake.scheduleCueDefinitions.mockClear()
		receive(api, '/mitti/67/deleted')

		expect(fake.cues['67']).toBeUndefined()
		expect(fake.scheduleCueDefinitions).not.toHaveBeenCalled()
	})

	test('deleting a cue rechecks the per-cue toggle feedbacks', async () => {
		receive(api, '/mitti/67/toggleLoop', 1)
		await flush()
		fake.checkFeedbacks.mockClear()
		receive(api, '/mitti/67/deleted')
		await flush()

		expect(feedbacksChecked(fake)).toContain('cueLoopStatus')
	})

	test('a rename pending when the cue is deleted is dropped', async () => {
		receive(api, '/mitti/67/cueName', 'Old')
		receive(api, '/mitti/67/cueName', 'New')
		receive(api, '/mitti/67/deleted')
		await flush()

		expect(fake.setVariableValues).not.toHaveBeenCalled()
	})

	test('a new cue reusing a deleted ID gets its name sent again', async () => {
		receive(api, '/mitti/67/cueName', 'Old')
		receive(api, '/mitti/67/cueName', 'Same')
		await flush()
		receive(api, '/mitti/67/deleted')
		receive(api, '/mitti/67/cueName', 'Other')
		receive(api, '/mitti/67/cueName', 'Same')
		fake.setVariableValues.mockClear()
		await flush()

		expect(variablesSet(fake)).toEqual({ cue_67_cueName: 'Same' })
	})

	test('cue 0 is never treated as a new playlist cue', () => {
		receive(api, '/mitti/0/cueName', 'Nothing')

		expect(fake.scheduleCueDefinitions).not.toHaveBeenCalled()
	})

	test('cue names from the network cannot reach Object.prototype', async () => {
		receive(api, '/mitti/__proto__/cueName', 'pwned')
		receive(api, '/mitti/67/constructor', 1)
		receive(api, '/mitti/67/toString', 1)
		await flush()

		expect(Object.hasOwn(fake.cues, '__proto__')).toBe(true)
		expect('cueName' in {}).toBe(false)
		expect(fake.checkFeedbacks).not.toHaveBeenCalled()
	})

	test('nested bundles are unpacked', async () => {
		api['processOSCBundle']({
			elements: [['/mitti/selectedCueID', '67'], { elements: [['/mitti/toggleVideoOutputs', 1]] }],
		})
		await flush()

		expect(variablesSet(fake)).toEqual({ selectedCueID: '67', video_outputs: 'Active' })
	})
})

describe('resync after a delete', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
		for (let id = 1; id <= 16; id++) receive(api, `/mitti/${id}/cueName`, `Cue ${id}`)
		fake.scheduleCueDefinitions.mockClear()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	const resends = () => fake.oscSend.mock.calls.filter(([, , address]) => address === '/mitti/resendOSCFeedback')

	// What Mitti 2.8.19 sends for a resendOSCFeedback once cue 15 of 16 is deleted: the renumbered cues, then the player state
	function replyWithCues(count: number) {
		for (let id = 1; id <= count; id++) receive(api, `/mitti/${id}/cueName`, id === 15 ? 'Cue 16' : `Cue ${id}`)
		receive(api, '/mitti/currentCueID', '1')
		receive(api, '/mitti/selectedCueID', '-')
	}

	test('deleting a cue drops the last ID once Mitti renumbers the rest', async () => {
		// Recorded from Mitti 2.8.19 when deleting cue 15: the later cue moves down and 16 is never mentioned again
		receive(api, '/mitti/15/deleted', 'Cue 15')
		receive(api, '/mitti/15/cueName', 'Cue 16')
		receive(api, '/mitti/selectedCueID', '-')
		expect(resends()).toHaveLength(0)

		vi.advanceTimersByTime(100)
		expect(resends()).toHaveLength(1)

		replyWithCues(15)
		await flush()

		expect(Object.keys(fake.cues)).not.toContain('16')
		expect(fake.cues['15']).toEqual({ cueName: 'Cue 16' })
		expect(fake.scheduleCueDefinitions).toHaveBeenCalled()
	})

	test('a burst of deletes asks for the playlist once', () => {
		for (let id = 1; id <= 16; id++) receive(api, `/mitti/1/deleted`, `Cue ${id}`)
		vi.advanceTimersByTime(100)

		expect(resends()).toHaveLength(1)
	})

	test('deleting every cue leaves none behind', () => {
		for (let id = 1; id <= 16; id++) receive(api, `/mitti/1/deleted`, `Cue ${id}`)
		vi.advanceTimersByTime(100)
		receive(api, '/mitti/currentCueID', '-')
		receive(api, '/mitti/selectedCueID', '-')

		expect(Object.keys(fake.cues)).toEqual([])
	})

	test('cues are kept when the resend never completes', () => {
		receive(api, '/mitti/15/deleted', 'Cue 15')
		vi.advanceTimersByTime(100 + 2000)
		receive(api, '/mitti/selectedCueID', '3')

		expect(Object.keys(fake.cues)).toHaveLength(15)
	})

	test('a selection change before the resend is requested does not end it', () => {
		receive(api, '/mitti/15/deleted', 'Cue 15')
		receive(api, '/mitti/selectedCueID', '3')
		vi.advanceTimersByTime(100)
		replyWithCues(15)

		expect(Object.keys(fake.cues)).toHaveLength(15)
		expect(Object.keys(fake.cues)).not.toContain('16')
	})

	test('a selection change after the resend is requested but before any cue arrives does not end it', () => {
		receive(api, '/mitti/15/deleted', 'Cue 15')
		vi.advanceTimersByTime(100)
		receive(api, '/mitti/selectedCueID', '3')
		expect(Object.keys(fake.cues)).toHaveLength(15)

		replyWithCues(15)
		expect(Object.keys(fake.cues)).toHaveLength(15)
		expect(Object.keys(fake.cues)).not.toContain('16')
	})
})

describe('batching', () => {
	test('a burst of messages becomes one call of each kind', async () => {
		for (let cue = 1; cue <= 100; cue++) {
			receive(api, `/mitti/${cue}/toggleLoop`, cue % 2)
			receive(api, `/mitti/${cue}/toggleAudio`, cue % 2)
		}
		receive(api, '/mitti/currentCueName', 'A')
		receive(api, '/mitti/selectedCueName', 'B')
		await flush()

		expect(fake.setVariableValues).toHaveBeenCalledOnce()
		expect(fake.checkFeedbacks).toHaveBeenCalledOnce()
	})

	test('a resend of unchanged values sends nothing', async () => {
		receive(api, '/mitti/currentCueName', 'A')
		receive(api, '/mitti/67/toggleLoop', 1)
		await flush()
		fake.setVariableValues.mockClear()
		fake.checkFeedbacks.mockClear()

		receive(api, '/mitti/currentCueName', 'A')
		receive(api, '/mitti/67/toggleLoop', 1)
		await flush()

		expect(fake.setVariableValues).not.toHaveBeenCalled()
		expect(fake.checkFeedbacks).not.toHaveBeenCalled()
	})

	test('frame-by-frame timecodes only update Companion when the seconds change', async () => {
		// Mitti sends playback timecodes about 30 times a second
		for (const frame of ['14', '13', '12', '11']) {
			receive(api, '/mitti/cueTimeLeft', `-00:03:54:${frame}`)
			await flush()
		}
		receive(api, '/mitti/cueTimeLeft', '-00:03:53:29')
		await flush()

		expect(fake.setVariableValues).toHaveBeenCalledTimes(2)
		expect(fake.checkFeedbacks).toHaveBeenCalledTimes(2)
		expect(fake.setVariableValues.mock.calls[1][0]).toEqual({
			cueTimeLeft: '-03:53',
			cueTimeLeft_hhmmss: '-00:03:53',
			cueTimeLeft_s: '53',
			cueTimeLeft_total_seconds: 233,
		})
	})
})

describe('sending commands', () => {
	test('commands go to Mitti on its fixed port', () => {
		api.sendCommand('play')

		expect(fake.oscSend).toHaveBeenCalledWith('10.0.0.2', 51000, '/mitti/play', [])
	})

	test('values are sent as strings unless an integer is requested', () => {
		api.sendValue('67/hueAsDegrees', 0, 's')
		api.sendValue('playCueAtIndex', 3, 'i')

		expect(fake.oscSend.mock.calls).toEqual([
			['10.0.0.2', 51000, '/mitti/67/hueAsDegrees', [{ type: 's', value: '0' }]],
			['10.0.0.2', 51000, '/mitti/playCueAtIndex', [{ type: 'i', value: 3 }]],
		])
	})

	test('an empty value sends the bare command', () => {
		api.sendValue('jumpToCueWithName', '', 's')

		expect(fake.oscSend).toHaveBeenCalledWith('10.0.0.2', 51000, '/mitti/jumpToCueWithName', [])
	})

	test('nothing is sent without a host', () => {
		const offline = createApi(fake, null)
		offline.sendCommand('play')
		offline.sendValue('playCueAtIndex', 3, 'i')

		expect(fake.oscSend).not.toHaveBeenCalled()
	})
})

describe('state refresh', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	test('disconnecting cancels a pending refresh', async () => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
		api.requestStateRefresh()
		await api.disconnect()
		vi.advanceTimersByTime(1000)
		expect(fake.oscSend).not.toHaveBeenCalled()
	})
})
