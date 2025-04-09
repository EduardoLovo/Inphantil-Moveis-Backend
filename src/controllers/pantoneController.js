const Pantone = require('../models/Pantone');

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
            !req.body.imagem ||
            !req.body.estoque ||
            !req.body.cor
        ) {
            return res
                .status(400)
                .json({ message: 'Preencha todos os campos' });
        }
        // Extrai os dados do corpo da requisição
        const { codigo, imagem, estoque, cor } = req.body;

        // Verifica se o código já existe no banco
        const pantoneExistente = await Pantone.findOne({ codigo });
        if (pantoneExistente) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        const novoPantone = await Pantone.create({
            codigo,
            imagem,
            quantidade,
            cor,
            tamanho,
        });

        // Retorna uma resposta de sucesso
        res.status(201).json({
            message: 'Pantone adicionado com sucesso',
            data: novoPantone,
        });
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

        if (req.body.codigo && req.body.codigo !== pantoneAtual.codigo) {
            updates.codigo = req.body.codigo;
        }

        if (req.body.imagem && req.body.imagem !== pantoneAtual.imagem) {
            updates.imagem = req.body.imagem;
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

        if (req.body.cor && req.body.cor !== pantoneAtual.cor) {
            updates.cor = req.body.cor;
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
