import type {
	CompanionMigrationAction,
	CompanionMigrationOptionValues,
	CompanionStaticUpgradeProps,
} from '@companion-module/base'
import { describe, expect, test } from 'vitest'
import type { MittiConfig } from '../config.js'
import { UpgradeScripts } from '../upgrades.js'

const [, v3_2_0, , v3_9_0, v4_0_0] = UpgradeScripts

function action(actionId: string, options: CompanionMigrationOptionValues): CompanionMigrationAction {
	return { id: actionId, controlId: 'bank:1', actionId, options }
}

function props(
	config: Record<string, unknown> | null,
	actions: CompanionMigrationAction[] = [],
): CompanionStaticUpgradeProps<MittiConfig, undefined> {
	return { config: config as MittiConfig | null, secrets: null, actions, feedbacks: [] }
}

const context = { currentConfig: { feedbackPort: 51001 } }

// API 2.0 hands upgrade scripts every option wrapped as { isExpression, value }
const plain = (value: unknown) => ({ isExpression: false, value }) as CompanionMigrationOptionValues[string]

describe('v4.0.0', () => {
	test.each([
		['51001', 51001],
		['52000', 52000],
		['', 51001],
		['abc', 51001],
		['70000', 51001],
		[undefined, 51001],
	])('converts a stored feedback port of %j to %j', (stored, expected) => {
		const result = v4_0_0(context, props({ feedbackPort: stored }))

		expect(result.updatedConfig?.feedbackPort).toBe(expected)
	})

	test('leaves a numeric feedback port alone', () => {
		const result = v4_0_0(context, props({ feedbackPort: 52000 }))

		expect(result.updatedConfig).toBeNull()
	})

	test('converts the play cue at index option to a number or an expression', () => {
		const actions = [
			action('playCueIndex', { index: plain('5') }),
			action('playCueIndex', { index: plain('$(internal:x)') }),
			action('play', {}),
		]
		const result = v4_0_0(context, props(null, actions))

		expect(result.updatedActions.map((a) => a.options.index)).toEqual([
			{ isExpression: false, value: 5 },
			{ isExpression: true, value: '$(internal:x)' },
		])
	})
})

describe('older scripts write the wrapped option shape', () => {
	test('v3.2.0 adds the split scale options', () => {
		const result = v3_2_0(context, props(null, [action('scale', { cuenumber: plain('current') })]))

		expect(result.updatedActions[0].options).toMatchObject({
			splitScale: plain(false),
			valueH: plain(100),
			valueV: plain(100),
		})
	})

	test('v3.9.0 adds force cut only where it is missing', () => {
		const actions = [action('play_cue', {}), action('play_select', { forceCut: plain(true) })]
		const result = v3_9_0(context, props(null, actions))

		expect(result.updatedActions).toHaveLength(1)
		expect(result.updatedActions[0].options.forceCut).toEqual(plain(false))
	})
})
