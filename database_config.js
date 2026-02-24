const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'saborr_agendamento',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Função para executar queries
async function executeQuery(sql, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(sql, params);
        connection.release();
        return results;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    }
}

// Função para obter um registro
async function getOne(sql, params = []) {
    const results = await executeQuery(sql, params);
    return results[0] || null;
}

// Função para obter múltiplos registros
async function getAll(sql, params = []) {
    return await executeQuery(sql, params);
}

// Função para inserir
async function insert(sql, params = []) {
    const result = await executeQuery(sql, params);
    return result.insertId;
}

// Função para atualizar
async function update(sql, params = []) {
    const result = await executeQuery(sql, params);
    return result.affectedRows;
}

// Função para deletar
async function remove(sql, params = []) {
    const result = await executeQuery(sql, params);
    return result.affectedRows;
}

module.exports = {
    pool,
    executeQuery,
    getOne,
    getAll,
    insert,
    update,
    remove
};