# 📚 Guia de Configuração - Supabase


## 📦 Instalações Realizadas

- ✅ `@supabase/supabase-js` - Cliente JavaScript para Supabase
- ✅ `dotenv` - Gerenciador de variáveis de ambiente

---

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos:
- **`src/config/supabase.js`** - Configuração e inicialização do cliente Supabase
- **`.env`** - Credenciais do Supabase (já preenchido ✅)
- **`.env.example`** - Modelo de variáveis de ambiente

### Arquivos Modificados:
- **`src/server.js`** - Adicionado `require('dotenv').config()`
- **`src/controllers/clienteController.js`** - Todos os endpoints agora usam Supabase
- **`src/controllers/produtoController.js`** - Todos os endpoints agora usam Supabase
- **`src/controllers/pedidoController.js`** - Todos os endpoints agora usam Supabase

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `clientes`
```sql
CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  dataCadastro DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `produtos`
```sql
CREATE TABLE produtos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  estoque INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `pedidos`
```sql
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  clienteId BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  itens JSONB NOT NULL,
  valorTotal DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Índices:
```sql
CREATE INDEX idx_pedidos_clienteId ON pedidos(clienteId);
CREATE INDEX idx_clientes_email ON clientes(email);
```

---

## 🚀 Como Usar

### 1️⃣ Acessar o Supabase Dashboard

- Acesse: https://supabase.com
- Login no seu projeto

### 2️⃣ Criar as Tabelas

No Supabase Dashboard:
1. Vá para **"SQL Editor"**
2. Cole e execute o script completo de criação das tabelas (veja acima)

### 3️⃣ Credenciais já Configuradas ✅

Seu arquivo `.env` já contém:
```env
SUPABASE_URL=https://lxnoisixlzryjkzsjlxs.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

### 4️⃣ Configurar Segurança (Row Level Security)

Para cada tabela (`clientes`, `produtos`, `pedidos`):

1. No Supabase Dashboard, vá a **Database** > **Tables**
2. Selecione a tabela
3. Clique em **"RLS"** (canto superior direito)
4. Habilite **RLS**
5. Crie uma política para acesso público (desenvolvimento):

```sql
CREATE POLICY "Allow public access" ON clientes
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access" ON produtos
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access" ON pedidos
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 5️⃣ Iniciar o Servidor

```bash
npm start
```

O servidor iniciará na porta **3000** e estará conectado ao Supabase ✅

---

## 📡 Endpoints da API

### 🔵 CLIENTES

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/clientes` | Listar todos os clientes |
| GET | `/api/clientes/:id` | Buscar cliente por ID |
| POST | `/api/clientes` | Criar novo cliente |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Deletar cliente |

**Exemplo POST:**
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 98765-4321"
  }'
```

---

### 🔵 PRODUTOS

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar todos os produtos |
| GET | `/api/produtos/:id` | Buscar produto por ID |
| POST | `/api/produtos` | Criar novo produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Deletar produto |

**Exemplo POST:**
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Espresso",
    "categoria": "Café",
    "preco": 4.50,
    "descricao": "Café expresso tradicional",
    "estoque": 100
  }'
```

---

### 🔵 PEDIDOS

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar todos os pedidos |
| GET | `/api/pedidos/:id` | Buscar pedido por ID |
| POST | `/api/pedidos` | Criar novo pedido |
| PUT | `/api/pedidos/:id` | Atualizar status do pedido |
| DELETE | `/api/pedidos/:id` | Cancelar pedido |

**Exemplo POST:**
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "itens": [
      {
        "produtoId": 1,
        "quantidade": 2
      },
      {
        "produtoId": 2,
        "quantidade": 1
      }
    ]
  }'
```

---

## ✨ Vantagens do Supabase

✅ **Dados na Nuvem** - Seguro e sempre acessível  
✅ **Persistência** - Dados não são perdidos ao reiniciar  
✅ **Escalabilidade** - Suporta múltiplos servidores  
✅ **Backup Automático** - Recuperação de desastres  
✅ **Compartilhamento** - Múltiplos clientes acessam os mesmos dados  
✅ **PostgreSQL** - Banco de dados robusto e profissional  
✅ **API REST Integrada** - Fácil de integrar com frontend  

---

## 🐛 Solução de Problemas

### Erro: "SUPABASE_URL e SUPABASE_KEY são obrigatórios"
- Verifique se o arquivo `.env` está na raiz do projeto
- Certifique-se de que as credenciais estão preenchidas corretamente

### Erro: "Table does not exist"
- Verifique se as tabelas foram criadas no Supabase
- Execute novamente o script SQL no SQL Editor

### Erro: "Policy does not exist"
- Habilite RLS em cada tabela
- Crie as políticas de acesso público (para desenvolvimento)

### Dados não aparecem após criação
- Verifique se o RLS está habilitado e permite acesso público
- Consulte o Supabase Dashboard > Logs

---

## 📚 Recursos Úteis

- 📖 [Documentação Supabase](https://supabase.com/docs)
- 🔐 [Security & Authentication](https://supabase.com/docs/guides/auth)
- 📊 [Database Best Practices](https://supabase.com/docs/guides/database)
- 🚀 [Deployment Guide](https://supabase.com/docs/guides/hosting/deployment)


**Backend Supabase configurado com sucesso! 🎉**

