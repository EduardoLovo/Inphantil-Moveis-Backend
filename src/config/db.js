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
            bufferCommands: false,
            maxPoolSize: 5, // Reduzir o pool
            serverSelectionTimeoutMS: 3000, // 3 segundos
            socketTimeoutMS: 5000, // 5 segundos
            connectTimeoutMS: 3000, // 3 segundos
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
