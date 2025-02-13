const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar um novo usuário
const register = async (req, res) => {
    try {
        const { usuario, senha, tipo } = req.body;
        const user = new User({ usuario, senha, tipo });
        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar usuário', error });
    }
};

// Fazer login
const login = async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        const user = await User.findOne({ usuario });

        if (!user || !(await user.comparePassword(senha))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro no login:', error); // Log detalhado do erro
        res.status(500).json({
            message: 'Erro ao fazer login',
            error: error.message,
        });
    }
};

module.exports = { register, login };
