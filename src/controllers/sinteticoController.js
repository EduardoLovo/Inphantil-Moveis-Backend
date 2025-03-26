const Sintetico = require('../models/Sintetico');
const cloudinary = require('../config/cloudinaryConfig'); // Importe o Cloudinary

// Função para obter todos os sintetico do banco de dados
const getAllSintetico = async (req, res) => {
    try {
        const sintetico = await Sintetico.find();
        res.status(200).json(sintetico);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar sintetico',
            error: error.message,
        });
    }
};

// Função para obter um sintetico por ID
const getSinteticoById = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do sintetico a ser buscado

        // Busca o sintetico no banco de dados pelo ID
        const sintetico = await Sintetico.findById(id);

        // Verifica se o sintetico foi encontrado
        if (!sintetico) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        // Retorna o sintetico encontrado
        res.status(200).json(sintetico);
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao buscar sintetico por ID',
            error: error.message,
        });
    }
};

// Função para criar um novo sintetico no banco de dados
const createSintetico = async (req, res) => {
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
        const sinteticoExistente = await Sintetico.findOne({ codigo });
        if (sinteticoExistente) {
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

                    // Cria um novo sintetico no banco de dados com a URL da imagem
                    const novoSintetico = await Sintetico.create({
                        codigo,
                        imagem: imagemUrl, // Usa a URL do Cloudinary
                        estoque,
                        cor,
                    });

                    // Retorna uma resposta de sucesso
                    res.status(201).json({
                        message: 'Sintetico adicionado com sucesso',
                        data: novoSintetico,
                    });
                }
            )
            .end(req.file.buffer); // Envia o buffer da imagem para o Cloudinary
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao criar sintetico',
            error: error.message,
        });
    }
};

// Função para atualizar um sintetico
const updateSintetico = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar o sintetico atual antes da atualização
        const sinteticoAtual = await Sintetico.findById(id);
        if (!sinteticoAtual) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};

        if (req.body.codigo && req.body.codigo !== sinteticoAtual.codigo) {
            updates.codigo = req.body.codigo;
        }
        if (req.body.imagem && req.body.imagem !== sinteticoAtual.imagem) {
            updates.imagem = req.body.imagem;
        }

        if (req.body.estoque !== undefined) {
            const estoqueBoolean =
                typeof req.body.estoque === 'boolean'
                    ? req.body.estoque
                    : req.body.estoque === 'true';
            if (estoqueBoolean !== Boolean(sinteticoAtual.estoque)) {
                updates.estoque = estoqueBoolean;
            }
        }

        if (req.body.cor && req.body.cor !== sinteticoAtual.cor) {
            updates.cor = req.body.cor;
        }

        // Se nenhum campo foi alterado, retorna sem atualizar
        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const sinteticoAtualizado = await Sintetico.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        res.status(200).json({
            message: 'Sintetico atualizado com sucesso',
            data: sinteticoAtualizado,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar sintetico',
            error: error.message,
        });
    }
};

// Função para deletar um sintetico
const deleteSintetico = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do sintetico a ser deletado

        // Verifica se o sintetico existe no banco de dados
        const sintetico = await Sintetico.findById(id);
        if (!sintetico) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        // Excluir a imagem do Cloudinary (se existir)
        if (sintetico.imagem) {
            const publicId = sintetico.imagem.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Exclui a imagem do Cloudinary
        }

        // Remove o sintetico do banco de dados
        await Sintetico.findByIdAndDelete(id);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: 'Sintetico deletado com sucesso' });
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao deletar sintetico',
            error: error.message,
        });
    }
};

// Exporta as funções para serem usadas em outros módulos
module.exports = {
    getAllSintetico,
    getSinteticoById,
    createSintetico,
    updateSintetico,
    deleteSintetico,
};
