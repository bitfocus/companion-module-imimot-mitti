import type { SomeButtonGraphicsElement } from '@companion-module/base'
import { describe, expect, test } from 'vitest'
import { getFeedbacks } from '../feedbacks.js'
import { getPresets } from '../presets.js'
import { getVariables } from '../variables.js'
import {
	ColorGold,
	ColorGreen,
	ColorMuted,
	ColorOrange,
	ColorRed,
	ColorRedDim,
	ColorSurface,
	ColorWhite,
	MittiBlue,
	MittiGray,
} from '../utils.js'
import { asInstance, createFakeInstance, presetVariants } from './helpers.js'

const fake = createFakeInstance()
fake.cues['1'] = { cueName: 'Opening Film' }
const self = asInstance(fake)
const { presets } = getPresets(self)

function elementsIn(elements: SomeButtonGraphicsElement<undefined>[]): SomeButtonGraphicsElement<undefined>[] {
	return elements.flatMap((element) => [element, ...('children' in element ? elementsIn(element.children) : [])])
}

describe('layered presets', () => {
	test('every fallback preserves the same actions, feedback conditions, and live variables', () => {
		for (const preset of Object.values(presets)) {
			const [layered, simple] = presetVariants(preset)
			if (layered?.type !== 'layered' || simple?.type !== 'simple') throw new Error('Missing preset variant')
			expect(layered.steps, layered.name).toEqual(simple.steps)
			const condition = ({
				feedbackId,
				options,
				isInverted,
			}: Pick<(typeof layered.feedbacks)[number], 'feedbackId' | 'options' | 'isInverted'>) => ({
				feedbackId,
				options,
				isInverted,
			})
			expect(layered.feedbacks.map(condition), layered.name).toEqual(simple.feedbacks.map(condition))
			const templates = elementsIn(layered.elements)
				.filter((element) => 'text' in element)
				.map((element) => (typeof element.text === 'string' ? element.text : element.text.value))
				.join('\n')
			// The layered text repeats each variable inside its placeholder expression, so compare the distinct variables
			const variables = (text: string) => [...new Set(text.match(/\$\([^)]+\)/g))]
			expect(variables(templates), layered.name).toEqual(variables(simple.style.text))
		}
	})

	test('all feedback overrides target real elements with unique ids and no state accent bars', () => {
		for (const preset of Object.values(presets).flatMap(presetVariants)) {
			if (preset.type !== 'layered') continue
			const elements = elementsIn(preset.elements)
			const ids = elements.map((element) => element.id).filter((id) => id !== undefined)
			expect(new Set(ids).size, preset.name).toBe(ids.length)
			expect(ids, preset.name).not.toContain('accent')
			for (const feedback of preset.feedbacks) {
				for (const override of feedback.styleOverrides) {
					const target = elements.find((element) => element.id === override.elementId)
					expect(target, preset.name).toHaveProperty(override.elementProperty)
					expect(override.override, preset.name).toMatchObject({ isExpression: false })
				}
			}
		}
	})

	test('all live labels and progress expressions use defined variables', () => {
		const variables = getVariables(self)
		for (const preset of Object.values(presets)) {
			for (const match of JSON.stringify(preset).matchAll(/\$\(mitti:([^)]*)\)/g)) {
				expect(variables).toHaveProperty(match[1])
			}
		}
	})
})

// Stands in for Companion parsing `$(mitti:…)` in options, for the variables that mirror a state
function parsedOptions(options: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(options).map(([key, value]) => [
			key,
			typeof value === 'string'
				? value.replace(/\$\(mitti:([^)]+)\)/g, (_, name: string) =>
						String(fake.states[name as keyof typeof fake.states] ?? ''),
					)
				: value,
		]),
	)
}

async function resolvedStyle(id: string) {
	const simple = presetVariants(presets[id]).find((preset) => preset.type === 'simple')
	if (!simple || simple.type !== 'simple') throw new Error('Missing fallback')
	const definitions = getFeedbacks(self)
	const style = { ...simple.style }
	for (const feedback of simple.feedbacks) {
		if (!(feedback.feedbackId in definitions)) throw new Error('Unknown feedback')
		const definition = definitions[feedback.feedbackId as keyof typeof definitions]
		if (!definition) throw new Error('Missing feedback definition')
		// These callbacks only read options; no host callback context or networking is required.
		const active: unknown = await Reflect.apply(definition.callback, undefined, [
			{ options: parsedOptions(feedback.options) },
		])
		if (Boolean(active) !== Boolean(feedback.isInverted)) Object.assign(style, feedback.style)
	}
	return style
}

async function resolvedBackground(id: string): Promise<number> {
	return (await resolvedStyle(id)).bgcolor
}

