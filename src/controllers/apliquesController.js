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
            !req.body.imagem ||
            !req.body.quantidade ||
            !req.body.estoque ||
            !req.body.ordem
        ) {
            res.send('Preencha todos os campos');
        }
        // Extrai os dados do corpo da requisição
        const { codigo, imagem, quantidade, estoque, ordem } = req.body;

        // Verifica se o código já existe no banco
        const apliqueExistente = await Apliques.findOne({ codigo });
        if (apliqueExistente) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        const novoAplique = await Apliques.create({
            cor,
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

        // Buscar o aplique atual antes da atualização
        const apliqueAtual = await Apliques.findById(id);
        if (!apliqueAtual) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};

        console.log(req.body);

        if (req.body.codigo && req.body.codigo !== apliqueAtual.codigo) {
            updates.codigo = req.body.codigo;
        }
        // Verifica se uma nova imagem foi enviada e se é diferente da atual
        if (req.body.imagem && req.body.imagem !== apliqueAtual.imagem) {
            updates.imagem = req.body.imagem;
        }

        if (
            req.body.quantidade &&
            parseInt(req.body.quantidade, 10) !== apliqueAtual.quantidade
        ) {
            updates.quantidade = parseInt(req.body.quantidade, 10);
        }

        if (req.body.estoque !== undefined) {
            const estoqueBoolean =
                typeof req.body.estoque === 'boolean'
                    ? req.body.estoque
                    : req.body.estoque === 'true';

            if (estoqueBoolean !== Boolean(apliqueAtual.estoque)) {
                updates.estoque = estoqueBoolean;
            }
        }

        if (
            req.body.ordem &&
            parseInt(req.body.ordem, 10) !== apliqueAtual.ordem
        ) {
            updates.ordem = parseInt(req.body.ordem, 10);
        }

        console.log(updates);

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

// Função para deletar um aplique
const deleteAplique = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do aplique a ser deletado

        // Verifica se o aplique existe no banco de dados
        const aplique = await Apliques.findById(id);
        if (!aplique) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
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
