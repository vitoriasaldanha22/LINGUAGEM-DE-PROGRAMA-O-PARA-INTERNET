require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

// Carrega segredos a partir das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.API_KEY;

app.use(express.json());

// Configuração do MySQL com variáveis de ambiente
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Middleware para verificar JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // formato: "Bearer <token>"

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = user; // payload do JWT
    next();
  });
}

// Endpoint para gerar token usando API Key
app.post("/auth", (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ error: "API Key inválida" });
  }

  const payload = { role: "admin", name: "API User" };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// Página inicial
app.get("/", (req, res) => {
  res.send("<h1>📖 API de Clientes com JWT + API Key</h1>");
});

// --- ROTAS CRUD PROTEGIDAS ---

// 🔒 Listar todos os clientes
app.get("/api/v1/cliente", authenticateJWT, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT id, nome, email, telefone FROM clientes");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Obter um cliente por ID
app.get("/api/v1/cliente/:id", authenticateJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute("SELECT id, nome, email, telefone FROM clientes WHERE id = ?", [id]);
      await connection.end();
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// 🔒 Criar novo cliente
app.post("/api/v1/cliente", authenticateJWT, async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: "Campos obrigatórios: nome, email, telefone" });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)",
      [nome, email, telefone]
    );
    await connection.end();

    res.status(201).json({
      message: "Cliente criado com sucesso!",
      clienteId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Atualizar um cliente
app.put("/api/v1/cliente/:id", authenticateJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, telefone } = req.body;
  
      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: "Campos obrigatórios: nome, email, telefone" });
      }
  
      const connection = await mysql.createConnection(dbConfig);
      const [result] = await connection.execute(
        "UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?",
        [nome, email, telefone, id]
      );
      await connection.end();
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
  
      res.json({ message: "Cliente atualizado com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// 🔒 Deletar cliente
app.delete("/api/v1/cliente/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute("DELETE FROM clientes WHERE id = ?", [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ message: "Cliente deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Node rodando na porta ${PORT}`);
});