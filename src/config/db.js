if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

// Variável para armazenar a conexão do banco de dados em cache
let cachedDb = null;

// Credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

async function connectToDatabase() {
    // Se já existe conexão aberta e ativa, usa ela
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('📌 Usando conexão já existente');
        return cachedDb;
    }

    try {
        // Cria nova conexão
        const db = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPass}@cluster0.9qskv.mongodb.net/`,
            {
                dbName: 'Inphantil',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        cachedDb = db;
        console.log('✅ Conectado a um novo banco de dados');
        return cachedDb;
    } catch (err) {
        console.error('❌ Erro ao conectar ao MongoDB:', err);
        throw new Error('Falha na conexão do banco de dados.');
    }
}

module.exports = connectToDatabase;
