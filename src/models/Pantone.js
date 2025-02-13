const mongoose = require('mongoose');

const PantoneSchema = new mongoose.Schema(
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
            validate: {
                validator: function (v) {
                    return /^(uploads\/|https?:\/\/)/.test(v); // Valida se é um caminho ou URL válido
                },
                message: 'O campo "imagem" deve ser um caminho ou URL válido',
            },
        },

        estoque: {
            type: Boolean,
            default: true,
            required: true, // Campo obrigatório
        },
        cor: {
            type: String,
            required: true, // Campo obrigatório
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

// Exporta o modelo
module.exports = mongoose.model('Pantone', PantoneSchema);
