const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, required: true },
});

// Criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.senha);
};

module.exports = mongoose.model('Usuario', userSchema);
