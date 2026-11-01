import express from "express";
import cors from "cors";
import "dotenv/config";
import { buscarTodas, adicionar, excluir } from "./models/operacao.js";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());

// 1. ROTA GET: Buscar todas as operações
app.get("/operacoes", async (req, res) => {
  try {
    const operacoes = await buscarTodas();
    res.status(200).json(operacoes);
  } catch (error) {
    console.error("Erro ao buscar operações:", error);
    res.status(500).json({ erro: "Erro interno ao buscar operações." });
  }
});

// 2. ROTA POST: Adicionar uma nova operação (com validação de valor)
app.post("/operacoes", async (req, res) => {
  try {
    const { tipoEvento, descricao, categoria, valor } = req.body;

    // Validações básicas
    if (!tipoEvento) {
      return res
        .status(400)
        .json({ erro: "O campo tipoEvento é obrigatório." });
    }
    if (valor === undefined || valor === null) {
      return res.status(400).json({ erro: "O campo valor é obrigatório." });
    }

    const novoId = await adicionar({ tipoEvento, descricao, categoria, valor });
    res
      .status(201)
      .json({ mensagem: "Operação criada com sucesso!", id: novoId });
  } catch (error) {
    console.error("Erro ao adicionar operação:", error);
    res.status(500).json({ erro: "Erro interno ao adicionar operação." });
  }
});

// 3. ROTA DELETE: Excluir uma operação por ID
app.delete("/operacoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const linhasAfetadas = await excluir(id);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ erro: "Operação não encontrada." });
    }

    res.status(200).json({ mensagem: "Operação excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir operação:", error);
    res.status(500).json({ erro: "Erro interno ao excluir operação." });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
