import { createSocket, type RemoteInfo } from 'node:dgram'
import { InstanceStatus, type CompanionVariableValue } from '@companion-module/base'
import { Bonjour, type Service } from '@julusian/bonjour-service'
import { Server } from 'node-osc'
import { CueToggleFeedbackIds, type FeedbacksSchema } from './feedbacks.js'
import type MittiInstance from './main.js'
import { createRecord, playlistCueIDs } from './utils.js'
import type { VariablesSchema } from './variables.js'

// Mitti always listens for OSC commands on this port
const MITTI_OSC_PORT = 51000

// Time for the rest of a delete burst to arrive before asking for the playlist again
const CUE_RESYNC_DELAY = 100
// Give up on a resend that never completes, leaving the cues as they are
const CUE_RESYNC_TIMEOUT = 2000

export type OscValue = string | number

export type CueState = Partial<Record<string, OscValue>>

export interface MittiState {
	currentCueName?: OscValue
	currentCueID?: OscValue
	selectedCueName?: OscValue
	selectedCueID?: OscValue
	playing?: 'Playing' | 'Paused'
	playhead?: number
	timeRemaining?: number
	videoOutputs?: boolean
	audioOutputs?: boolean
	inFromPlayheadEnabled?: boolean
	outFromPlayheadEnabled?: boolean
	currentCueVolume?: number
	currentCueAudioMuted?: boolean
	currentCuePlaybackSpeed?: number
}

type FeedbackId = keyof FeedbacksSchema & string

type OscMessage = [string, ...unknown[]]
type OscBundle = { elements: (OscMessage | OscBundle)[] }

interface ConnectionState {
	connected: boolean | null
	testService: NodeJS.Timeout | null
	testTimeout: NodeJS.Timeout | null
	lastPong: number | null
	bonjour: Bonjour | null
	bonjourService: Service | null
}

// Mitti sends '-' when there is no cue to report
function displayValue(value: OscValue | undefined): OscValue | undefined {
	return value != '-' ? value : 'None'
}

function isEmptyCueID(value: OscValue | undefined): boolean {
	return value === '-' || value === undefined || value === ''
}

function roundVolume(value: OscValue | undefined): number {
	return Math.round(Number(value) * 100) / 100
}

interface Timecode {
	sign: string
	hh: string
	mm: string
	ss: string
}

const CueTimeVariables = ['cueTimeLeft', 'cueTimeElapsed', 'currentCueTRT'] as const

const TIMECODE_PATTERNS = {
	'': /^(\d\d):(\d\d):(\d\d)/,
	'-': /^-(\d\d):(\d\d):(\d\d)/,
}

// Mitti reports times as `HH:MM:SS`, with a leading '-' for time remaining
function parseTimecode(value: OscValue | undefined, sign: '' | '-'): Timecode | null {
	const match = String(value).match(TIMECODE_PATTERNS[sign])
	if (!match) return null
	const [, hh, mm, ss] = match
	return { sign, hh, mm, ss }
}

// The short form drops the hours when they are zero
function timecodeVariables(name: (typeof CueTimeVariables)[number], time: Timecode | null): Partial<VariablesSchema> {
	const { sign, hh, mm, ss } = time ?? {}
	return {
		[name]: time ? `${sign}${hh === '00' ? '' : hh + ':'}${mm}:${ss}` : undefined,
		[`${name}_hhmmss`]: time ? `${sign}${hh}:${mm}:${ss}` : undefined,
		[`${name}_h`]: hh,
		[`${name}_m`]: mm,
		[`${name}_s`]: ss,
		[`${name}_seconds`]: time ? Number(hh) * 3600 + Number(mm) * 60 + Number(ss) : undefined,
	}
}

// Communication with Mitti: OSC commands out, the OSC feedback listener and decoding its messages into module state, the heartbeat and the Bonjour advertisement
export class MittiApi {
	host: string | null = null
	private listener: Server | null = null
	private connection: ConnectionState = {
		connected: null,
		testService: null,
		testTimeout: null,
		lastPong: null,
		bonjour: null,
		bonjourService: null,
	}

	private pending: Promise<void> = Promise.resolve()
	private lastListenerValues = new Map<string, OscValue | undefined>()
	private pendingVariables: Partial<VariablesSchema> = {}
	private sentVariables = new Map<string, CompanionVariableValue | undefined>()
	private pendingFeedbacks = new Set<FeedbackId>()
	private flushScheduled = false

	// Cue IDs reported by a resendOSCFeedback requested after a delete, or null when none is in progress
	private resyncSeenCues: Set<string> | null = null
	private resyncTimer: NodeJS.Timeout | null = null

