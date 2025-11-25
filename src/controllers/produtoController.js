const { produtos } = require('../models/data');

exports.listarProdutos = (req, res) => {
  res.json({
    sucesso: true,
    quantidade: produtos.length,
    dados: produtos
  });
};

exports.buscarProduto = (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  
  if (!produto) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Produto não encontrado'
    });
  }
  
  res.json({
    sucesso: true,
    dados: produto
  });
};

exports.criarProduto = (req, res) => {
  const { nome, categoria, preco, descricao, estoque } = req.body;
  
  if (!nome || !categoria || !preco) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Nome, categoria e preço são obrigatórios'
    });
  }
  
  const novoProduto = {
    id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
    nome,
    categoria,
    preco: parseFloat(preco),
    descricao: descricao || '',
    estoque: estoque || 0
  };
  
  produtos.push(novoProduto);
  
  res.status(201).json({
    sucesso: true,
    mensagem: 'Produto criado com sucesso',
    dados: novoProduto
  });
};

exports.atualizarProduto = (req, res) => {
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Produto não encontrado'
    });
  }
  
  const { nome, categoria, preco, descricao, estoque } = req.body;
  
  produtos[index] = {
    ...produtos[index],
    nome: nome || produtos[index].nome,
    categoria: categoria || produtos[index].categoria,
    preco: preco ? parseFloat(preco) : produtos[index].preco,
    descricao: descricao !== undefined ? descricao : produtos[index].descricao,
    estoque: estoque !== undefined ? estoque : produtos[index].estoque
  };
  
  res.json({
    sucesso: true,
    mensagem: 'Produto atualizado com sucesso',
    dados: produtos[index]
  });
};

exports.deletarProduto = (req, res) => {
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: 'Produto não encontrado'
    });
  }
  
  const produtoRemovido = produtos.splice(index, 1)[0];
  
  res.json({
    sucesso: true,
    mensagem: 'Produto removido com sucesso',
    dados: produtoRemovido
  });
};