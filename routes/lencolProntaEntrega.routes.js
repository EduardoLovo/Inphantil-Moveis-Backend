const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const LencolProntaEntregaController = require('../controllers/lencolProntaEntregaController'); // Importa o modelo

routes.get('/', LencolProntaEntregaController.getAllLencolProntaEntrega);
routes.get(
    '/getById/:id',
    LencolProntaEntregaController.getLencolProntaEntregaById
);
routes.post(
    '/create',
    upload.single('imagem'),
    LencolProntaEntregaController.createLencolProntaEntrega
);
routes.patch(
    '/updateOne/:id',
    upload.single('imagem'),
    LencolProntaEntregaController.updateLencolProntaEntrega
);

module.exports = routes;
