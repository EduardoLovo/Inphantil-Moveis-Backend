const serverless = require('serverless-http');
const app = require('../src/app'); // importa seu app.js

module.exports = serverless(app);
