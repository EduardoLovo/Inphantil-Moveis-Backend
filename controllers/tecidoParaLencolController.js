const fs = require('fs'); // Importa o módulo fs para manipulação de arquivos
const path = require('path');
const calcularHashArquivo = require('../config/calcularHash');
const TecidoParaLencol = require('../models/TecidoParaLencol');

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
        } else {
            // Extrai os dados do corpo da requisição
            const { cor, quantidade, estoque } = req.body;

            // Obtém o caminho da imagem salva pelo multer, ajustando o caminho para o formato correto
            const imagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            // Cria um novo tecido no banco de dados
            const novoTecidoParaLencol = await TecidoParaLencol.create({
                cor,
                imagem,
                quantidade,
                estoque,
            });

            // Retorna uma resposta de sucesso
            res.status(201).json({
                message: 'Tecido adicionado com sucesso',
                data: novoTecidoParaLencol,
            });
        }
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

        if (req.file) {
            const novaImagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            const imagemAntiga = tecidoParaLencolAtual.imagem;

            // Comparando caminhos absolutos
            const caminhoNovaImagem = path.resolve(novaImagem);
            const caminhoImagemAntiga = path.resolve(imagemAntiga);

            // Calcular os hashes das imagens
            const hashNovaImagem = calcularHashArquivo(caminhoNovaImagem);
            const hashImagemAntiga = calcularHashArquivo(caminhoImagemAntiga);

            if (hashNovaImagem !== hashImagemAntiga) {
                updates.imagem = novaImagem;

                // Remover a imagem antiga do servidor
                fs.unlink(imagemAntiga, (err) => {
                    if (err)
                        console.error('Erro ao deletar imagem antiga:', err);
                });
            } else {
                // Se a imagem é a mesma, remove a nova imagem enviada
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

        // Obtém o caminho da imagem associada ao tecido
        const imagemPath = tecidoParaLencol.imagem;

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
