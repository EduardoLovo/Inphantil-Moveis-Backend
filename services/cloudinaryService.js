const cloudinary = require('../config/cloudinaryConfig');

const uploadImageToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        console.log('Upload realizado com sucesso:', result.secure_url);
        return result.secure_url; // Retorna a URL da imagem
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
};

module.exports = uploadImageToCloudinary;
