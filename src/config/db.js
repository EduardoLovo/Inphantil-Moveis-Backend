if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');

// Cache global (importante para Vercel serverless)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        // Já existe conexão ativa
        return cached.conn;
    }

    if (!cached.promise) {
        const dbUser = process.env.DB_USER;
        const dbPass = process.env.DB_PASS;

        const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPass}@cluster0.9qskv.mongodb.net/Inphantil`;

        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false, // evita problemas em serverless
            })
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
