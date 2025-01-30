const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const TecidoParaLencolController = require('../controllers/tecidoParaLencolController'); // Importa o modelo

routes.get('/', TecidoParaLencolController.getAllTecidoParaLencol);
routes.get('/getById/:id', TecidoParaLencolController.getTecidoParaLencolById);
routes.post(
    '/create',
    upload.single('imagem'),
    TecidoParaLencolController.createTecidoParaLencol
);
routes.patch(
    '/updateOne/:id',
    upload.single('imagem'),
    TecidoParaLencolController.updateTecidoParaLencol
);
routes.delete(
    '/deleteOne/:id',
    TecidoParaLencolController.deleteTecidoParaLencol
);

module.exports = routes;
