const fs = require('fs'); // Importa o módulo fs para manipulação de arquivos
const path = require('path');
const calcularHashArquivo = require('../config/calcularHash');
const Sintetico = require('../models/Sintetico');

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
        } else {
            // Extrai os dados do corpo da requisição
            const { codigo, estoque, cor } = req.body;

            // Obtém o caminho da imagem salva pelo multer, ajustando o caminho para o formato correto
            const imagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            // Cria um novo sintetico no banco de dados
            const novoSintetico = await Sintetico.create({
                codigo,
                imagem,
                estoque,
                cor,
            });

            // Retorna uma resposta de sucesso
            res.status(201).json({
                message: 'Sintetico adicionado com sucesso',
                data: novoSintetico,
            });
        }
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

        if (req.body.estoque !== undefined) {
            const estoqueBoolean = req.body.estoque === 'true';
            if (estoqueBoolean !== sinteticoAtual.estoque) {
                updates.estoque = estoqueBoolean;
            }
        }

        if (req.body.cor && req.body.cor !== sinteticoAtual.cor) {
            updates.cor = req.body.cor;
        }

        if (req.file) {
            const novaImagem = req.file.path.replace(
                /^.*[\\\/]uploads[\\\/]/,
                'uploads/'
            );

            const imagemAntiga = sinteticoAtual.imagem;

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

        // Obtém o caminho da imagem associada ao sintetico
        const imagemPath = sintetico.imagem;

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
