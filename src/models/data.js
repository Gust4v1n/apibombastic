let produtos = [
  {
    id: 1,
    nome: "Espresso",
    categoria: "Café",
    preco: 4.50,
    descricao: "Café expresso tradicional",
    estoque: 100
  },
  {
    id: 2,
    nome: "Cappuccino",
    categoria: "Café",
    preco: 7.00,
    descricao: "Café com leite vaporizado e espuma",
    estoque: 80
  },
  {
    id: 3,
    nome: "Croissant",
    categoria: "Alimento",
    preco: 6.50,
    descricao: "Croissant francês artesanal",
    estoque: 50
  }
];

let clientes = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 98765-4321",
    dataCadastro: "2024-01-15"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 91234-5678",
    dataCadastro: "2024-02-20"
  }
];

let pedidos = [
  {
    id: 1,
    clienteId: 1,
    itens: [
      { produtoId: 1, quantidade: 2, precoUnitario: 4.50 },
      { produtoId: 3, quantidade: 1, precoUnitario: 6.50 }
    ],
    valorTotal: 15.50,
    status: "concluído",
    data: "2024-11-25T10:30:00"
  }
];

module.exports = { produtos, clientes, pedidos };