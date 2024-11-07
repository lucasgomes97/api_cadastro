// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('pg-promise')();
const cors = require('cors');

// Configuração do banco de dados PostgreSQL
const dbConfig = {
  host: '127.0.0.1',  
  port: 5432,
  database: 'postgres',
  user: 'postgres',    // Substitua pelo seu usuário
  password: ''   // Substitua pela sua senha
};

const app = express();
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());

const pgdb = db(dbConfig);

// Endpoint para cadastrar um novo usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await pgdb.oneOrNone('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);

    if (userExists) {
      return res.status(400).json({ message: 'Usuário ou e-mail já existente.' });
    }

    // Inserir o novo usuário
    await pgdb.none('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// Rodando o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
