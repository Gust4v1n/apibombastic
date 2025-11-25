const supabase = require('../config/supabase');

exports.listarPedidos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
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
      mensagem: 'Erro ao listar pedidos',
      erro: erro.message
    });
  }
};

exports.buscarPedido = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Pedido não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: data
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar pedido',
      erro: erro.message
    });
  }
};

exports.criarPedido = async (req, res) => {
  try {
    const { clienteId, itens } = req.body;

    if (!clienteId || !itens || itens.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ClienteId e itens são obrigatórios'
      });
    }

    // Verificar se cliente existe
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single();

    if (clienteError || !cliente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Cliente não encontrado'
      });
    }

    let valorTotal = 0;
    const itensProcessados = [];

    // Validar e processar itens
    for (const item of itens) {
      const { data: produto, error: produtoError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', item.produtoId)
        .single();

      if (produtoError || !produto) {
        return res.status(404).json({
          sucesso: false,
          mensagem: `Produto ID ${item.produtoId} não encontrado`
        });
      }

      itensProcessados.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: produto.preco
      });

      valorTotal += produto.preco * item.quantidade;
    }

    const novoPedido = {
      clienteId,
      itens: itensProcessados,
      valorTotal: parseFloat(valorTotal.toFixed(2)),
      status: 'pendente',
      data: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('pedidos')
      .insert([novoPedido])
      .select();

    if (error) throw error;

    res.status(201).json({
      sucesso: true,
      mensagem: 'Pedido criado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar pedido',
      erro: erro.message
    });
  }
};

exports.atualizarPedido = async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('pedidos')
      .update({
        status: status || undefined
      })
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Pedido não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Pedido atualizado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar pedido',
      erro: erro.message
    });
  }
};

exports.deletarPedido = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', parseInt(req.params.id))
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Pedido não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Pedido cancelado com sucesso',
      dados: data[0]
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar pedido',
      erro: erro.message
    });
  }
};