const fs = require('fs'); // Importa o módulo fs para manipulação de arquivos
const path = require('path');
const calcularHashArquivo = require('../config/calcularHash');
const LencolProntaEntrega = require('../models/LencolProntaEntrega');

// Função para obter todos os lençois do banco de dados
const getAllLencolProntaEntrega = async (req, res) => {
    try {
        const lencolProntaEntrega = await LencolProntaEntrega.find();
        res.status(200).json(lencolProntaEntrega);
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar lençol',
            error: error.message,
        });
    }
};

// Função para obter um lençol por ID
const getLencolProntaEntregaById = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do lençol a ser buscado

        // Busca o lençol no banco de dados pelo ID
        const lencolProntaEntrega = await LencolProntaEntrega.findById(id);

        // Verifica se o lençol foi encontrado
        if (!lencolProntaEntrega) {
            return res.status(404).json({ message: 'Lençol não encontrado' });
        }

        // Retorna o lençol encontrado
        res.status(200).json(lencolProntaEntrega);
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao buscar lençol por ID',
            error: error.message,
        });
    }
};

// Função para criar um novo lençol no banco de dados
const createLencolProntaEntrega = async (req, res) => {
    try {
        // Verifica se todos os campos obrigatórios foram preenchidos na requisição
        if (
            !req.body.codigo ||
            !req.file ||
            !req.body.quantidade ||
            !req.body.cor ||
            !req.body.tamanho
        ) {
            res.send('Preencha todos os campos');
        } else {
            // Extrai os dados do corpo da requisição
            const { codigo, quantidade, cor, tamanho } = req.body;

            // Obtém o caminho da imagem salva pelo multer, ajustando o caminho para o formato correto
            const imagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            // Cria um novo lençol no banco de dados
            const novoLencolProntaEntrega = await LencolProntaEntrega.create({
                codigo,
                imagem,
                quantidade,
                cor,
                tamanho,
            });

            // Retorna uma resposta de sucesso
            res.status(201).json({
                message: 'Lençol adicionado com sucesso',
                data: novoLencolProntaEntrega,
            });
        }
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao criar lençol',
            error: error.message,
        });
    }
};

// Função para atualizar um lençol
const updateLencolProntaEntrega = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar o lençol atual antes da atualização
        const lencolProntaEntregaAtual = await LencolProntaEntrega.findById(id);
        if (!lencolProntaEntregaAtual) {
            return res.status(404).json({ message: 'Lençol não encontrado' });
        }

        // Criar objeto de updates apenas com valores que mudaram
        const updates = {};

        if (
            req.body.codigo &&
            req.body.codigo !== lencolProntaEntregaAtual.codigo
        ) {
            updates.codigo = req.body.codigo;
        } else {
            ('diferente');
        }

        if (
            req.body.quantidade &&
            parseInt(req.body.quantidade, 10) !==
                lencolProntaEntregaAtual.quantidade
        ) {
            updates.quantidade = parseInt(req.body.quantidade, 10);
        }

        if (req.body.cor && req.body.cor !== lencolProntaEntregaAtual.cor) {
            updates.cor = req.body.cor;
        }

        if (
            req.body.tamanho &&
            req.body.tamanho !== lencolProntaEntregaAtual.tamanho
        ) {
            updates.tamanho = req.body.tamanho;
        }

        if (req.file) {
            const novaImagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            const imagemAntiga = lencolProntaEntregaAtual.imagem;

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

        const lencolProntaEntrega = await LencolProntaEntrega.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        res.status(200).json({
            message: 'Lençol atualizado com sucesso',
            data: lencolProntaEntrega,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar lençol',
            error: error.message,
        });
    }
};

// Função para deletar um lençol
const deleteLencolProntaEntrega = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do aplique a ser deletado

        // Verifica se o aplique existe no banco de dados
        const lencolProntaEntrega = await LencolProntaEntrega.findById(id);
        if (!lencolProntaEntrega) {
            return res.status(404).json({ message: 'Lençol não encontrado' });
        }

        // Obtém o caminho da imagem associada ao lençol
        const imagemPath = lencolProntaEntrega.imagem;

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
        await LencolProntaEntrega.findByIdAndDelete(id);

        // Retorna uma resposta de sucesso
        res.status(200).json({
            message: 'Lençol deletado com sucesso',
        });
    } catch (error) {
        // Em caso de erro, retorna um erro 500 com a mensagem
        res.status(500).json({
            message: 'Erro ao deletar lençol',
            error: error.message,
        });
    }
};

module.exports = {
    getAllLencolProntaEntrega,
    getLencolProntaEntregaById,
    createLencolProntaEntrega,
    updateLencolProntaEntrega,
    deleteLencolProntaEntrega,
};
