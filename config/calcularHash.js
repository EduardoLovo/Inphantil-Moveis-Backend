const fs = require('fs');
const crypto = require('crypto');

function calcularHashArquivo(caminhoArquivo) {
    if (!fs.existsSync(caminhoArquivo)) return null; // Se o arquivo não existir, retorna null
    const arquivo = fs.readFileSync(caminhoArquivo);
    return crypto.createHash('sha256').update(arquivo).digest('hex');
}

module.exports = calcularHashArquivo;
