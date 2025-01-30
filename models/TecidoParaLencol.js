const mongoose = require('mongoose');

const TecidoParaLencolSchema = new mongoose.Schema(
    {
        cor: {
            type: String,
            require: true, // Campo obrigatório
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
        quantidade: {
            type: Number,
            required: true, // Campo obrigatório
            min: [0, 'A quantidade não pode ser negativa'], // Validação para evitar valores negativos
        },
        estoque: {
            type: Boolean,
            required: true, // Campo obrigatório
        },
    },
    {
        timestamps: true, // Adiciona campos "createdAt" e "updatedAt"
    }
);

module.exports = mongoose.model('TecidoParaLencol', TecidoParaLencolSchema);
