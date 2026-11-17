import { isIPv4 } from 'node:net'
import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type MittiConfig = {
	bonjourHost?: string | null
	host?: string
	feedbackPort: number
	feedbackAlert?: boolean
}

export const DEFAULT_FEEDBACK_PORT = 51001

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'bonjour-device',
			id: 'bonjourHost',
			label: 'Mitti Connection',
			tooltip:
				'This dropdown attempts to discover active Mitti instances on the network. You can also select "Manual" to enter a custom IP address.',
			width: 10,
		},
		{
			type: 'static-text',
			id: 'hostFiller',
			width: 10,
			label: '',
			isVisibleExpression: `!!$(options:bonjourHost)`,
			value: '',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			tooltip: 'The IP address of the computer running Mitti',
			default: '127.0.0.1',
			width: 10,
			regex: Regex.IP,
			isVisibleExpression: `!$(options:bonjourHost)`,
		},
		{
			type: 'number',
			id: 'feedbackPort',
			label: 'Feedback Port',
			width: 4,
			tooltip: 'The port designated for Feedback in the OSC/UDP Controls tab in Mitti',
			default: DEFAULT_FEEDBACK_PORT,
			min: 1,
			max: 65535,
		},
		{
			type: 'checkbox',
			id: 'feedbackAlert',
			label: 'Feedback Alert',
			width: 12,
			tooltip:
				'If enabled, the module status will change to "Error" if not receiving responses from Mitti. Disable if you wish to use the module without feedback.',
			default: true,
		},
	]
}

// A discovered Mitti is reported as `ip:port`; Mitti always takes commands on its fixed port, so only the IP is used
export function getMittiHost(config: MittiConfig): string | null {
	const host = config.bonjourHost ? config.bonjourHost.split(':')[0] : config.host
	return host && isIPv4(host) ? host : null
}

export function isValidPort(port: unknown): port is number {
	return typeof port === 'number' && Number.isInteger(port) && port >= 1 && port <= 65535
}
