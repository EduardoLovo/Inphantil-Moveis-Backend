const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/db.js');

// Importa as rotas
const apliquesRouter = require('./routes/apliques.routes.js');
const lencolProntaEntregaRouter = require('./routes/lencolProntaEntrega.routes.js');
const tecidoParaLencolRouter = require('./routes/tecidoParaLencol.routes.js');
const sinteticoRouter = require('./routes/sintetico.routes.js');
const pantoneRouter = require('./routes/pantone.routes.js');
const authRoutes = require('./routes/auth.routes.js');

const app = express();

const PORT = 3000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://inphantil-moveis.vercel.app',
    'https://www.inphantil-moveis.vercel.app',
];

const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// conecta com o banco (uma vez por invocação)
connectToDatabase()
    .then(() => console.log('✅ Conectado ao banco de dados!'))
    .catch((err) => console.error('❌ Erro ao conectar ao banco:', err));

// Rota pública
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Inphantil Moveis API!' });
});

// Rotas
app.use('/', authRoutes);
app.use('/aplique', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntregaRouter);
app.use('/tecido-para-lencol', tecidoParaLencolRouter);
app.use('/sintetico', sinteticoRouter);
app.use('/pantone', pantoneRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
