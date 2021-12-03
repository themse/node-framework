/* eslint-disable no-undef */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'no-empty-function': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-unused-vars': ['off'],
		'@typescript-eslint/explicit-function-return-type': ['warn'],
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				trailingComma: 'all',
				useTabs: true,
				semi: true,
				bracketSpacing: true,
				printWidth: 100,
				endOfLine: 'auto',
			},
		],
	},
};
