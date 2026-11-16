import { describe, expect, test } from 'vitest'
import { getActions } from '../actions.js'
import { getFeedbacks } from '../feedbacks.js'
import { getPresets, PresetTextSizes } from '../presets.js'
import { ColorWhite } from '../utils.js'
import { getCueVariableValues, getVariables } from '../variables.js'
import { asInstance, createApi, createFakeInstance, presetVariants } from './helpers.js'

function withPlaylist() {
	const fake = createFakeInstance()
	for (const id of ['current', 'previous', 'next', '0', '1', 'AB12', '99']) fake.cues[id] = {}
	fake.cues['1'].cueName = 'Intro'
	fake.cues['AB12'].cueName = 'Outro'
	// A nameless entry, as left behind by stray updates for a deleted cue
	fake.cues['99'].toggleLoop = 1
	return fake
}

describe('presets', () => {
	const self = asInstance(withPlaylist())
	const { structure, presets } = getPresets(self)
	const actions = getActions(self)
	const feedbacks = getFeedbacks(self)
	const referenced = structure.flatMap((section) =>
		section.definitions.flatMap((definition) => {
			if (typeof definition === 'string') return [definition]
			return definition.type === 'simple' ? definition.presets : []
		}),
	)

	test('every preset appears in the structure exactly once', () => {
		expect([...referenced].sort()).toEqual(Object.keys(presets).sort())
	})

	test('presets only use actions and feedbacks that exist', () => {
		for (const preset of Object.values(presets).flatMap(presetVariants)) {
			for (const step of preset.steps) {
				for (const entry of [...step.down, ...step.up, ...(step.rotate_left ?? []), ...(step.rotate_right ?? [])]) {
					expect(actions, preset.name).toHaveProperty([entry.actionId])
				}
			}
			for (const feedback of preset.feedbacks) {
				expect(feedbacks, preset.name).toHaveProperty([feedback.feedbackId])
			}
		}
	})

	test('every preset follows the shared text style', () => {
		const sizes: unknown[] = Object.values(PresetTextSizes)
		for (const preset of Object.values(presets).flatMap(presetVariants)) {
			if (preset.type !== 'simple') continue
			const { text, size, color } = preset.style

			expect(sizes, preset.name).toContain(size)
			expect(color, preset.name).toBe(ColorWhite)
			expect(text.split('\n').length, preset.name).toBeLessThanOrEqual(3)
			if (!preset.style.textExpression) expect(text, preset.name).not.toContain('\\n')
		}
	})

	test('attaches cue playback and output state feedback to status toggles only', () => {
		const feedbackOf = (id: string) => {
			const preset = presetVariants(presets[id]).find((variant) => variant.type === 'simple')
			if (preset?.type !== 'simple') throw new Error(`No simple preset ${id}`)
			return preset.feedbacks.map(({ feedbackId, options, isInverted }) => ({ feedbackId, options, isInverted }))
		}

		expect(feedbackOf('toggleLoop')).toEqual([
			{ feedbackId: 'cueLoopStatus', options: { cueID: 'current' }, isInverted: false },
			{ feedbackId: 'cueLoopStatus', options: { cueID: 'current' }, isInverted: true },
		])
		expect(feedbackOf('loopOn')).toEqual([])
		expect(feedbackOf('loopOff')).toEqual([])
		for (const id of ['videoOutputs', 'audioOutputs']) {
			const on = { feedbackId: id, options: {}, isInverted: false }
			const off = { feedbackId: id, options: {}, isInverted: true }
			expect(feedbackOf(`${id}Active`)).toEqual([on, off])
			expect(feedbackOf(`${id}On`)).toEqual([])
			expect(feedbackOf(`${id}Off`)).toEqual([])
		}
		expect(feedbackOf('fullscreenOn')).toEqual([])
	})

	test('Cue Targets lists ready-to-use playlist cues before configurable presets', () => {
		expect(structure.map((s) => s.name)).toEqual([
			'Transport Control',
			'Cue Status',
			'Current Cue Settings',
			'Cue Targets',
			'Playlist Settings',
			'Outputs',
		])
		expect(structure[3].definitions).toMatchObject([
			{ id: 'playCueById', name: 'Play Cue by ID', presets: ['playCueID_1', 'playCueID_AB12'] },
			{ id: 'configureCueTarget', name: 'Configure a Cue Target' },
		])
		const empty = getPresets(asInstance(createFakeInstance()))
		expect(empty.structure[3]).toMatchObject({
			name: 'Cue Targets',
			definitions: [{ id: 'configureCueTarget' }],
		})
	})

	test('configurable cue presets share a blank local target between the display and action', () => {
		const section = structure.find((s) => s.id === 'cueActions')
		const group = section?.definitions.find(
			(definition) => typeof definition !== 'string' && definition.id === 'configureCueTarget',
		)
		if (!group || typeof group === 'string' || group.type !== 'simple')
			throw new Error('Missing Configure a Cue Target group')
		expect(group.description).toContain('Current Value field for cue_target')
		expect(group.presets).toHaveLength(5)
		for (const id of group.presets) {
			for (const variant of presetVariants(presets[id])) {
				expect(variant.localVariables).toEqual([
					{ variableType: 'simple', variableName: 'cue_target', startupValue: '' },
				])
				const [action] = variant.steps[0].down
				expect(Object.values(action.options)).toContainEqual({ isExpression: true, value: '$(local:cue_target)' })
				const display = JSON.stringify(variant.type === 'layered' ? variant.elements : variant.style)
				expect(display).toContain('$(local:cue_target)')
				expect(display).toContain('SET TARGET')
			}
		}
	})
})

