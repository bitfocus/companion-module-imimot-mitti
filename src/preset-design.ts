import {
	ButtonGraphicsDecorationType,
	type ButtonGraphicsTextElement,
	type CompanionLayeredButtonPresetDefinition,
	type CompanionGraphicsElementValue,
	type CompanionPresetAlternatives,
	type CompanionPresetFeedbackStyleOverride,
	type CompanionSimplePresetDefinition,
	type SomeButtonGraphicsElement,
	type SomePresetActionEntry,
	type SomePresetLayeredFeedbackEntry,
	type SomePresetSimpleFeedbackEntry,
} from '@companion-module/base'
import type { ModuleSchema } from './main.js'
import { ColorMuted, ColorSurface, ColorWhite, MittiCyan } from './utils.js'

export type PresetAction = SomePresetActionEntry<ModuleSchema>
export type PresetFeedback = SomePresetSimpleFeedbackEntry<ModuleSchema>
export type TransportIcon = 'play' | 'playlist' | 'selectedCue' | 'pause' | 'previous' | 'next' | 'playPause'

export const PresetTextSizes = { primary: '18', standard: '14', fit: 'auto' } as const

interface ButtonPreset {
	name: string
	/** Context first, then the action or live value. */
	lines: string[]
	size?: keyof typeof PresetTextSizes
	bgcolor?: number
	icon?: TransportIcon
	hint?: string
	mono?: boolean
	progress?: boolean
	down?: PresetAction[]
	rotateLeft?: PresetAction[]
	rotateRight?: PresetAction[]
	feedbacks?: PresetFeedback[]
	localVariables?: CompanionLayeredButtonPresetDefinition<ModuleSchema>['localVariables']
	missingValue?: string
}

function text(
	id: string,
	value: CompanionGraphicsElementValue<string>,
	y: number,
	height: number,
	fontsize: number,
	color = ColorWhite,
): ButtonGraphicsTextElement {
	return {
		type: 'text',
		id,
		name: id.charAt(0).toUpperCase() + id.slice(1),
		x: 7,
		y,
		width: 86,
		height,
		text: value,
		fontsize,
		fontsizeAllowShrink: true,
		font: 'companion-sans',
		weight: 'bold',
		color,
		outlineColor: 0xff000000, // Transparent: keep small text crisp without a black outline.
		halign: 'center',
		valign: 'center',
	}
}

/** Keep placeholders in the presentation; raw module variables retain their original values. */
function displayText(template: string, missingValue = '—'): CompanionGraphicsElementValue<string> {
	const parts: string[] = []
	let end = 0
	for (const match of template.matchAll(/\$\([^)]+\)/g)) {
		parts.push(JSON.stringify(template.slice(end, match.index)))
		const variable = match[0]
		const variableEnd = match.index + variable.length
		const unit = template.slice(variableEnd).match(/^(%| dB)(?=\n|$)/)?.[0] ?? ''
		const value = unit ? `concat(${variable}, ${JSON.stringify(unit)})` : variable
		parts.push(`(${variable} == null || ${variable} === "" ? ${JSON.stringify(missingValue)} : ${value})`)
		end = variableEnd + unit.length
	}
	if (!parts.length) return template
	parts.push(JSON.stringify(template.slice(end)))
	return { isExpression: true, value: `concat(${parts.join(', ')})` }
}

