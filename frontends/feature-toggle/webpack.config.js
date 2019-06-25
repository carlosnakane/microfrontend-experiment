const prod = require('./config/webpack.prod');
const dev = require('./config/webpack.dev');

module.exports = !process.env.production ? dev : prod;