	constructor(private readonly self: MittiInstance) {}

	// Connects, disconnects and Bonjour changes run one at a time, so a slow port check can't leave a listener running
	private async serialize(task: () => Promise<void>): Promise<void> {
		const run = this.pending.then(task)
		this.pending = run.catch(() => undefined)
		return run
	}

	sendCommand(command: string): void {
		if (!this.host) return
		this.self.oscSend(this.host, MITTI_OSC_PORT, `/mitti/${command}`, [])
	}

	// Mitti takes values as strings unless the command needs an integer; an empty or unset value sends the bare command
	sendValue(command: string, value: OscValue, type: 's' | 'i'): void {
		if (!this.host) return
		if (!value && value !== 0) {
			this.sendCommand(command)
			return
		}
		this.self.oscSend(this.host, MITTI_OSC_PORT, `/mitti/${command}`, [
			type === 'i' ? { type: 'i', value: Number(value) } : { type: 's', value: String(value) },
		])
	}

	async connect(): Promise<void> {
		return this.serialize(async () => this.openListener())
	}

	private async openListener(): Promise<void> {
		await this.closeListener()
		this.cancelCueResync()
		this.lastListenerValues.clear()
		this.sentVariables.clear()
		const feedbackPort = this.self.config.feedbackPort

		const portError = await this.checkPortAvailable(feedbackPort)
		if (portError) {
			this.handleListenerError(portError)
			return
		}

		this.listener = new Server(feedbackPort, '0.0.0.0')

		this.listener.on('listening', () => {
			this.self.updateStatus(InstanceStatus.Ok)
			this.connection.connected = true

			this.sendCommand('resendOSCFeedback')

			if (this.self.config.feedbackAlert) {
				this.startTestService()
			} else {
				this.stopTestService()
			}

			void this.serialize(async () => this.startBonjourService())
		})

		this.listener.on('error', (err: NodeJS.ErrnoException, rinfo?: RemoteInfo) => {
			// node-osc reports undecodable packets as errors too (with rinfo); those don't affect the socket
			if (rinfo) {
				this.self.log('debug', `Ignoring malformed OSC packet from ${rinfo.address}: ${err.message}`)
				return
			}
			this.handleListenerError(err)
		})

		this.listener.on('message', (message: OscMessage) => this.processOSCMessage(message))
		this.listener.on('bundle', (bundle: OscBundle) => this.processOSCBundle(bundle))
	}

