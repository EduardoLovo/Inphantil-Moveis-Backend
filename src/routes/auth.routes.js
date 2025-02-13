if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    `/${process.env.ROTA_PARA_REGISTO}/registro`,
    authController.register
);
router.post('/login', authController.login);

module.exports = router;