async function resolvedElements(id: string) {
	const layered = presetVariants(presets[id])[0]
	if (layered?.type !== 'layered') throw new Error('Missing layered cue preset')
	const elements = structuredClone(elementsIn(layered.elements))
	const definitions = getFeedbacks(self)
	for (const feedback of layered.feedbacks) {
		const definition = definitions[feedback.feedbackId as keyof typeof definitions]
		if (!definition) throw new Error('Unknown feedback')
		const active: unknown = await Reflect.apply(definition.callback, undefined, [
			{ options: parsedOptions(feedback.options) },
		])
		if (Boolean(active) === Boolean(feedback.isInverted)) continue
		for (const override of feedback.styleOverrides) {
			const element = elements.find((element) => element.id === override.elementId)
			if (!element) throw new Error('Unknown target element')
			const value = override.override
			if (!value || typeof value !== 'object' || !('isExpression' in value) || value.isExpression !== false)
				throw new Error('Expected a wrapped literal override')
			Object.assign(element, { [override.elementProperty]: value.value })
		}
	}
	return elements
}

describe('preset state priority', () => {
	test.each([
		['Playing', '1', '1', ColorGreen, ColorGreen],
		['Playing', '1', '2', ColorGreen, ColorSurface],
		['Paused', '1', '1', ColorSurface, ColorSurface],
		[undefined, undefined, undefined, ColorSurface, ColorSurface],
		['Playing', '1', undefined, ColorGreen, ColorSurface],
		['Playing', '', '', ColorGreen, ColorSurface],
	] as const)(
		'Play indicators match playback %s, current cue %s and selected cue %s',
		async (playing, currentCueID, selectedCueID, playlistColor, selectedColor) => {
			fake.states = { playing, currentCueID, selectedCueID }
			for (const [ids, color] of [
				[['playPlaylist', 'playPlaylistText'], playlistColor],
				[['playSelected', 'playSelectedText', 'selectedCueStatus'], selectedColor],
			] as const) {
				for (const id of ids) {
					expect(await resolvedBackground(id), id).toBe(color)
					expect(
						(await resolvedElements(id)).find((element) => element.id === 'surface'),
						id,
					).toMatchObject({ color })
				}
			}
		},
	)

	test('unknown output and cue toggle states show status buttons as Off and leave On / Off buttons plain', async () => {
		fake.states = {}
		fake.cues.current = {}
		for (const [id, color] of [
			['videoOutputsOn', ColorSurface],
			['videoOutputsOff', ColorSurface],
			['videoOutputsActive', MittiGray],
			['audioOutputsOn', ColorSurface],
			['audioOutputsOff', ColorSurface],
			['audioOutputsActive', MittiGray],
			['loopOn', ColorSurface],
			['loopOff', ColorSurface],
			['toggleLoop', MittiGray],
			['audioOn', ColorSurface],
			['audioOff', ColorSurface],
		] as const) {
			expect(await resolvedStyle(id), id).toMatchObject({ bgcolor: color, color: ColorWhite })
			const elements = await resolvedElements(id)
			expect(
				elements.find((element) => element.id === 'surface'),
				id,
			).toMatchObject({ color })
		}
	})

	test.each([
		[0, MittiGray],
		[1, MittiBlue],
	])('only the cue playback status button changes color for loop state %s', async (toggleLoop, background) => {
		fake.cues.current = { toggleLoop }
		for (const [id, color] of [
			['toggleLoop', background],
			['loopOn', ColorSurface],
			['loopOff', ColorSurface],
		] as const) {
			expect(await resolvedStyle(id)).toMatchObject({ bgcolor: color, color: ColorWhite })
			expect((await resolvedElements(id)).find((element) => element.id === 'surface')).toMatchObject({ color })
		}
	})

	test('cue audio controls use Mute and Unmute and omit the repeated toggle caption', () => {
		const variant = (id: string) => presetVariants(presets[id])[0]
		expect(variant('audioOn').name).toBe('Unmute Cue Audio')
		expect(variant('audioOff').name).toBe('Mute Cue Audio')
		const toggle = variant('toggleAudio')
		if (toggle.type !== 'layered') throw new Error('Missing layered preset')
		const elements = elementsIn(toggle.elements)
		expect(elements.find((element) => element.id === 'label')).toMatchObject({ text: 'CUE AUDIO' })
		expect(elements.find((element) => element.id === 'hint')).toBeUndefined()
	})

	test.each([
		['Playing', 'PAUSE', ColorGreen, true, false, false],
		['Paused', 'RESUME', ColorGold, false, true, false],
		[undefined, 'PAUSE / RESUME', ColorSurface, false, false, true],
	] as const)(
		'Pause / Resume reflects %s in text and symbol visibility',
		async (playing, label, background, pause, resume, unknown) => {
			fake.states = { playing }
			for (const id of ['pauseResume', 'pauseResumeText']) {
				expect(await resolvedStyle(id)).toMatchObject({ text: `TRANSPORT\n${label}`, bgcolor: background })
				const elements = await resolvedElements(id)
				expect(elements.find((element) => element.id === 'surface')).toMatchObject({ color: background })
				expect(elements.find((element) => element.id === 'value')).toMatchObject({ text: label })
				if (id === 'pauseResume') {
					expect(elements.find((element) => element.id === 'pauseSymbol')).toMatchObject({ enabled: pause })
					expect(elements.find((element) => element.id === 'resumeSymbol')).toMatchObject({ enabled: resume })
					expect(elements.find((element) => element.id === 'unknownSymbol')).toMatchObject({ enabled: unknown })
				}
			}
		},
	)

	test.each([
		[undefined, MittiGray],
		[0, MittiGray],
		[1, MittiBlue],
	] as const)('only Cue Audio status reflects mute state %s', async (toggleAudio, background) => {
		fake.cues.current = { toggleAudio }
		const audioStatus = await resolvedStyle('toggleAudio')
		expect(audioStatus).toMatchObject({ bgcolor: background, color: ColorWhite })
		expect(audioStatus.text).toContain('$(mitti:currentCueAudio)')
		expect(await resolvedBackground('audioOn')).toBe(ColorSurface)
		expect(await resolvedBackground('audioOff')).toBe(ColorSurface)
		expect((await resolvedElements('toggleAudio')).find((element) => element.id === 'surface')).toMatchObject({
			color: background,
		})
		for (const id of ['currentCueVolumeStatus', 'currentCueVolumeRotary']) {
			const style = await resolvedStyle(id)
			expect(style).toMatchObject({ bgcolor: ColorSurface, color: ColorWhite })
			expect(style.text).toContain('$(mitti:currentCueVolume)')
			expect(style.text).not.toContain('$(mitti:currentCueAudio)')
			expect((await resolvedElements(id)).find((element) => element.id === 'surface')).toMatchObject({
				color: ColorSurface,
			})
		}
	})

	test('selected-cue playback and resets have explicit targets and values', () => {
		const actions = (id: string) => presetVariants(presets[id])[0].steps[0].down
		expect(actions('selectedCueStatus')).toEqual([{ actionId: 'play_select', options: { forceCut: false } }])
		expect(actions('currentCuePlaybackReset')).toEqual([
			{ actionId: 'playbackSpeed', options: { cuenumber: 'current', value: 100 } },
		])
		expect(actions('currentCueVolumeReset')).toEqual([
			{ actionId: 'volume', options: { cuenumber: 'current', value: 0 } },
		])
	})

	test.each([
		[undefined, ColorSurface],
		[11, ColorSurface],
		[10, ColorOrange],
		[6, ColorOrange],
		[5, ColorRed],
		[4, ColorRed],
		[3, ColorRed],
		[2, ColorRed],
		[1, ColorRedDim],
		[0, ColorRed],
	])('time remaining %s keeps the timer legible with background %s', async (time, color) => {
		fake.states = { timeRemaining: time }
		expect(await resolvedBackground('currentCueTimeRemaining')).toBe(color)
	})

	test.each(['videoOutputs', 'audioOutputs'] as const)(
		'only the %s status button uses blue or gray',
		async (output) => {
			for (const [enabled, background] of [
				[true, MittiBlue],
				[false, MittiGray],
			] as const) {
				fake.states = { [output]: enabled }
				for (const [suffix, color] of [
					['Active', background],
					['On', ColorSurface],
					['Off', ColorSurface],
				] as const) {
					const id = `${output}${suffix}`
					expect(await resolvedStyle(id)).toMatchObject({ bgcolor: color, color: ColorWhite })
					expect((await resolvedElements(id)).find((element) => element.id === 'surface')).toMatchObject({ color })
				}
			}
		},
	)

	test.each([
		['selected while another cue plays', '1', '2', 'Playing', MittiGray, ColorWhite],
		['active and paused', '2', '1', 'Paused', MittiBlue, ColorWhite],
		['playing', '2', '1', 'Playing', ColorGreen, ColorWhite],
		['selected and playing', '1', '1', 'Playing', ColorGreen, ColorWhite],
		['selected and active while paused', '1', '1', 'Paused', MittiBlue, ColorWhite],
		['idle', '2', '2', 'Paused', ColorSurface, ColorMuted],
	] as const)(
		'both cue preset variants use the state background when %s',
		async (_, selectedCueID, currentCueID, playing, background, labelColor) => {
			fake.states = { selectedCueID, currentCueID, playing }
			expect(await resolvedStyle('playCueID_1')).toMatchObject({ bgcolor: background, color: ColorWhite })
			const elements = await resolvedElements('playCueID_1')
			expect(elements.find((element) => element.id === 'selection')).toBeUndefined()
			expect(elements.find((element) => element.id === 'label')).toMatchObject({ color: labelColor })
			expect(elements.find((element) => element.id === 'value')).toMatchObject({ color: ColorWhite })
			expect(elements.find((element) => element.id === 'surface')).toMatchObject({ color: background })
		},
	)
})
