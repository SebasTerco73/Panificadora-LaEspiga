// Importa libreria express y crea el servidor
const express = require('express');
const app = express();

// Configura el puerto
const PORT = process.env.PORT || 3000;

// Middleware le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());


// Middleware de logger personalizado
const logger = require('./src/middleware/logger.middleware');
app.use(logger);

// importa el router de clientes
const clientesRoutes = require('./src/routes/clientes.routes');

// todo lo que entre a /clientes lo manda al router de clientes
app.use('/clientes', clientesRoutes);

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

