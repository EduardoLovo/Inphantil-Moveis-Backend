const express = require('express');
const connectToDatabase = require('./config/db.js'); // Importa a função do db.js
const apliquesRouter = require('./routes/apliques.routes.js'); // Importa as rotas de apliques
const lencolProntaEntregaRouter = require('./routes/lencolProntaEntrega.routes.js'); // Importa as rotas de apliques
const tecidoParaLencolRouter = require('./routes/tecidoParaLencol.routes.js');
const sinteticoRouter = require('./routes/sintetico.routes.js');
const authRoutes = require('./routes/auth.routes.js');

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de login
app.use('/', authRoutes);
// Middleware para servir arquivos estáticos (imagens)
app.use('/uploads', express.static('uploads'));
// Usar as rotas de apliques
app.use('/apliques', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntregaRouter);
app.use('/tecido-para-lencol', tecidoParaLencolRouter);
app.use('/sintetico', sinteticoRouter);

// Conecta ao banco de dados
connectToDatabase();

// Inicia o servidor e exibe uma mensagem no console com a URL onde ele está rodando
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
