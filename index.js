const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
console.log(`Servidor inicializando...`);

// Middleware le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());

// Middleware de logger personalizado
const logger = require('./src/middleware/logger.middleware');
app.use(logger);

// IMPORTACIÓN DE RUTAS
const clientesRoutes = require('./src/routes/clientes.routes');
const productosRoutes = require('./src/routes/productos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');    

// todo lo que entre a /clientes lo manda al router de clientes
app.use('/clientes', clientesRoutes);

// todo lo que entre a /productos lo manda al router de productos
app.use('/productos', productosRoutes);

// todo lo que entre a /pedidos lo manda al router de pedidos
app.use('/pedidos', pedidosRoutes);


// Rutas no encontradas (Debe ir siempre al final de las rutas)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor de La Espiga de Oro corriendo en http://localhost:${PORT}`);
});