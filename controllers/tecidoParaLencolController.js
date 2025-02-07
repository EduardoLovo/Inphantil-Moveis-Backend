const TecidoParaLencol = require('../models/TecidoParaLencol');
const cloudinary = require('../config/cloudinaryConfig'); // Importe o Cloudinary

// Função para obter todos os tecido do banco de dados
const getAllTecidoParaLencol = async (req, res) => {
    try {
        const tecidoParaLencol = await TecidoParaLencol.find();
        res.status(200).json(tecidoParaLencol);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar tecido',
            error: error.message,
        });
    }
};

// Função para obter um tecido por ID
const getTecidoParaLencolById = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do tecido a ser buscado

        // Busca o tecido no banco de dados pelo ID
        const tecidoParaLencol = await TecidoParaLencol.findById(id);

        // Verifica se o tecido foi encontrado
        if (!tecidoParaLencol) {
            return res.status(404).json({ message: 'Tecido não encontrado' });
        }

        // Retorna o tecido encontrado
        res.status(200).json(tecidoParaLencol);
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao buscar tecido por ID',
            error: error.message,
        });
    }
};

// Função para criar um novo tecido no banco de dados
const createTecidoParaLencol = async (req, res) => {
    try {
        // Verifica se todos os campos obrigatórios foram preenchidos na requisição
        if (
            !req.body.cor ||
            !req.file ||
            !req.body.quantidade ||
            !req.body.estoque
        ) {
            res.send('Preencha todos os campos');
        }
        // Extrai os dados do corpo da requisição
        const { cor, quantidade, estoque } = req.body;

        // Faz o upload da imagem para o Cloudinary diretamente do buffer
        await cloudinary.uploader
            .upload_stream(
                { resource_type: 'auto' }, // Permite upload de imagens e outros tipos de arquivo
                async (error, result) => {
                    if (error) {
                        throw new Error('Erro ao fazer upload da imagem');
                    }

                    const imagemUrl = result.secure_url; // URL da imagem no Cloudinary

                    // Cria um novo tecido no banco de dados com a URL da imagem
                    const novoTecido = await TecidoParaLencol.create({
                        cor,
                        imagem: imagemUrl, // Usa a URL do Cloudinary
                        quantidade,
                        estoque,
                    });

                    // Retorna uma resposta de sucesso
                    res.status(201).json({
                        message: 'Aplique adicionado com sucesso',
                        data: novoTecido,
                    });
                }
            )
            .end(req.file.buffer); // Envia o buffer da imagem para o Cloudinary
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao criar tecido',
            error: error.message,
        });
    }
};

// Função para atualizar um tecido
const updateTecidoParaLencol = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar o tecido atual antes da atualização
        const tecidoParaLencolAtual = await TecidoParaLencol.findById(id);
        if (!tecidoParaLencolAtual) {
            return res.status(404).json({ message: 'Tecido não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};

        if (req.body.cor && req.body.cor !== tecidoParaLencolAtual.cor) {
            updates.cor = req.body.cor;
        }

        if (
            req.body.quantidade &&
            parseInt(req.body.quantidade, 10) !==
                tecidoParaLencolAtual.quantidade
        ) {
            updates.quantidade = parseInt(req.body.quantidade, 10);
        }

        if (req.body.estoque !== undefined) {
            const estoqueBoolean = req.body.estoque === 'true';
            if (estoqueBoolean !== tecidoParaLencolAtual.estoque) {
                updates.estoque = estoqueBoolean;
            }
        }

        // Se nenhum campo foi alterado, retorna sem atualizar
        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const tecidoParaLencolAtualizado =
            await TecidoParaLencol.findByIdAndUpdate(id, updates, {
                new: true,
            });

        res.status(200).json({
            message: 'Tecido atualizado com sucesso',
            data: tecidoParaLencolAtualizado,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar tecido',
            error: error.message,
        });
    }
};

// Função para deletar um tecido
const deleteTecidoParaLencol = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do tecido a ser deletado

        // Verifica se o tecido existe no banco de dados
        const tecidoParaLencol = await TecidoParaLencol.findById(id);
        if (!tecidoParaLencol) {
            return res.status(404).json({ message: 'Tecido não encontrado' });
        }

        // Excluir a imagem do Cloudinary (se existir)
        if (tecidoParaLencol.imagem) {
            const publicId = tecidoParaLencol.imagem
                .split('/')
                .pop()
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Exclui a imagem do Cloudinary
        }

        // Remove o tecido do banco de dados
        await TecidoParaLencol.findByIdAndDelete(id);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: 'Tecido deletado com sucesso' });
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao deletar tecido',
            error: error.message,
        });
    }
};

// Exporta as funções para serem usadas em outros módulos
module.exports = {
    getAllTecidoParaLencol,
    getTecidoParaLencolById,
    createTecidoParaLencol,
    updateTecidoParaLencol,
    deleteTecidoParaLencol,
};
