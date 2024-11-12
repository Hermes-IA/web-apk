const express = require('express');
const path = require('path');

const app = express();
const PORT = 2501; // Cambia el puerto si es necesario
const HOST = '192.168.1.29'; // Tu dirección IP

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir zzyzx.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'zzyzx.html'));
});

// Manejo de otras rutas
app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// Iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}/`);
});
