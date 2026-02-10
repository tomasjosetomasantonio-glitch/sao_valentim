const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conecta ao banco (cria se não existir)
const db = new sqlite3.Database('./amor.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS mensagens (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT, autor TEXT, data TEXT)");
});

// Rota para buscar mensagens
app.get('/mensagens', (req, res) => {
    db.all("SELECT * FROM mensagens ORDER BY id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

// Rota para salvar nova mensagem
app.post('/mensagens', (req, res) => {
    const { texto, autor } = req.body;
    const data = new Date().toLocaleDateString('pt-BR');
    db.run("INSERT INTO mensagens (texto, autor, data) VALUES (?, ?, ?)", [texto, autor, data], function (err) {
        res.json({ id: this.lastID });
    });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));