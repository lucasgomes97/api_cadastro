CREATE DATABASE app_db;

\c app_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);


"""
Criar diretorio 
npm init -y

instalar as dependências

npm install express pg-promise body-parser
"""