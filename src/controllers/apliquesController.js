const Apliques = require('../models/Apliques');

// Converte valores vindos do front (string/boolean/etc.) para boolean real
function toBoolean(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
        const v = val.trim().toLowerCase();
        if (['true', '1', 'sim', 'yes'].includes(v)) return true;
        if (['false', '0', 'nao', 'não', 'no'].includes(v)) return false;
    }
    return undefined; // sinaliza inválido
}

// Converte número (string/number) em number; retorna undefined se inválido
function toNumber(val) {
    if (typeof val === 'number' && Number.isFinite(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') {
        const n = Number(val);
        if (!Number.isNaN(n) && Number.isFinite(n)) return n;
    }
    return undefined;
}

// Garante string não vazia ou undefined
function toStringSafe(val) {
    if (typeof val === 'string') {
        const t = val.trim();
        return t.length ? t : undefined;
    }
    return undefined;
}

// Log enxuto (ligue/desligue por env var)
function debugLog(...args) {
    if (process.env.DEBUG_APLIQUES === 'true') {
        console.log('[APLIQUES]', ...args);
    }
}

/* ------------------------------ GET ALL ------------------------------ */
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

/* ------------------------------ GET BY ID ------------------------------ */
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

/* ------------------------------ CREATE ------------------------------ */
const createAplique = async (req, res) => {
    debugLog('REQ BODY (create):', req.body, {
        types: {
            codigo: typeof req.body.codigo,
            imagem: typeof req.body.imagem,
            quantidade: typeof req.body.quantidade,
            estoque: typeof req.body.estoque,
            ordem: typeof req.body.ordem,
        },
    });

    try {
        // Coerção
        const codigo = toStringSafe(req.body.codigo);
        const imagem = toStringSafe(req.body.imagem);
        const quantidade = toNumber(req.body.quantidade);
        const ordem = toNumber(req.body.ordem);
        const estoque = toBoolean(req.body.estoque);

        // Validação
        const errors = {};
        if (codigo == null) errors.codigo = 'Código é obrigatório (string).';
        if (imagem == null) errors.imagem = 'Imagem é obrigatória (string).';
        if (quantidade == null) errors.quantidade = 'Quantidade inválida.';
        if (ordem == null) errors.ordem = 'Ordem inválida.';
        if (estoque == null)
            errors.estoque = 'Estoque deve ser boolean (true/false).';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'Campos obrigatórios faltando ou inválidos.',
                fields: errors,
            });
        }

        // Verificar duplicidade
        const existente = await Apliques.findOne({ codigo });
        if (existente) {
            // Use 409 para conflito (recomendado); mude p/ 400 se preferir manter compatibilidade
            return res.status(409).json({ message: 'Código já cadastrado' });
        }

        // Criar
        const novoAplique = await Apliques.create({
            codigo,
            imagem,
            quantidade,
            estoque,
            ordem,
        });

        return res.status(201).json({
            message: 'Aplique adicionado com sucesso',
            data: novoAplique,
        });
    } catch (error) {
        console.error('Erro ao criar aplique:', error);
        return res.status(500).json({
            message: 'Erro ao criar aplique',
            error: error.message,
        });
    }
};

/* ------------------------------ UPDATE ------------------------------ */
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

/* ------------------------------ DELETE ------------------------------ */
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
