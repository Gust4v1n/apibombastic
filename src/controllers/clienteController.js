const { clientes } = require('../models/data');

exports.listarClientes = (req, res) => {
  res.json({
    sucesso: true,
    quantidade: clientes.length,
    dados: clientes
  });
};

exports.buscarCliente = (req, res) => {
  const cliente = clientes.find(c => c.id === parseInt(req.params.id));
  
  if (!cliente) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Cliente não encontrado'
    });
  }
  
  res.json({
    sucesso: true,
    dados: cliente
  });
};

exports.criarCliente = (req, res) => {
  const { nome, email, telefone } = req.body;
  
  if (!nome || !email) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Nome e email são obrigatórios'
    });
  }
  
  const novoCliente = {
    id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
    nome,
    email,
    telefone: telefone || '',
    dataCadastro: new Date().toISOString().split('T')[0]
  };
  
  clientes.push(novoCliente);
  
  res.status(201).json({
    sucesso: true,
    mensagem: 'Cliente criado com sucesso',
    dados: novoCliente
  });
};

exports.atualizarCliente = (req, res) => {
  const index = clientes.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Cliente não encontrado'
    });
  }
  
  const { nome, email, telefone } = req.body;
  
  clientes[index] = {
    ...clientes[index],
    nome: nome || clientes[index].nome,
    email: email || clientes[index].email,
    telefone: telefone !== undefined ? telefone : clientes[index].telefone
  };
  
  res.json({
    sucesso: true,
    mensagem: 'Cliente atualizado com sucesso',
    dados: clientes[index]
  });
};

exports.deletarCliente = (req, res) => {
  const index = clientes.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Cliente não encontrado'
    });
  }
  
  const clienteRemovido = clientes.splice(index, 1)[0];
  
  res.json({
    sucesso: true,
    mensagem: 'Cliente removido com sucesso',
    dados: clienteRemovido
  });
};