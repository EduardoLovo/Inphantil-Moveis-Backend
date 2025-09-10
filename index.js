const serverless = require('serverless-http');
const app = require('./src/app.js');

// Wrap com timeout de 9 segundos (para evitar o limite de 10s da Vercel)
const handler = serverless(app);

module.exports = (req, res) => {
    // Configura um timeout de 9 segundos
    const timeout = setTimeout(() => {
        res.status(504).json({ error: 'Request timeout' });
    }, 9000);

    // Limpa o timeout quando a request terminar
    return handler(req, res)
        .then((result) => {
            clearTimeout(timeout);
            return result;
        })
        .catch((error) => {
            clearTimeout(timeout);
            throw error;
        });
};
