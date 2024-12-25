const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleDirectories: ['node_modules'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleFileExtensions: ['js', 'mjs', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.mjs?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '\\.(css|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^vuetify/components$': '<rootDir>/node_modules/vuetify/lib/components/index.mjs',
    '^vuetify/locale$': '<rootDir>/node_modules/vuetify/lib/locale/index.mjs',
    '^vuetify/labs/VDataTable$': '<rootDir>/node_modules/vuetify/lib/labs/VDataTable/index.mjs',
    '^vuetify/directives$': '<rootDir>/node_modules/vuetify/lib/directives/index.mjs',
    '^vuetify/iconsets/mdi$': '<rootDir>/node_modules/vuetify/lib/iconsets/mdi.mjs',
    'axios': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
  },
  transformIgnorePatterns: ['/node_modules/(?!vuetify)'],
};
