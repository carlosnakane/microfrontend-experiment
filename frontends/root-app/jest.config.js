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
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.test.json"
    }
  }
}