describe('feedbacks', () => {
	test.each(['playingCueID', 'activeCueID', 'selectedCueID'] as const)(
		'%s never matches an empty cue ID, even when the cue has none',
		async (feedbackId) => {
			const fake = createFakeInstance()
			fake.states = { playing: 'Playing', currentCueID: '', selectedCueID: '' }
			const definition = getFeedbacks(asInstance(fake))[feedbackId]
			if (!definition) throw new Error('Missing feedback definition')
			for (const cueID of ['', '-']) {
				const matched: unknown = await Reflect.apply(definition.callback, undefined, [{ options: { cueID } }])
				expect(matched, cueID).toBe(false)
			}
			fake.states = { playing: 'Playing', currentCueID: 'A1', selectedCueID: 'A1' }
			const matched: unknown = await Reflect.apply(definition.callback, undefined, [{ options: { cueID: 'a1' } }])
			expect(matched).toBe(true)
		},
	)
})

describe('variables', () => {
	test('each playlist cue gets a name variable with its current value', () => {
		const self = asInstance(withPlaylist())

		expect(Object.keys(getVariables(self)).filter((id) => id.startsWith('cue_'))).toEqual([
			'cue_1_cueName',
			'cue_AB12_cueName',
		])
		expect(getCueVariableValues(self)).toEqual({ cue_1_cueName: 'Intro', cue_AB12_cueName: 'Outro' })
	})
})

describe('actions', () => {
	function run(actionId: string, options: Record<string, unknown>) {
		const fake = createFakeInstance()
		const self = asInstance(fake)
		self.api = createApi(fake)
		const definition = getActions(self)[actionId as keyof ReturnType<typeof getActions>]
		if (!definition) throw new Error(`No action ${actionId}`)
		void (definition.callback as (event: { options: Record<string, unknown> }) => void)({ options })
		return fake
	}

	test('cue actions target the conformed cue ID', () => {
		const fake = run('audioOn', { cuenumber: 'ab12' })

		expect(fake.oscSend).toHaveBeenCalledWith('10.0.0.2', 51000, '/mitti/AB12/audioOn', [])
	})

	test.each([
		['play_cue', 'cuenumber', '/mitti/playCueWithCueID'],
		['jump_cue', 'cuenumber', '/mitti/AB12/jump'],
		['select_cue', 'cuenumber', '/mitti/AB12/select'],
		['playCueName', 'string', '/mitti/playCueWithName'],
		['jumpCueName', 'string', '/mitti/jumpToCueWithName'],
	])('%s requires a nonblank cue target', (actionId, field, address) => {
		expect(run(actionId, { [field]: '' }).oscSend).not.toHaveBeenCalled()
		expect(run(actionId, { [field]: '   ' }).oscSend).not.toHaveBeenCalled()
		const value = field === 'cuenumber' ? 'ab12' : 'Opening Film'
		const fake = run(actionId, { [field]: value, forceCut: false })
		expect(fake.oscSend).toHaveBeenCalledOnce()
		expect(fake.oscSend.mock.calls[0][2]).toBe(address)
	})

	test('cue value actions send the value', () => {
		const fake = run('opacity', { cuenumber: 'current', value: 50 })

		expect(fake.oscSend).toHaveBeenCalledWith('10.0.0.2', 51000, '/mitti/current/opacityAsPercent', [
			{ type: 's', value: '50' },
		])
	})

	test('position and crop send only the fields that have a value', () => {
		const sent = (fake: ReturnType<typeof run>) => fake.oscSend.mock.calls.map(([, , address, args]) => [address, args])

		expect(sent(run('position', { cuenumber: 'ab12', valueX: '10', valueY: '' }))).toEqual([
			['/mitti/AB12/posXAsPixels', [{ type: 's', value: '10' }]],
		])
		expect(
			sent(run('crop', { cuenumber: 'current', valueLeft: '5', valueRight: '', valueTop: '0', valueBottom: '7' })),
		).toEqual([
			['/mitti/current/cropLeftAsPixels', [{ type: 's', value: '5' }]],
			['/mitti/current/cropTopAsPixels', [{ type: 's', value: '0' }]],
			['/mitti/current/cropBottomAsPixels', [{ type: 's', value: '7' }]],
		])
	})

	test('play cue at index sends an integer, or warns when out of range', () => {
		expect(run('playCueIndex', { index: 3, forceCut: false }).oscSend).toHaveBeenCalledWith(
			'10.0.0.2',
			51000,
			'/mitti/playCueAtIndex',
			[{ type: 'i', value: 3 }],
		)

		const outOfRange = run('playCueIndex', { index: 1000, forceCut: false })
		expect(outOfRange.oscSend).not.toHaveBeenCalled()
		expect(outOfRange.log).toHaveBeenCalledWith('warn', expect.any(String))
	})
})
