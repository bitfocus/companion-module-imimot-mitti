import { expect, test, vi } from 'vitest'
import MittiInstance from '../main.js'
import { asInstance, createApi, createFakeInstance, presetVariants } from './helpers.js'

test('startup registers every preset dependency before publishing presets', async () => {
	const fake = createFakeInstance()
	// Exercise the real lifecycle methods with Companion calls and networking mocked.
	Object.setPrototypeOf(fake, MittiInstance.prototype)
	const self = asInstance(fake)
	self.api = createApi(fake)
	vi.spyOn(self, 'initOSC').mockResolvedValue()
	const actions = vi.spyOn(self, 'setActionDefinitions').mockImplementation(() => {})
	const feedbacks = vi.spyOn(self, 'setFeedbackDefinitions').mockImplementation(() => {})
	const variables = vi.spyOn(self, 'setVariableDefinitions').mockImplementation(() => {})
	const presets = vi.spyOn(self, 'setPresetDefinitions').mockImplementation((_structure, definitions) => {
		expect(variables).toHaveBeenCalled()
		const registeredActions = actions.mock.lastCall?.[0] ?? {}
		const registeredFeedbacks = feedbacks.mock.lastCall?.[0] ?? {}
		for (const preset of Object.values(definitions).flatMap(presetVariants)) {
			for (const step of preset.steps) {
				for (const entry of [...step.down, ...step.up, ...(step.rotate_left ?? []), ...(step.rotate_right ?? [])]) {
					expect(registeredActions, preset.name).toHaveProperty([entry.actionId])
				}
			}
			for (const feedback of preset.feedbacks) {
				expect(registeredFeedbacks, preset.name).toHaveProperty([feedback.feedbackId])
			}
		}
	})

	await self.init({ host: '10.0.0.2', feedbackPort: 51001 })

	expect(presets).toHaveBeenCalledOnce()
})
