module.exports = {
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-useless-escape': 0,
		//indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-class-assign': 'off',
		// 'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'react/display-name': 0,
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'no-mixed-spaces-and-tabs': 'off',
	},
	globals: {
		module: false,
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {
				'@typescript-eslint/interface-name-prefix': 'off',
			},
		},
	],
};
