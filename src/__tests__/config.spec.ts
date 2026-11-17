import { describe, expect, test } from 'vitest'
import { DEFAULT_FEEDBACK_PORT, getMittiHost, isValidPort, type MittiConfig } from '../config.js'
import { conformCueID, createRecord, playlistCueIDs } from '../utils.js'

const config = (fields: Partial<MittiConfig>): MittiConfig => ({ feedbackPort: DEFAULT_FEEDBACK_PORT, ...fields })

describe('getMittiHost', () => {
	test.each([
		[{ host: '192.168.1.20' }, '192.168.1.20'],
		[{ host: '192.168.1.300' }, null],
		[{ host: '' }, null],
		[{}, null],
		[{ bonjourHost: '10.0.0.5:51000', host: '1.2.3.4' }, '10.0.0.5'],
		[{ bonjourHost: 'mitti.local:51000' }, null],
		[{ bonjourHost: null, host: '127.0.0.1' }, '127.0.0.1'],
	])('%j -> %j', (fields, expected) => {
		expect(getMittiHost(config(fields))).toBe(expected)
	})
})

describe('isValidPort', () => {
	test.each([
		[51001, true],
		[1, true],
		[65535, true],
		[0, false],
		[65536, false],
		[51001.5, false],
		['51001', false],
		[undefined, false],
	])('%j -> %j', (port, expected) => {
		expect(isValidPort(port)).toBe(expected)
	})
})

describe('conformCueID', () => {
	test('cue IDs are upper-cased and limited to 6 characters, like Mitti', () => {
		expect(conformCueID('ab12')).toBe('AB12')
		expect(conformCueID('abcdefgh')).toBe('ABCDEF')
	})

	test('relative cue keywords are passed through', () => {
		for (const keyword of ['current', 'selected', 'previous', 'next', 'all']) {
			expect(conformCueID(keyword)).toBe(keyword)
		}
	})
})

test('playlistCueIDs skips the current/previous/next entries, cue 0 and unnamed cues', () => {
	const cues = createRecord<Record<string, string>>()
	for (const id of ['current', 'previous', 'next', '0', '1', 'AB12']) cues[id] = { cueName: id }
	cues['99'] = {}

	expect(playlistCueIDs(cues)).toEqual(['1', 'AB12'])
})
