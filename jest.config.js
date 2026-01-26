const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  // Transform ESM modules that Jest can't handle natively
  transformIgnorePatterns: [
    '/node_modules/(?!(@t3-oss/env-nextjs|@t3-oss/env-core)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
