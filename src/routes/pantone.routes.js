const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const PantoneController = require('../controllers/pantoneController'); // Importa o modelo
const authMiddleware = require('../middlewares/authMiddleware');

routes.get('/', PantoneController.getAllPantone);
routes.get('/getById/:id', PantoneController.getPantoneById);
routes.post(
    '/create',
    authMiddleware,
    PantoneController.createPantone
);
routes.patch('/updateOne/:id', authMiddleware, PantoneController.updatePantone);
routes.delete(
    '/deleteOne/:id',
    authMiddleware,
    PantoneController.deletePantone
);

module.exports = routes;
