const path = require('path');

// eslint-disable-next-line no-undef
module.exports = {
  "roots": [
    "./e2e/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "automock": false,
  "collectCoverage": true,
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.test.json"
    }
  },
  "testResultsProcessor": path.resolve(__dirname, "../jest-trx-results-processor.js"),
  "testRegex": "src/.*\.test\.ts$"
}