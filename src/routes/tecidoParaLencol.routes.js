const routes = require('express').Router();
const TecidoParaLencolController = require('../controllers/tecidoParaLencolController'); // Importa o modelo
const authMiddleware = require('../middlewares/authMiddleware');

routes.get('/', TecidoParaLencolController.getAllTecidoParaLencol);
routes.get('/getById/:id', TecidoParaLencolController.getTecidoParaLencolById);
routes.post(
    '/create',
    authMiddleware,
    TecidoParaLencolController.createTecidoParaLencol
);
routes.patch(
    '/updateOne/:id',
    authMiddleware,
    TecidoParaLencolController.updateTecidoParaLencol
);
routes.delete(
    '/deleteOne/:id',
    authMiddleware,
    TecidoParaLencolController.deleteTecidoParaLencol
);

module.exports = routes;
