const Pantone = require('../models/Pantone');
const cloudinary = require('../config/cloudinaryConfig'); // Importe o Cloudinary

// Função para obter todos os pantones do banco de dados
const getAllPantone = async (req, res) => {
    try {
        const pantone = await Pantone.find();
        res.status(200).json(pantone);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar pantone',
            error: error.message,
        });
    }
};

// Função para obter um pantone por ID
const getPantoneById = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do pantone a ser buscado

        // Busca o pantone no banco de dados pelo ID
        const pantone = await Pantone.findById(id);

        // Verifica se o pantone foi encontrado
        if (!pantone) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }

        // Retorna o pantone encontrado
        res.status(200).json(pantone);
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao buscar pantone por ID',
            error: error.message,
        });
    }
};

// Função para criar um novo pantone no banco de dados
const createPantone = async (req, res) => {
    try {
        // Verifica se todos os campos obrigatórios foram preenchidos na requisição
        if (
            !req.body.codigo ||
            !req.file ||
            !req.body.estoque ||
            !req.body.cor
        ) {
            res.send('Preencha todos os campos');
        }
        // Extrai os dados do corpo da requisição
        const { codigo, estoque, cor } = req.body;

        // Verifica se o código já existe no banco
        const pantoneExistente = await Pantone.findOne({ codigo });
        if (pantoneExistente) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        // Faz o upload da imagem para o Cloudinary diretamente do buffer
        await cloudinary.uploader
            .upload_stream(
                { resource_type: 'auto' }, // Permite upload de imagens e outros tipos de arquivo
                async (error, result) => {
                    if (error) {
                        throw new Error('Erro ao fazer upload da imagem');
                    }

                    const imagemUrl = result.secure_url; // URL da imagem no Cloudinary

                    // Cria um novo pantone no banco de dados com a URL da imagem
                    const novoPantone = await Pantone.create({
                        codigo,
                        imagem: imagemUrl, // Usa a URL do Cloudinary
                        estoque,
                        cor,
                    });

                    // Retorna uma resposta de sucesso
                    res.status(201).json({
                        message: 'Pantone adicionado com sucesso',
                        data: novoPantone,
                    });
                }
            )
            .end(req.file.buffer); // Envia o buffer da imagem para o Cloudinary
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao criar pantone',
            error: error.message,
        });
    }
};

// Função para atualizar um pantone
const updatePantone = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar o pantone atual antes da atualização
        const pantoneAtual = await Pantone.findById(id);
        if (!pantoneAtual) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};

        if (req.body.codigo && req.body.codigo !== novoPantoneAtual.codigo) {
            updates.codigo = req.body.codigo;
        }

        if (
            req.body.quantidade &&
            parseInt(req.body.quantidade, 10) !== pantoneAtual.quantidade
        ) {
            updates.quantidade = parseInt(req.body.quantidade, 10);
        }

        if (req.body.estoque !== undefined) {
            const estoqueBoolean =
                typeof req.body.estoque === 'boolean'
                    ? req.body.estoque
                    : req.body.estoque === 'true';

            if (estoqueBoolean !== Boolean(pantoneAtual.estoque)) {
                updates.estoque = estoqueBoolean;
            }
        }

        if (
            req.body.ordem &&
            parseInt(req.body.ordem, 10) !== pantoneAtual.ordem
        ) {
            updates.ordem = parseInt(req.body.ordem, 10);
        }

        // Se nenhum campo foi alterado, retorna sem atualizar
        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const pantoneAtualizado = await Pantone.findByIdAndUpdate(id, updates, {
            new: true,
        });

        res.status(200).json({
            message: 'Pantone atualizado com sucesso',
            data: pantoneAtualizado,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar pantone',
            error: error.message,
        });
    }
};

// Função para deletar um pantone
const deletePantone = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do pantone a ser deletado

        // Verifica se o pantone existe no banco de dados
        const pantone = await Pantone.findById(id);
        if (!pantone) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }

        // Excluir a imagem do Cloudinary (se existir)
        if (pantone.imagem) {
            const publicId = pantone.imagem.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Exclui a imagem do Cloudinary
        }

        // Remove o pantone do banco de dados
        await Pantone.findByIdAndDelete(id);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: 'Pantone deletado com sucesso' });
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao deletar aplique',
            error: error.message,
        });
    }
};

// Exporta as funções para serem usadas em outros módulos
module.exports = {
    getAllPantone,
    getPantoneById,
    createPantone,
    updatePantone,
    deletePantone,
};