/** Native transport symbols in a square coordinate space. */
function transportIcon(icon: TransportIcon): SomeButtonGraphicsElement<undefined>[] {
	const stroke = (fromX: number, fromY: number, toX: number, toY: number): SomeButtonGraphicsElement<undefined> => ({
		type: 'line',
		fromX,
		fromY,
		toX,
		toY,
		borderWidth: 4,
		borderColor: ColorWhite,
	})
	// Overlapping vertical strokes form a solid triangle without raster artwork.
	const play = (x: number, width: number, top = 32, height = 36) =>
		Array.from({ length: 24 }, (_, index) => {
			const fraction = index / 24
			return {
				...stroke(
					x + width * fraction,
					top + (height * fraction) / 2,
					x + width * fraction,
					top + height - (height * fraction) / 2,
				),
				borderWidth: width / 24 + 0.2,
			}
		})
	switch (icon) {
		case 'play':
			return play(39, 27)
		case 'playlist':
			return [
				{
					type: 'circle',
					x: 25,
					y: 25,
					width: 50,
					height: 50,
					color: 0xff000000,
					borderWidth: 3,
					borderColor: ColorWhite,
				},
				...play(43, 20, 37, 26),
			]
		case 'selectedCue':
			return [
				{
					type: 'box',
					x: 26,
					y: 26,
					width: 48,
					height: 48,
					cornerRadius: 8,
					color: 0xff000000,
					borderWidth: 3,
					borderColor: ColorWhite,
				},
				...play(42, 22, 36, 28),
			]
		case 'pause':
			return [stroke(40, 32, 40, 68), stroke(60, 32, 60, 68)]
		case 'previous':
		case 'next': {
			const mirror = (x: number) => (icon === 'previous' ? 100 - x : x)
			return [
				stroke(mirror(32), 32, mirror(32), 68),
				stroke(mirror(32), 32, mirror(58), 50),
				stroke(mirror(58), 50, mirror(32), 68),
				stroke(mirror(68), 32, mirror(68), 68),
			]
		}
		case 'playPause':
			return [...play(25, 23), stroke(61, 32, 61, 68), stroke(75, 32, 75, 68)]
	}
}

function layeredFeedback(feedback: PresetFeedback, icon?: TransportIcon): SomePresetLayeredFeedbackEntry<ModuleSchema> {
	const { style, ...entry } = feedback
	const styleOverrides: (Omit<CompanionPresetFeedbackStyleOverride, 'override'> & {
		override: string | number | boolean
	})[] = []
	if (style.bgcolor !== undefined) {
		styleOverrides.push({ elementId: 'surface', elementProperty: 'color', override: style.bgcolor })
	}
	if (style.color !== undefined) {
		styleOverrides.push(
			{ elementId: 'value', elementProperty: 'color', override: style.color },
			{ elementId: 'label', elementProperty: 'color', override: style.color },
		)
	}
	if (style.text !== undefined) {
		const [label, ...lines] = style.text.split('\n')
		if (lines.length) styleOverrides.push({ elementId: 'label', elementProperty: 'text', override: label })
		styleOverrides.push({
			elementId: 'value',
			elementProperty: 'text',
			override: lines.length ? lines.join('\n') : label,
		})
	}
	if (icon === 'playPause' && feedback.feedbackId === 'playStatus') {
		const playing = feedback.options.playPause === 'Playing'
		styleOverrides.push(
			{ elementId: 'pauseSymbol', elementProperty: 'enabled', override: playing },
			{ elementId: 'resumeSymbol', elementProperty: 'enabled', override: !playing },
			{ elementId: 'unknownSymbol', elementProperty: 'enabled', override: false },
		)
	}
	// Older layered preset converters expect a wrapped value for every override.
	return {
		...entry,
		styleOverrides: styleOverrides.map(({ override, ...target }) => ({
			...target,
			override: { isExpression: false, value: override },
		})),
	}
}

