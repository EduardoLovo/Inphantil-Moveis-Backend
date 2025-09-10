if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

// Cache global para a conexão
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        // Conexão já existe, retorna ela
        return cached.conn;
    }

    if (!cached.promise) {
        const dbUser = process.env.DB_USER;
        const dbPass = process.env.DB_PASS;

        const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPass}@cluster0.9qskv.mongodb.net/Inphantil?retryWrites=true&w=majority`;

        // Adicione opções de conexão para melhor performance
        const opts = {
            bufferCommands: false, // Desativa buffering de comandos
            maxPoolSize: 10, // Limite de conexões no pool
            serverSelectionTimeoutMS: 5000, // Timeout de 5 seg para seleção do servidor
            socketTimeoutMS: 45000, // Timeout de 45 seg para sockets
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectToDatabase;
