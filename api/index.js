const serverless = require('serverless-http');
const app = require('../app'); // importa seu app.js

module.exports = serverless(app);
