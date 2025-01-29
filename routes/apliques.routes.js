const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const ApliqueController = require('../controllers/apliquesController'); // Importa o modelo

routes.get('/', ApliqueController.getAllApliques);
routes.get('/getById/:id', ApliqueController.getApliqueById);
routes.post(
    '/create',
    upload.single('imagem'),
    ApliqueController.createAplique
);
routes.patch(
    '/updateOne/:id',
    upload.single('imagem'),
    ApliqueController.updateAplique
);
routes.delete('/deleteOne/:id', ApliqueController.deleteAplique);

module.exports = routes;
