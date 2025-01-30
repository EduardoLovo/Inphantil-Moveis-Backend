const express = require('express');
const connectToDatabase = require('./config/db.js'); // Importa a função do db.js
const apliquesRouter = require('./routes/apliques.routes.js'); // Importa as rotas de apliques
const lencolProntaEntrega = require('./routes/lencolProntaEntrega.routes.js'); // Importa as rotas de apliques
const tecidoParaLencol = require('./routes/tecidoParaLencol.routes.js');

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos (imagens)
app.use('/uploads', express.static('uploads'));

// Usar as rotas de apliques
app.use('/apliques', apliquesRouter);
app.use('/lencol-pronta-entrega', lencolProntaEntrega);
app.use('/tecido-para-lencol', tecidoParaLencol);

// Conecta ao banco de dados
connectToDatabase();

// Inicia o servidor e exibe uma mensagem no console com a URL onde ele está rodando
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
