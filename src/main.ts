import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { getActions, type ActionsSchema } from './actions.js'
import { MittiApi, type CueState, type MittiState } from './api.js'
import { DEFAULT_FEEDBACK_PORT, getConfigFields, getMittiHost, isValidPort, type MittiConfig } from './config.js'
import { getFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { getPresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'
import { createRecord } from './utils.js'
import { getCueVariableValues, getVariables, type VariablesSchema } from './variables.js'

export { UpgradeScripts }

export type ModuleSchema = {
	config: MittiConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export default class MittiInstance extends InstanceBase<ModuleSchema> {
	config: MittiConfig = { feedbackPort: DEFAULT_FEEDBACK_PORT }
	cues: Record<string, CueState> = createRecord()
	private cueDefinitionsTimer: NodeJS.Timeout | null = null
	states: MittiState = {}
	api = new MittiApi(this)

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: MittiConfig): Promise<void> {
		this.initActions()
		await this.applyConfig(config)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	async configUpdated(config: MittiConfig): Promise<void> {
		await this.applyConfig(config)
	}

	async applyConfig(config: MittiConfig): Promise<void> {
		this.config = config
		this.api.host = getMittiHost(config)

		this.initVariables()
		this.initFeedbacks()
		this.initPresets()

		const configError = !this.api.host
			? 'Unable to determine IP Address'
			: !isValidPort(config.feedbackPort)
				? 'Invalid Feedback Port'
				: null

		if (configError) {
			await this.api.disconnect()
			this.updateStatus(InstanceStatus.BadConfig, configError)
		} else {
			this.updateStatus(InstanceStatus.Connecting)
			void this.initOSC()
		}
	}

	async destroy(): Promise<void> {
		if (this.cueDefinitionsTimer) clearTimeout(this.cueDefinitionsTimer)
		await this.api.disconnect()

		this.cues = createRecord()
	}

	initVariables(): void {
		this.setVariableDefinitions(getVariables(this))
		this.setVariableValues(getCueVariableValues(this))
	}

	initFeedbacks(): void {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}

	initPresets(): void {
		const { structure, presets } = getPresets(this)
		this.setPresetDefinitions(structure, presets)
	}

	// Loading or clearing a playlist reports every cue in a burst, so rebuild the per-cue definitions once
	scheduleCueDefinitions(): void {
		if (this.cueDefinitionsTimer) return
		this.cueDefinitionsTimer = setTimeout(() => {
			this.cueDefinitionsTimer = null
			this.initVariables()
			this.initPresets()
		}, 100)
	}

	initActions(): void {
		this.setActionDefinitions(getActions(this))
	}

	async initOSC(): Promise<void> {
		this.cues = createRecord()
		this.states = {}

		await this.api.connect()
	}
}
