const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Load env vars from project root if needed

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Taça das Casas está online!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
