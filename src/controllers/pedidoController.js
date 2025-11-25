const { pedidos, produtos, clientes } = require('../models/data');

exports.listarPedidos = (req, res) => {
  res.json({
    sucesso: true,
    quantidade: pedidos.length,
    dados: pedidos
  });
};

exports.buscarPedido = (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  
  if (!pedido) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Pedido não encontrado'
    });
  }
  
  res.json({
    sucesso: true,
    dados: pedido
  });
};

exports.criarPedido = (req, res) => {
  const { clienteId, itens } = req.body;
  
  if (!clienteId || !itens || itens.length === 0) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ClienteId e itens são obrigatórios'
    });
  }
  
  const cliente = clientes.find(c => c.id === clienteId);
  if (!cliente) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Cliente não encontrado'
    });
  }
  
  let valorTotal = 0;
  const itensProcessados = [];
  
  for (const item of itens) {
    const produto = produtos.find(p => p.id === item.produtoId);
    if (!produto) {
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
    id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
    clienteId,
    itens: itensProcessados,
    valorTotal: parseFloat(valorTotal.toFixed(2)),
    status: 'pendente',
    data: new Date().toISOString()
  };
  
  pedidos.push(novoPedido);
  
  res.status(201).json({
    sucesso: true,
    mensagem: 'Pedido criado com sucesso',
    dados: novoPedido
  });
};

exports.atualizarPedido = (req, res) => {
  const index = pedidos.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Pedido não encontrado'
    });
  }
  
  const { status } = req.body;
  
  if (status) {
    pedidos[index].status = status;
  }
  
  res.json({
    sucesso: true,
    mensagem: 'Pedido atualizado com sucesso',
    dados: pedidos[index]
  });
};

exports.deletarPedido = (req, res) => {
  const index = pedidos.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Pedido não encontrado'
    });
  }
  
  const pedidoRemovido = pedidos.splice(index, 1)[0];
  
  res.json({
    sucesso: true,
    mensagem: 'Pedido cancelado com sucesso',
    dados: pedidoRemovido
  });
};