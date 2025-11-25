const supabase = require('../config/supabase');

exports.listarClientes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
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
      mensagem: 'Erro ao listar clientes',
      erro: erro.message
    });
  }
};

exports.buscarCliente = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Cliente não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: data
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar cliente',
      erro: erro.message
    });
  }
};

exports.criarCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome e email são obrigatórios'
      });
    }

    const novoCliente = {
      nome,
      email,
      telefone: telefone || '',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([novoCliente])
      .select();

    if (error) throw error;

    res.status(201).json({
      sucesso: true,
      mensagem: 'Cliente criado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar cliente',
      erro: erro.message
    });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    const { data, error } = await supabase
      .from('clientes')
      .update({
        nome: nome || undefined,
        email: email || undefined,
        telefone: telefone !== undefined ? telefone : undefined
      })
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Cliente não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Cliente atualizado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar cliente',
      erro: erro.message
    });
  }
};

exports.deletarCliente = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Cliente não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Cliente removido com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar cliente',
      erro: erro.message
    });
  }
};