const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3001;

// Configuração do MySQL (igual ao docker-compose)
const dbConfig = {
  host: "mysql",       // nome do serviço no docker-compose
  user: "appuser",
  password: "apppass",
  database: "appdb"
};

app.get("/", (req, res) => {

  //res.json({ message: "Node.js está rodando no Docker!" });
  const htmlstring = `

 <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Documentação da API — Vitória Saldanha</title>
</head>
<body>

  <header>
    <h1>Documentação da API</h1>
    <p><strong>Vitória Saldanha</strong> — Curso: Sistemas de Informação (5º período) — 21 anos</p>
  </header>

  <nav>
    <a href="#overview">Visão Geral</a>
    <a href="#endpoints">Endpoints</a>
    <a href="#exemplos">Exemplos</a>
    <a href="#contato">Contato</a>
  </nav>

  <section id="overview">
    <h2>Visão Geral</h2>
    <p>Esta documentação descreve os recursos e como interagir com a API.</p>
    <p>Base URL: <code>https://api.seuservidor.com/v1</code></p>
    <p>Autenticação: Adicione um token no cabeçalho <code>Authorization: Bearer &lt;SEU_TOKEN&gt;</code>.</p>
  </section>

  <section id="endpoints">
    <h2>Endpoints</h2>

    <h3>GET /users</h3>
    <p>Retorna a lista de usuários.</p>
    <p><strong>Resposta (200 OK)</strong>:</p>
    <pre>[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@example.com",
    "telefone": "11999999999",
    "criado_em": "2025-09-01T22:46:35.000Z"
  },
  ...
]</pre>

    <h3>GET /users/{id}</h3>
    <p>Retorna um usuário pelo ID.</p>
    <p><strong>Parâmetro:</strong> <code>id</code> (inteiro) — obrigatório.</p>
    <p><strong>Resposta (200 OK)</strong>:</p>
    <pre>{
  "id": 1,
  "nome": "João Silva",
  "email": "joao.silva@example.com",
  "telefone": "11999999999",
  "criado_em": "2025-09-01T22:46:35.000Z"
}</pre>
    <p><strong>Resposta (404 Not Found)</strong>:</p>
    <pre>{
  "error": "Usuário não encontrado"
}</pre>
  </section>

  <section id="exemplos">
    <h2>Exemplos de Uso</h2>
    <h3>Chamada com curl</h3>
    <pre>curl -X GET "https://api.seuservidor.com/v1/users" \
  -H "Authorization: Bearer SEU_TOKEN"</pre>

    <h3>Resposta esperada</h3>
    <pre>[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@example.com",
    "telefone": "11999999999",
    "criado_em": "2025-09-01T22:46:35.000Z"
  },
  ...
]</pre>
  </section>

  <section id="contato">
    <h2>Contato</h2>
    <p>Documentação criada por <strong>Vitória Saldanha</strong>.</p>
    <p>Curso: Sistemas de Informação — 5º período</p>
    <p>Idade: 21 anos</p>
  </section>

  <footer>
    <p>© 2025 Vitória Saldanha — Documentação gerada em HTML.</p>
  </footer>

</body>
</html>

  `;

  res.send(htmlstring);
});
app.get("/api/v1/cliente", async (req, res) => {

 



  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM clientes");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Node rodando na porta ${PORT}`);
});
