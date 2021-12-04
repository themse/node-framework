import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
	verbose: true,
	moduleFileExtensions: ['ts', 'js'],
};

export default config;
