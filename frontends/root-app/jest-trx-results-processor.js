var builder = require('jest-trx-results-processor');     
var processor = builder({
  outputFile: 'jest-trx-processor-result.trx' 
});
module.exports = processor;
