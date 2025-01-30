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
            validate: {
                validator: function (v) {
                    return /^(uploads\/|https?:\/\/)/.test(v); // Valida se é um caminho ou URL válido
                },
                message: 'O campo "imagem" deve ser um caminho ou URL válido',
            },
        },
        estoque: {
            type: Boolean,
            required: true, // Campo obrigatório
        },
        cor: {
            type: String,
            require: true, // Campo obrigatório
            trim: true, // Remove espaços no início e no fim
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

module.exports = mongoose.model('Sintetico', SinteticoSchema);
