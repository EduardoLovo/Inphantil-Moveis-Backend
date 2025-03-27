const mongoose = require('mongoose');

const SinteticoSchema = new mongoose.Schema(
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
        estoque: {
            type: Boolean,
            default: true,
            required: true, // Campo obrigatório
        },
        cor: {
            type: String,
            required: true, // Campo obrigatório
            trim: true, // Remove espaços no início e no fim
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

module.exports = mongoose.model('Sintetico', SinteticoSchema);
