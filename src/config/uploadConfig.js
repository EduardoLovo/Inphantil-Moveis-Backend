const multer = require('multer');

// Configuração do armazenamento
const storage = multer.memoryStorage(); // Armazena o arquivo na memória como um buffer

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
        file.originalname.toLowerCase().split('.').pop() // Extrai a extensão do arquivo
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

module.exports = upload;
