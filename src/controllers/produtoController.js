const supabase = require('../config/supabase');

exports.listarProdutos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json({
      sucesso: true,
      quantidade: data.length,
      dados: data
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar produtos',
      erro: erro.message
    });
  }
};

exports.buscarProduto = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: data
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar produto',
      erro: erro.message
    });
  }
};

exports.criarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;

    if (!nome || !categoria || !preco) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, categoria e preço são obrigatórios'
      });
    }

    const novoProduto = {
      nome,
      categoria,
      preco: parseFloat(preco),
      descricao: descricao || '',
      estoque: estoque || 0
    };

    const { data, error } = await supabase
      .from('produtos')
      .insert([novoProduto])
      .select();

    if (error) throw error;

    res.status(201).json({
      sucesso: true,
      mensagem: 'Produto criado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar produto',
      erro: erro.message
    });
  }
};

exports.atualizarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;

    const { data, error } = await supabase
      .from('produtos')
      .update({
        nome: nome || undefined,
        categoria: categoria || undefined,
        preco: preco ? parseFloat(preco) : undefined,
        descricao: descricao !== undefined ? descricao : undefined,
        estoque: estoque !== undefined ? estoque : undefined
      })
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Produto atualizado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar produto',
      erro: erro.message
    });
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Produto removido com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar produto',
      erro: erro.message
    });
  }
};