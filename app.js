const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./src/config/db.js');

// Importa as rotas
const apliquesRouter = require('./src/routes/apliques.routes.js');
const lencolProntaEntregaRouter = require('./src/routes/lencolProntaEntrega.routes.js');
const tecidoParaLencolRouter = require('./src/routes/tecidoParaLencol.routes.js');
const sinteticoRouter = require('./src/routes/sintetico.routes.js');
const pantoneRouter = require('./src/routes/pantone.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');

const app = express();

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
app.use('/uploads', express.static('uploads'));
app.use('/aplique', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntregaRouter);
app.use('/tecido-para-lencol', tecidoParaLencolRouter);
app.use('/sintetico', sinteticoRouter);
app.use('/pantone', pantoneRouter);

// ⚠️ Não usar app.listen aqui!
// Apenas exporta
module.exports = app;
