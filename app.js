// Importa libreria express y crea el servidor
const express = require('express');
const app = express();

// Middleware le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configura la carpeta de vistas y el motor de plantillas Pug
app.set('views', './views');
app.set('view engine', 'pug');

// Middleware de logger personalizado
const logger = require('./src/middleware/logger.middleware');
app.use(logger);

// Ruta de ejemplo para renderizar una vista pug
app.get('/', (req, res) => {
  res.render('first_view');
});

// IMPORTACIÓN DE RUTAS
const clientesRoutes = require('./src/routes/clientes.routes');
const productosRoutes = require('./src/routes/productos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');    

// USO DE RUTAS
app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);    

// Rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;