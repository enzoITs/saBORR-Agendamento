const express = require('express');
const bodyParser = require('body-parser');
const databaseConfig = require('./database_config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint for usuarios
app.get('/usuarios', (req, res) => {
  // Logic to get usuarios from the database
});

app.post('/usuarios', (req, res) => {
  // Logic to create a new usuario
});

// Endpoint for barbeiros
app.get('/barbeiros', (req, res) => {
  // Logic to get barbeiros from the database
});

app.post('/barbeiros', (req, res) => {
  // Logic to create a new barbeiro
});

// Endpoint for servicos
app.get('/servicos', (req, res) => {
  // Logic to get servicos from the database
});

app.post('/servicos', (req, res) => {
  // Logic to create a new servico
});

// Endpoint for agendamentos
app.get('/agendamentos', (req, res) => {
  // Logic to get agendamentos from the database
});

app.post('/agendamentos', (req, res) => {
  // Logic to create a new agendamento
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});