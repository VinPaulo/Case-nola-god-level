const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Servir arquivos estáticos
app.use(express.static('.'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend rodando em http://localhost:${PORT}`);
    console.log(`📊 Backend API em http://localhost:3000`);
});
