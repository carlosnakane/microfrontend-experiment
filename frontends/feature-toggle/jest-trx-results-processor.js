const path = require('path');
const builder = require('jest-trx-results-processor');     
const processor = builder({
  outputFile: path.resolve(__dirname, 'jest-trx-processor-result.trx')
});
module.exports = processor;
