import { vi, type Mock } from 'vitest'
import type { CompanionPresetDefinition, CompanionSomePresetDefinition } from '@companion-module/base'
import type { ModuleSchema } from '../main.js'
import { MittiApi, type CueState, type MittiState } from '../api.js'
import { DEFAULT_FEEDBACK_PORT, type MittiConfig } from '../config.js'
import type MittiInstance from '../main.js'
import { createRecord } from '../utils.js'

// The parts of MittiInstance that the API and the definition builders touch, with the Companion calls mocked
export interface FakeInstance {
	config: MittiConfig
	cues: Record<string, CueState>
	states: MittiState
	setVariableValues: Mock
	checkFeedbacks: Mock
	scheduleCueDefinitions: Mock
	oscSend: Mock
	log: Mock
	updateStatus: Mock
}

export function createFakeInstance(): FakeInstance {
	return {
		config: { feedbackPort: DEFAULT_FEEDBACK_PORT, feedbackAlert: false },
		cues: createRecord<CueState>(),
		states: {},
		setVariableValues: vi.fn(),
		checkFeedbacks: vi.fn(),
		scheduleCueDefinitions: vi.fn(),
		oscSend: vi.fn(),
		log: vi.fn(),
		updateStatus: vi.fn(),
	}
}

export function asInstance(fake: FakeInstance): MittiInstance {
	return fake as unknown as MittiInstance
}

export function createApi(fake: FakeInstance, host: string | null = '10.0.0.2'): MittiApi {
	const api = new MittiApi(asInstance(fake))
	api.host = host
	return api
}

// Feeds one decoded OSC message, as node-osc's Server emits it, through the API's message routing
export function receive(api: MittiApi, address: string, value?: string | number): void {
	api['processOSCMessage'](value === undefined ? [address] : [address, value])
}

// Updates to Companion are batched until the next tick
export async function flush(): Promise<void> {
	await new Promise((resolve) => setImmediate(resolve))
}

// Merges every setVariableValues call into the final value of each variable
export function variablesSet(fake: FakeInstance): Record<string, unknown> {
	return Object.assign({}, ...fake.setVariableValues.mock.calls.map(([values]) => values as object)) as Record<
		string,
		unknown
	>
}

export function feedbacksChecked(fake: FakeInstance): string[] {
	return [...new Set(fake.checkFeedbacks.mock.calls.flat() as string[])].sort()
}

// Validate every host variant, including the simple fallback.
export function presetVariants(
	preset: CompanionSomePresetDefinition<ModuleSchema> | undefined,
): CompanionPresetDefinition<ModuleSchema>[] {
	if (!preset) throw new Error('Missing preset')
	return preset.type === 'alternatives' ? preset.variants : [preset]
}
