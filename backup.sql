-- Criar banco (caso não exista)
CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  produto VARCHAR(100) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_venda DATE NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Inserir clientes
INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao.silva@example.com', '11999999999'),
('Maria Oliveira', 'maria.oliveira@example.com', '21988888888'),
('Carlos Souza', 'carlos.souza@example.com', '31977777777'),
('Ana Lima', 'ana.lima@example.com', '41966666666');

-- Inserir vendas
INSERT INTO vendas (cliente_id, produto, valor, data_venda) VALUES
(1, 'Notebook Dell', 3500.00, '2025-08-01'),
(2, 'iPhone 14', 7200.00, '2025-08-05'),
(1, 'Mouse Gamer', 250.00, '2025-08-10'),
(3, 'Teclado Mecânico', 600.00, '2025-08-12'),
(4, 'Monitor LG 27"', 1200.00, '2025-08-15'),
(2, 'Headset HyperX', 450.00, '2025-08-20');