/** Every preset ships a native layered layout and a compatible text fallback. */
export function button({
	name,
	lines,
	size = 'standard',
	bgcolor = ColorSurface,
	icon,
	hint,
	mono = false,
	progress = false,
	down = [],
	rotateLeft,
	rotateRight,
	feedbacks = [],
	localVariables,
	missingValue,
}: ButtonPreset): CompanionPresetAlternatives<ModuleSchema> {
	const label = lines.length > 1 ? lines[0].toUpperCase() : 'MITTI'
	const value = lines.length > 1 ? lines.slice(1).join('\n') : (lines[0] ?? '')
	// Uppercase static actions; preserve live variables and cue names exactly as supplied.
	const displayValue = mono || value.includes('$(') ? value : value.toUpperCase()
	const valueText = displayText(displayValue, missingValue)
	const isRotary = rotateLeft !== undefined && rotateRight !== undefined
	const steps = [{ down, up: [], ...(isRotary && { rotate_left: rotateLeft, rotate_right: rotateRight }) }]
	const labelElement = text('label', label, 9, 15, 90, isRotary ? ColorWhite : ColorMuted)
	const elements: SomeButtonGraphicsElement<undefined>[] = [
		{ type: 'box', id: 'surface', name: 'State Background', x: 0, y: 0, width: 100, height: 100, color: bgcolor },
		isRotary ? { ...labelElement, x: 25, width: 68 } : labelElement,
	]
	if (isRotary) {
		elements.push({
			type: 'group',
			id: 'rotarySymbol',
			name: 'Rotary Knob Symbol',
			x: 7,
			y: 9,
			width: 18,
			height: 15,
			squareCoords: true,
			children: [
				{
					type: 'circle',
					x: 8,
					y: 8,
					width: 84,
					height: 84,
					color: 0xff000000,
					borderWidth: 10,
					borderColor: ColorWhite,
				},
				{
					type: 'line',
					fromX: 50,
					fromY: 50,
					toX: 71,
					toY: 29,
					borderWidth: 10,
					borderColor: ColorWhite,
				},
			],
		})
	}
	if (icon) {
		elements.push({
			type: 'group',
			id: 'icon',
			name: 'Transport Symbol',
			x: 5,
			y: 5,
			width: 90,
			height: 90,
			squareCoords: true,
			children:
				icon === 'playPause'
					? [
							{
								type: 'group',
								id: 'pauseSymbol',
								name: 'Pause Symbol',
								enabled: false,
								children: transportIcon('pause'),
							},
							{
								type: 'group',
								id: 'resumeSymbol',
								name: 'Resume Symbol',
								enabled: false,
								children: transportIcon('play'),
							},
							{
								type: 'group',
								id: 'unknownSymbol',
								name: 'Unknown State Symbol',
								enabled: true,
								children: transportIcon('playPause'),
							},
						]
					: transportIcon(icon),
		})
		elements.push(text('value', valueText, 78, 15, 85))
	} else {
		elements.push({
			...text('value', valueText, progress ? 26 : 30, hint ? 43 : 58, size === 'primary' ? 75 : 60),
			font: mono ? 'companion-mono' : 'companion-sans',
		})
		if (hint) elements.push(text('hint', displayText(hint), 82, 11, 85, ColorMuted))
	}
	if (progress)
		elements.push({
			type: 'gauge',
			id: 'progress',
			name: 'Cue Progress',
			x: 10,
			y: 86,
			width: 80,
			height: 8,
			orientation: 'horizontal',
			min: 0,
			max: {
				isExpression: true,
				value: '$(mitti:currentCueTRT_total_seconds) > 0 ? $(mitti:currentCueTRT_total_seconds) : 1',
			},
			value: {
				isExpression: true,
				value: '$(mitti:cueTimeElapsed_total_seconds) >= 0 ? $(mitti:cueTimeElapsed_total_seconds) : 0',
			},
			enabled: {
				isExpression: true,
				value: '$(mitti:currentCueTRT_total_seconds) > 0 && $(mitti:cueTimeElapsed_total_seconds) >= 0',
			},
			fillEnabled: true,
			fillWidth: 100,
			trackWidth: 100,
			trackStyle: 'dimmed',
			trackAmount: 25,
			stops: [{ value: 0, color: MittiCyan, gradient: false }],
		})
	const layered: CompanionLayeredButtonPresetDefinition<ModuleSchema> = {
		type: 'layered',
		name,
		canvas: { decoration: ButtonGraphicsDecorationType.None },
		options: {},
		elements,
		steps,
		feedbacks: feedbacks.map((feedback) => layeredFeedback(feedback, icon)),
		localVariables,
	}
	const simpleText = displayText(`${label}\n${displayValue}${hint ? '\n' + hint : ''}`, missingValue)
	const simple: CompanionSimplePresetDefinition<ModuleSchema> = {
		type: 'simple',
		name,
		options: {},
		style: {
			text: typeof simpleText === 'string' ? simpleText : simpleText.value,
			textExpression: typeof simpleText !== 'string' && simpleText.isExpression,
			size: hint ? 'auto' : size === 'primary' ? PresetTextSizes.standard : PresetTextSizes[size],
			color: ColorWhite,
			bgcolor,
			show_topbar: false,
		},
		steps,
		feedbacks,
		localVariables,
	}
	return { type: 'alternatives', variants: [layered, simple] }
}
