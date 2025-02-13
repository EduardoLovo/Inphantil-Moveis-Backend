const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./src/config/db.js'); // Importa a função do db.js
const apliquesRouter = require('./src/routes/apliques.routes.js'); // Importa as rotas de apliques
const lencolProntaEntregaRouter = require('./src/routes/lencolProntaEntrega.routes.js'); // Importa as rotas de apliques
const tecidoParaLencolRouter = require('./src/routes/tecidoParaLencol.routes.js');
const sinteticoRouter = require('./src/routes/sintetico.routes.js');
const pantoneRouter = require('./src/routes/pantone.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');

const app = express();
const port = 3000;

// Configuração básica do CORS
app.use(cors());
app.use(
    cors({
        origin: 'http://localhost:3001', // Especifica a origem do frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
        allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    })
);
// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Inphantil Moveis API!' });
});

// Rota de login
app.use('/', authRoutes);
// Middleware para servir arquivos estáticos (imagens)
app.use('/uploads', express.static('uploads'));
// Totas
app.use('/aplique', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntregaRouter);
app.use('/tecido-para-lencol', tecidoParaLencolRouter);
app.use('/sintetico', sinteticoRouter);
app.use('/pantone', pantoneRouter);

// Conecta ao banco de dados
connectToDatabase();

// Inicia o servidor e exibe uma mensagem no console com a URL onde ele está rodando
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
