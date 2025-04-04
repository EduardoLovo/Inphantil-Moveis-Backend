if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

// Credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// Conexão com banco de dados MongoDB Atlas
function connectToDatabase() {
    mongoose
        .connect(
            `mongodb+srv://${dbUser}:${dbPass}@cluster0.9qskv.mongodb.net/`,
            {
                dbName: `Inphantil`,
            }
        )
        .then(() => console.log('Conectado ao MongoDB'))
        .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
}

module.exports = connectToDatabase;
