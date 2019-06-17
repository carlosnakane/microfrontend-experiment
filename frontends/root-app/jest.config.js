// eslint-disable-next-line no-undef
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "automock": false,
  "setupFiles": [
    "./setup-jest.js"
  ],
  "collectCoverage": true,
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.test.json"
    }
  },
  "testResultsProcessor": "./jest-trx-results-processor.js",
  "testRegex": "src/.*\.test\.ts$"
}