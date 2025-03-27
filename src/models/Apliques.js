const mongoose = require('mongoose');

const ApliquesSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true, // Campo obrigatório
            unique: true, // Código deve ser único
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
        estoque: {
            type: Boolean,
            default: true,
            required: true, // Campo obrigatório
        },
        ordem: {
            type: Number,
            required: true, // Campo obrigatório
            min: [1, 'A ordem deve ser no mínimo 1'], // Ordem mínima como exemplo
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

// Exporta o modelo
module.exports = mongoose.model('Apliques', ApliquesSchema);
