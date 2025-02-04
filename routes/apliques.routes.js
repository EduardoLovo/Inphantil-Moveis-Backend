const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const ApliqueController = require('../controllers/apliquesController'); // Importa o modelo
const authMiddleware = require('../middlewares/authMiddleware');

routes.get('/', ApliqueController.getAllApliques);
routes.get('/getById/:id', ApliqueController.getApliqueById);
routes.post(
    '/create',
    authMiddleware,
    upload.single('imagem'),
    ApliqueController.createAplique
);
routes.patch('/updateOne/:id', authMiddleware, ApliqueController.updateAplique);
routes.delete(
    '/deleteOne/:id',
    authMiddleware,
    ApliqueController.deleteAplique
);

module.exports = routes;
