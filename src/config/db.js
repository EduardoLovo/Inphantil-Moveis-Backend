if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

// Variável para armazenar a conexão do banco de dados em cache
let cachedDb = null;

// Credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// Conexão com banco de dados MongoDB Atlas
async function connectToDatabase() {
    // Se a conexão já estiver em cache, retorne-a imediatamente
    if (cachedDb) {
        console.log('Usando a conexão do banco de dados em cache');
        return cachedDb;
    }

    try {
        // Se não houver conexão em cache, crie uma nova
        const db = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPass}@cluster0.9qskv.mongodb.net/`,
            {
                dbName: `Inphantil`,
                // Opções adicionais para otimizar a conexão
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        // Armazene a nova conexão em cache
        cachedDb = db;
        console.log('Conectado a um novo banco de dados');
        return cachedDb;
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        throw new Error('Falha na conexão do banco de dados.');
    }
}

module.exports = connectToDatabase;
