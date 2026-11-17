import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default [
	...(await generateEslintConfig({
		enableTypescript: true,
	})),
	{
		files: ['**/__tests__/**/*'],
		rules: {
			'n/no-unpublished-import': 'off',
		},
	},
]
