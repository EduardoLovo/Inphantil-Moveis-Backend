const mongoose = require('mongoose');

const LencolProntaEntrega = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true, // Campo obrigatório
            trim: true, // Remove espaços no início e no fim
        },
        imagem: {
            type: String,
            required: true, // Campo obrigatório
           
        },
        quantidade: {
            type: Number,
            required: true, // Campo obrigatório
            min: [0, 'A quantidade não pode ser negativa'], // Validação para evitar valores negativos
        },
        cor: {
            type: String,
            required: true, // Campo obrigatório
        },
        tamanho: {
            type: String,
            required: true, // Campo obrigatório
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

// Exporta o modelo
module.exports = mongoose.model('LencolProntaEntrega', LencolProntaEntrega);
