import { pool } from '../config/database.js';

// 1. Buscar todas as operações
export async function buscarTodas() {
  const [rows] = await pool.query('SELECT * FROM operacoes ORDER BY dataEvento DESC');
  return rows;
}

// 2. Adicionar uma nova operação (agora com valor)
export async function adicionar(dados) {
  const { tipoEvento, descricao, categoria, valor } = dados;
  
  const query = `
    INSERT INTO operacoes (tipoEvento, descricao, categoria, valor) 
    VALUES (?, ?, ?, ?)
  `;
  
  const [resultado] = await pool.execute(query, [tipoEvento, descricao, categoria, valor]);
  return resultado.insertId;
}

// 3. Excluir uma operação por ID
export async function excluir(id) {
  const query = 'DELETE FROM operacoes WHERE id = ?';
  const [resultado] = await pool.execute(query, [id]);
  
  return resultado.affectedRows;
}