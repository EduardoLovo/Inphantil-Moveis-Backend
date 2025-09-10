const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const connectToDatabase = require('./src/config/db.js');

const apliquesRouter = require('./src/routes/apliques.routes.js');
const lencolProntaEntregaRouter = require('./src/routes/lencolProntaEntrega.routes.js');
const tecidoParaLencolRouter = require('./src/routes/tecidoParaLencol.routes.js');
const sinteticoRouter = require('./src/routes/sintetico.routes.js');
const pantoneRouter = require('./src/routes/pantone.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');

const app = express();

// 🌍 CORS
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://inphantil-moveis.vercel.app',
    'https://www.inphantil-moveis.vercel.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 Conecta ao banco somente uma vez por instância
connectToDatabase()
    .then(() => console.log('🚀 Banco conectado!'))
    .catch((err) => {
        console.error('❌ Erro ao conectar ao banco:', err);
    });

// 🌐 Rotas
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Inphantil Moveis API!' });
});

app.use('/', authRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/aplique', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntregaRouter);
app.use('/tecido-para-lencol', tecidoParaLencolRouter);
app.use('/sintetico', sinteticoRouter);
app.use('/pantone', pantoneRouter);

// 🔄 Exporta como função serverless (para Vercel)
module.exports = serverless(app);
