import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',  // Add this line to transform JavaScript files using Babel
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/dist/**/*.test.js'],
  verbose: true,
  moduleDirectories: ['node_modules', 'dist'],
};

export default config;
