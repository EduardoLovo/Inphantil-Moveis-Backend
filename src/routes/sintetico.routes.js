const routes = require('express').Router();
const upload = require('../config/uploadConfig'); // Importa a configuração do multer
const SinteticoController = require('../controllers/sinteticoController'); // Importa o modelo
const authMiddleware = require('../middlewares/authMiddleware');

routes.get('/', SinteticoController.getAllSintetico);
routes.get('/getById/:id', SinteticoController.getSinteticoById);
routes.post('/create', authMiddleware, SinteticoController.createSintetico);
routes.patch(
    '/updateOne/:id',
    authMiddleware,
    SinteticoController.updateSintetico
);
routes.delete(
    '/deleteOne/:id',
    authMiddleware,
    SinteticoController.deleteSintetico
);

module.exports = routes;
