const fs = require('fs'); // Importa o módulo fs para manipulação de arquivos
const Apliques = require('../models/Apliques');

// Função para obter todos os apliques do banco de dados
const getAllApliques = async (req, res) => {
    try {
        const apliques = await Apliques.find();
        res.status(200).json(apliques);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar apliques',
            error: error.message,
        });
    }
};

// Função para obter um aplique por ID
const getApliqueById = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do aplique a ser buscado

        // Busca o aplique no banco de dados pelo ID
        const aplique = await Apliques.findById(id);

        // Verifica se o aplique foi encontrado
        if (!aplique) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        // Retorna o aplique encontrado
        res.status(200).json(aplique);
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao buscar aplique por ID',
            error: error.message,
        });
    }
};

// Função para criar um novo aplique no banco de dados
const createAplique = async (req, res) => {
    try {
        // Verifica se todos os campos obrigatórios foram preenchidos na requisição
        if (
            !req.body.codigo ||
            !req.file ||
            !req.body.quantidade ||
            !req.body.estoque ||
            !req.body.ordem
        ) {
            res.send('Preencha todos os campos');
        } else {
            // Extrai os dados do corpo da requisição
            const { codigo, quantidade, estoque, ordem } = req.body;

            // Obtém o caminho da imagem salva pelo multer, ajustando o caminho para o formato correto
            const imagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            // Cria um novo aplique no banco de dados
            const novoAplique = await Apliques.create({
                codigo,
                imagem,
                quantidade,
                estoque,
                ordem,
            });

            // Retorna uma resposta de sucesso
            res.status(201).json({
                message: 'Aplique adicionado com sucesso',
                data: novoAplique,
            });
        }
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao criar aplique',
            error: error.message,
        });
    }
};

// Função para atualizar um aplique
const updateAplique = async (req, res) => {
    try {
        const { id } = req.params;
        // const updates = {
        //     codigo: req.body.codigo,
        //     quantidade: req.body.quantidade,
        //     estoque: req.body.estoque === 'true', // Convertendo para boolean
        //     ordem: req.body.ordem,
        // };

        // Buscar o aplique atual antes da atualização
        const apliqueAtual = await Apliques.findById(id);
        if (!apliqueAtual) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};
        if (req.body.codigo && req.body.codigo !== apliqueAtual.codigo) {
            updates.codigo = req.body.codigo;
        }
        if (
            req.body.quantidade &&
            parseInt(req.body.quantidade, 10) !== apliqueAtual.quantidade
        ) {
            updates.quantidade = parseInt(req.body.quantidade, 10);
        }
        if (req.body.estoque !== undefined) {
            const estoqueBoolean = req.body.estoque === 'true';
            if (estoqueBoolean !== apliqueAtual.estoque) {
                updates.estoque = estoqueBoolean;
            }
        }
        if (
            req.body.ordem &&
            parseInt(req.body.ordem, 10) !== apliqueAtual.ordem
        ) {
            updates.ordem = parseInt(req.body.ordem, 10);
        }
        if (req.file) {
            const novaImagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );
            if (novaImagem !== apliqueAtual.imagem) {
                updates.imagem = novaImagem;
            } else {
                // Se a imagem é a mesma, removemos o novo arquivo salvo pelo multer
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error('Erro ao deletar imagem repetida:', err);
                });
            }
        }

        // Se nenhum campo foi alterado, retorna sem atualizar
        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const apliqueAtualizado = await Apliques.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        res.status(200).json({
            message: 'Aplique atualizado com sucesso',
            data: apliqueAtualizado,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar aplique',
            error: error.message,
        });
    }
};

const deleteAplique = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do aplique a ser deletado

        // Verifica se o aplique existe no banco de dados
        const aplique = await Apliques.findById(id);
        if (!aplique) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        // Obtém o caminho da imagem associada ao aplique
        const imagemPath = aplique.imagem;

        // Remove o arquivo de imagem do sistema de arquivos, se existir
        if (imagemPath) {
            fs.unlink(imagemPath, (err) => {
                if (err) {
                    console.error('Erro ao deletar a imagem:', err);
                } else {
                    console.log('Imagem deletada com sucesso:', imagemPath);
                }
            });
        }

        // Remove o aplique do banco de dados
        await Apliques.findByIdAndDelete(id);

        // Retorna uma resposta de sucesso
        res.status(200).json({ message: 'Aplique deletado com sucesso' });
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
    getAllApliques,
    getApliqueById,
    createAplique,
    updateAplique,
    deleteAplique,
};
