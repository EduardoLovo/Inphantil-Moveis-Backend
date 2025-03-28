const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const LencolProntaEntregaController = require('../controllers/lencolProntaEntregaController'); // Importa o modelo
const authMiddleware = require('../middlewares/authMiddleware');

routes.get('/', LencolProntaEntregaController.getAllLencolProntaEntrega);
routes.get(
    '/getById/:id',
    LencolProntaEntregaController.getLencolProntaEntregaById
);
routes.post(
    '/create',
    authMiddleware,
    LencolProntaEntregaController.createLencolProntaEntrega
);
routes.patch(
    '/updateOne/:id',
    authMiddleware,
    LencolProntaEntregaController.updateLencolProntaEntrega
);
routes.delete(
    '/deleteOne/:id',
    authMiddleware,
    LencolProntaEntregaController.deleteLencolProntaEntrega
);

module.exports = routes;
