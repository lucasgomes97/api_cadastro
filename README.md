

## Documentação do Projeto: API de Cadastro de Usuários

### 1. Requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados no seu computador:

- **Node.js**: [https://nodejs.org](https://nodejs.org)
- **PostgreSQL**: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

### 2. Configuração do Banco de Dados

1. **Inicie o PostgreSQL** e acesse o terminal do banco de dados usando o comando:
   ```bash
   psql -U postgres
   ```

2. **Crie o banco de dados** que será usado para armazenar os dados dos usuários:
   ```sql
   CREATE DATABASE cadastro_usuarios;
   ```

3. **Conecte-se ao banco de dados**:
   ```sql
   \c cadastro_usuarios;
   ```

4. **Crie a tabela `users`** para armazenar as informações dos usuários:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(100) NOT NULL
   );
   ```

### 3. Configuração do Ambiente Node.js

1. **Clone o projeto** ou crie uma pasta para o código:
   ```bash
   mkdir cadastro-usuarios-api
   cd cadastro-usuarios-api
   ```

2. **Inicialize o projeto Node.js** (isso cria um arquivo `package.json`):
   ```bash
   npm init -y
   ```

3. **Instale as dependências** necessárias para o projeto:
   ```bash
   npm install express body-parser pg-promise cors
   ```

### 4. Configuração do Código do Servidor (Back-End)

1. **Crie o arquivo `app.js`** na pasta do projeto e copie o seguinte código:

   ```javascript
   const express = require('express');
   const bodyParser = require('body-parser');
   const db = require('pg-promise')();
   const cors = require('cors');

   // Configuração do banco de dados PostgreSQL
   const dbConfig = {
     host: '127.0.0.1',  
     port: 5432,
     database: 'cadastro_usuarios',
     user: 'postgres',    // Substitua pelo seu usuário
     password: 'sua_senha'   // Substitua pela sua senha
   };

   const app = express();
   app.use(cors());
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
   ```

2. **Inicie o servidor**:
   - Certifique-se de estar no diretório do projeto e execute:
     ```bash
     node app.js
     ```
   - Você deve ver a mensagem `API rodando na porta 3000` no terminal, indicando que o servidor está ativo.

### 5. Configuração do Front-End (HTML)

1. **Crie o arquivo `front.html`** no mesmo diretório e adicione o seguinte código:

   ```html
   <!DOCTYPE html>
   <html lang="pt-br">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Cadastro de Usuário</title>
   </head>
   <body>
     <h1>Cadastro de Usuário</h1>
     <form id="registerForm">
       <label for="username">Nome de usuário:</label>
       <input type="text" id="username" required><br><br>

       <label for="email">E-mail:</label>
       <input type="email" id="email" required><br><br>

       <label for="password">Senha:</label>
       <input type="password" id="password" required><br><br>

       <button type="submit">Cadastrar</button>
     </form>

     <script>
       document.getElementById('registerForm').addEventListener('submit', async function(event) {
         event.preventDefault();

         const username = document.getElementById('username').value;
         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;

         try {
           const response = await fetch('http://localhost:3000/register', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({ username, email, password })
           });

           const data = await response.json();
           alert(data.message);
         } catch (error) {
           console.error('Erro ao tentar se comunicar com o servidor:', error);
           alert('Erro ao tentar se comunicar com o servidor.');
         }
       });
     </script>
   </body>
   </html>
   ```

2. **Abra o front-end no navegador**:
   - Clique duas vezes no arquivo `front.html` para abrir no navegador.
   - Preencha o formulário e clique em “Cadastrar” para testar a conexão com o back-end.

### 6. Testando com o Postman (Opcional)

1. Abra o **Postman** e envie uma requisição POST para `http://localhost:3000/register`.
2. No corpo da requisição, selecione **raw** e defina o tipo como **JSON**. Insira um conteúdo similar a:
   ```json
   {
     "username": "teste",
     "email": "teste@example.com",
     "password": "senha123"
   }
   ```
3. Verifique se a resposta é `"Usuário cadastrado com sucesso!"` ou `"Usuário ou e-mail já existente."`.

### 7. Solução de Problemas Comuns

1. **Erro de Conexão com o Banco de Dados**: Verifique se o PostgreSQL está em execução e se as configurações de `dbConfig` no `app.js` (usuário, senha, banco de dados) estão corretas.
2. **Problema de CORS**: Se houver problemas de conexão do front-end com o back-end, certifique-se de que o `cors()` está habilitado no servidor.

### Conclusão

Agora você configurou com sucesso o ambiente e pode rodar a API e o front-end para cadastro de usuários.
