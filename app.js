// Importa libreria express y crea el servidor
const express = require('express');
const app = express();

// Middleware le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

//  Configura la carpeta de vistas y el motor de plantillas Pug
app.set('views', './views');
app.set('view engine', 'pug');

// Middleware de logger personalizado
const logger = require('./src/middleware/logger.middleware');
app.use(logger);

// Ruta de ejemplo para renderizar una vista pug
app.get('/', (req, res) => {
  // no hace falta poner la extensión .pug, ya que el motor de plantillas ya sabe que es un archivo pug
  res.render('first_view');
});

// importa el router de clientes
const clientesRoutes = require('./src/routes/clientes.routes');
// todo lo que entre a /clientes lo manda al router de clientes
app.use('/clientes', clientesRoutes);

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;