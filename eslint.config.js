import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
	{
		name: 'app/files-to-lint',
		files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'],
	},

	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},

	js.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	skipFormatting,
	{
		files: ['src/**/*.js'],
		rules: {
			'eqeqeq': 'error',
			'indent': ['error', 'tab', { SwitchCase: 1 }],
			'no-const-assign': 'error',
			'no-duplicate-case': 'error',
			'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
			'comma-spacing': ['error', { before: false, after: true }],
			'keyword-spacing': ['error', { before: true, after: true }],
		},
	},
	{
		files: ['src/**/*.vue'],
		rules: {
			'indent': 'off',
			'vue/script-indent': ['error', 'tab', { baseIndent: 1, switchCase: 1 }],
			'vue/multi-word-component-names': 'off',
			'vue/no-parsing-error': 'off',
			'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
		},
	},
])