	private handleListenerError(err: NodeJS.ErrnoException): void {
		this.connection.connected = false
		if (err.code == 'EADDRINUSE') {
			this.self.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is already in use.`)
			this.self.updateStatus(InstanceStatus.BadConfig, 'Feedback port conflict')
		} else {
			this.self.log('error', `Error: ${err.message}`)
			this.self.updateStatus(InstanceStatus.BadConfig, 'Feedback Unavailable')
		}
	}

	// node-osc always binds with reuseAddr, so a port clash never errors; probe with an exclusive bind first
	private async checkPortAvailable(port: number): Promise<NodeJS.ErrnoException | null> {
		return new Promise((resolve) => {
			const probe = createSocket({ type: 'udp4', reuseAddr: false })
			probe.once('error', (err) => {
				probe.close()
				resolve(err)
			})
			probe.once('listening', () => probe.close(() => resolve(null)))
			probe.bind(port, '0.0.0.0')
		})
	}

	private async closeListener(): Promise<void> {
		const listener = this.listener
		if (!listener) return
		this.listener = null
		listener.removeAllListeners()
		// Wait for the socket to release the port so a restart on the same port passes the availability check
		await new Promise<void>((resolve) => {
			try {
				void listener.close(() => resolve())
			} catch {
				// Socket was never bound or is already closed
				resolve()
			}
		})
	}

	private processOSCBundle(bundle: OscBundle): void {
		for (const element of bundle.elements) {
			if (Array.isArray(element)) {
				this.processOSCMessage(element)
			} else {
				this.processOSCBundle(element)
			}
		}
	}

	private processOSCMessage(message: OscMessage): void {
		const [address, rawValue] = message
		const value = typeof rawValue === 'string' || typeof rawValue === 'number' ? rawValue : undefined

		if (!address || typeof address !== 'string') {
			return
		}

		if (address.match(/(^\/mitti\/current\/)/i)) {
			const cueInfo = address.match(/(\/mitti\/current\/)(\S*)/i)
			const param = cueInfo?.[2]
			if (param) {
				this.processCueUpdate('current', param, value)
			}
		} else if (address.match(/(^\/mitti\/\S*\/)/i)) {
			const cueInfo = address.match(/(\/mitti\/)(\S*)(\/)(\S*)/i)
			const cue = cueInfo?.[2]
			const param = cueInfo?.[4]

			if (cue && param && cue !== 'current') {
				this.processCueUpdate(cue, param, value)
			}
		} else {
			const sanitizedAddress = address.replace('/mitti/', '')
			if (sanitizedAddress === 'pong') {
				this.connection.lastPong = Date.now()
			} else {
				this.processListenerUpdate(sanitizedAddress, value)
			}
		}
	}

	private testConnection(): void {
		this.connection.testService = setInterval(() => {
			this.sendCommand('ping')

			this.connection.testTimeout = setTimeout(() => {
				if (Date.now() - 4000 > (this.connection.lastPong ?? 0)) {
					if (this.connection.connected === true) {
						this.connection.connected = false
						this.self.updateStatus(InstanceStatus.ConnectionFailure, 'Feedback Unavailable')
						this.self.log(
							'error',
							'Feedback unavailable, unable to receive response from Mitti. Check you OSC Feedback settings in both Mitti and Companion.',
						)
					}
				} else {
					if (this.connection.connected === false) {
						this.connection.connected = true
						this.self.updateStatus(InstanceStatus.Ok)
						this.self.log('info', 'Connected to Mitti')
					}
				}
			}, 2000)
		}, 4000)
	}

	private startTestService(): void {
		this.stopTestService()
		this.self.log('debug', 'Starting Connection Test')
		this.testConnection()
	}

	private stopTestService(): void {
		if (this.connection.testService) {
			this.self.log('debug', 'Stopping Connection Test')
			clearInterval(this.connection.testService)
			this.connection.testService = null
		}
		if (this.connection.testTimeout) {
			clearTimeout(this.connection.testTimeout)
			this.connection.testTimeout = null
		}
	}

	private async startBonjourService(): Promise<void> {
		await this.stopBonjourService()

		const feedbackPort = this.self.config.feedbackPort
		const name = `Bitfocus-Mitti-Module:${feedbackPort}`

		try {
			const bonjour = new Bonjour()
			this.connection.bonjour = bonjour

			const service = bonjour.publish({
				name: name,
				type: 'osc',
				port: feedbackPort,
				protocol: 'udp',
				disableIPv6: true,
			})
			this.connection.bonjourService = service

			service.on('up', () => {
				this.self.log('debug', `Bonjour advertised as ${name}`)
			})

			service.on('error', (err: unknown) => {
				this.self.log('debug', `Bonjour error: ${String(err)}`)
			})
		} catch (e) {
			this.self.log('error', `Error advertising Bonjour discovery service: ${String(e)}`)
			// Clean up if we created the Bonjour instance but failed to publish
			if (this.connection.bonjour) {
				try {
					this.connection.bonjour.destroy()
				} catch (destroyErr) {
					this.self.log('error', `Error destroying Bonjour instance: ${String(destroyErr)}`)
				}
				this.connection.bonjour = null
			}
		}
	}

	private async stopBonjourService(): Promise<void> {
		// Stop the service explicitly first
		if (this.connection.bonjourService) {
			try {
				this.connection.bonjourService.stop?.()
			} catch (e) {
				this.self.log('error', `Error stopping Bonjour service: ${String(e)}`)
			}
			// Remove event listeners from service before cleanup
			this.connection.bonjourService.removeAllListeners()
			this.connection.bonjourService = null
		}

		const bonjour = this.connection.bonjour
		if (bonjour) {
			await new Promise<void>((resolve) => {
				try {
					bonjour.unpublishAll(() => {
						this.self.log('debug', `Bonjour advertisement destroyed`)
						try {
							bonjour.destroy()
							this.self.log('debug', `Bonjour instance destroyed`)
						} catch (destroyErr) {
							this.self.log('error', `Error destroying Bonjour instance: ${String(destroyErr)}`)
						} finally {
							this.connection.bonjour = null
							resolve()
						}
					})
				} catch (e) {
					this.self.log('error', `Error stopping Bonjour instance: ${String(e)}`)
					this.connection.bonjour = null
					resolve()
				}
			})
		}
	}

	// Mitti reports a whole playlist in a burst, so updates are collected and sent to Companion once per tick
	private setVariables(values: Partial<VariablesSchema>): void {
		Object.assign(this.pendingVariables, values)
		this.scheduleFlush()
	}

	private checkFeedbacks(...feedbackIds: FeedbackId[]): void {
		for (const id of feedbackIds) this.pendingFeedbacks.add(id)
		this.scheduleFlush()
	}

	private scheduleFlush(): void {
		if (this.flushScheduled) return
		this.flushScheduled = true
		setImmediate(() => {
			this.flushScheduled = false
			// Timecodes arrive every frame but the variables only show whole seconds, so most updates repeat the last value
			const variables: Record<string, CompanionVariableValue | undefined> = {}
			for (const [id, value] of Object.entries(this.pendingVariables)) {
				if (this.sentVariables.get(id) === value) continue
				this.sentVariables.set(id, value)
				variables[id] = value
			}
			const [firstFeedback, ...otherFeedbacks] = this.pendingFeedbacks
			this.pendingVariables = {}
			this.pendingFeedbacks = new Set()

			if (Object.keys(variables).length > 0) this.self.setVariableValues(variables)
			if (firstFeedback) this.self.checkFeedbacks(firstFeedback, ...otherFeedbacks)
		})
	}

	async disconnect(): Promise<void> {
		return this.serialize(async () => {
			await this.closeListener()
			this.cancelCueResync()
			this.pendingVariables = {}
			this.pendingFeedbacks.clear()
			this.stopTestService()
			await this.stopBonjourService()
		})
	}

	private processListenerUpdate(address: string, value: OscValue | undefined): void {
		// selectedCueID follows every cue in a resendOSCFeedback
		if (address === 'selectedCueID' && this.resyncSeenCues) this.finishCueResync(this.resyncSeenCues)

		// Mitti resends values that haven't changed, eg on resendOSCFeedback or while a cue plays
		if (this.lastListenerValues.has(address) && this.lastListenerValues.get(address) === value) return
		this.lastListenerValues.set(address, value)

		switch (address) {
			case 'currentCueName':
				this.self.states.currentCueName = value
				this.setVariables({ currentCueName: displayValue(value) })
				this.checkFeedbacks('playingCueName', 'playingCueID', 'activeCueName')
				break
			case 'currentCueID':
				this.self.states.currentCueID = value
				this.setVariables({ currentCueID: displayValue(value) })
				this.checkFeedbacks('playingCueName', 'playingCueID', 'activeCueID', 'selectedCuePlaying')
				if (isEmptyCueID(value)) this.clearCueTiming()
				break
			case 'previousCueName':
				this.setVariables({ previousCueName: displayValue(value) })
				break
			case 'nextCueName':
				this.setVariables({ nextCueName: displayValue(value) })
				break
			case 'selectedCueName':
				this.self.states.selectedCueName = value
				this.setVariables({ selectedCueName: displayValue(value) })
				this.checkFeedbacks('selectedCueName')
				break
			case 'selectedCueID':
				this.self.states.selectedCueID = value
				this.setVariables({ selectedCueID: displayValue(value) })
				this.checkFeedbacks('selectedCueID', 'selectedCuePlaying')
				break
			case 'cueTimeLeft':
			case 'cueTimeElapsed':
			case 'currentCueTRT': {
				if (this.lastListenerValues.has('currentCueID') && isEmptyCueID(this.self.states.currentCueID)) {
					this.lastListenerValues.delete(address)
					break
				}
				const time = parseTimecode(value, address === 'cueTimeLeft' ? '-' : '')
				if (!time) break

				const variables = timecodeVariables(address, time)
				this.setVariables(variables)
				if (address === 'cueTimeLeft' && typeof variables.cueTimeLeft_seconds === 'number') {
					if (variables.cueTimeLeft_seconds !== this.self.states.timeRemaining) {
						this.self.states.timeRemaining = variables.cueTimeLeft_seconds
						this.checkFeedbacks('timeRemaining')
					}
				}
				break
			}
			case 'currentCueVolume':
				this.self.states.currentCueVolume = Number(value)
				this.setVariables({ currentCueVolume: roundVolume(value) })
				break
			case 'togglePlay':
				this.self.states.playing = value === 0 ? 'Paused' : 'Playing'
				this.setVariables({ playStatus: this.self.states.playing })
				this.checkFeedbacks('playStatus', 'playingCueName', 'playingCueID', 'selectedCuePlaying')
				break
			case 'playhead':
				this.self.states.playhead = Number(value)
				break
			case 'toggleVideoOutputs':
				this.self.states.videoOutputs = value == 1
				this.setVariables({ video_outputs: this.self.states.videoOutputs ? 'Active' : 'Off' })
				this.checkFeedbacks('videoOutputs')
				break
			case 'toggleAudio':
				this.self.states.audioOutputs = value == 1
				this.setVariables({ audio_outputs: this.self.states.audioOutputs ? 'Active' : 'Off' })
				this.checkFeedbacks('audioOutputs')
				break
			case 'inFromPlayheadEnabled':
				this.self.states.inFromPlayheadEnabled = value == 1
				this.checkFeedbacks('inFromPlayheadEnabled')
				break
			case 'outFromPlayheadEnabled':
				this.self.states.outFromPlayheadEnabled = value == 1
				this.checkFeedbacks('outFromPlayheadEnabled')
				break
			default:
				break
		}
	}

	private clearCueTiming(): void {
		for (const name of CueTimeVariables) {
			// The next cue can report the same timecode as the previous cue.
			this.lastListenerValues.delete(name)
			this.setVariables(timecodeVariables(name, null))
		}
		if (this.self.states.timeRemaining !== undefined) {
			this.self.states.timeRemaining = undefined
			this.checkFeedbacks('timeRemaining')
		}
	}

	private processCueUpdate(cue: string, param: string, value: OscValue | undefined): void {
		if (param === 'cueName') this.resyncSeenCues?.add(cue)

		const cueState = this.self.cues[cue]
		if (cueState && Object.hasOwn(cueState, param) && cueState[param] === value) return

		if (cue === 'current') {
			this.self.cues[cue] ??= createRecord()
			this.self.cues[cue][param] = value

			let variableValue = value
			let variableId: `currentCue${string}`
			if (param.match(/^toggle/)) {
				const name = param.replace('toggle', '')
				if (name === 'Audio') {
					variableValue = Number(value) > 0 ? 'Unmuted' : 'Muted'
					this.self.states.currentCueAudioMuted = value !== undefined && Number(value) === 0
					this.checkFeedbacks('cueAudioMuted')
				} else {
					variableValue = Number(value) > 0 ? 'On' : 'Off'
				}
				variableId = `currentCue${name}`
			} else {
				let name = param.charAt(0).toUpperCase() + param.slice(1)
				if (name === 'VolumeAsDecibels') {
					this.self.states.currentCueVolume = Number(value)
					name = 'Volume'
					variableValue = roundVolume(value)
				}
				if (name === 'PlaybackSpeed') {
					this.self.states.currentCuePlaybackSpeed = Number(value)
				}

				variableId = `currentCue${name}`
			}

			this.setVariables({ [variableId]: variableValue })
			const feedbackId = CueToggleFeedbackIds.get(param)
			if (feedbackId) {
				this.checkFeedbacks(feedbackId)
			}
		} else if (cue === 'previous' || cue === 'next') {
			this.self.cues[cue] ??= createRecord()
			this.self.cues[cue][param] = value
		} else if (param === 'deleted') {
			// Mitti can repeat `deleted`, so it must never create a cue
			if (this.self.cues[cue]) this.removeCues([cue])
			this.scheduleCueResync()
		} else {
			if (!this.self.cues[cue]?.cueName && cue !== '0' && param === 'cueName') {
				this.self.cues[cue] ??= createRecord()
				this.self.cues[cue][param] = value
				this.self.scheduleCueDefinitions()
			} else {
				this.self.cues[cue] ??= createRecord()
				this.self.cues[cue][param] = value

				if (param === 'cueName') {
					this.setVariables({ [`cue_${cue}_cueName`]: value })
				}
				const feedbackId = CueToggleFeedbackIds.get(param)
				if (feedbackId) {
					this.checkFeedbacks(feedbackId)
				}
			}
		}
	}

	private removeCues(cueIDs: string[]): void {
		for (const cue of cueIDs) {
			delete this.self.cues[cue]
			// A new cue can reuse the ID, so its name must not be skipped as already sent
			delete this.pendingVariables[`cue_${cue}_cueName`]
			this.sentVariables.delete(`cue_${cue}_cueName`)
		}
		this.checkFeedbacks(...CueToggleFeedbackIds.values())
		this.self.scheduleCueDefinitions()
	}

	// Deleting a cue renumbers the ones after it, so fetch the whole playlist again and drop the cues
	private scheduleCueResync(): void {
		this.cancelCueResync()
		this.resyncTimer = setTimeout(() => {
			this.resyncSeenCues = new Set()
			this.sendCommand('resendOSCFeedback')
			this.resyncTimer = setTimeout(() => this.cancelCueResync(), CUE_RESYNC_TIMEOUT)
		}, CUE_RESYNC_DELAY)
	}

	private finishCueResync(seenCues: Set<string>): void {
		this.cancelCueResync()
		const removed = playlistCueIDs(this.self.cues).filter((cue) => !seenCues.has(cue))
		if (removed.length > 0) this.removeCues(removed)
	}

	private cancelCueResync(): void {
		if (this.resyncTimer) clearTimeout(this.resyncTimer)
		this.resyncTimer = null
		this.resyncSeenCues = null
	}
}
