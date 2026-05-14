// ES Modules -> import 
import express from 'express';
const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ********* Middlewares ***************
// le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());

// formularios HTML
app.use(express.urlencoded({ extended: true }));

// servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// ********* Middlewares ***************

//  Configura la carpeta de vistas y el motor de plantillas Pug
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware de logger personalizado
// ES Modules -> import
import logger from './src/middleware/logger.middleware.js';

app.use(logger);

// Ruta de ejemplo para renderizar una vista pug
app.get('/', (req, res) => {
  // no hace falta poner la extensión .pug, ya que el motor de plantillas ya sabe que es un archivo pug
  res.render('index');
});

// IMPORTACIÓN DE RUTAS ES Modules -> import
import clientesRoutes from './src/routes/clientes.routes.js';
import productosRoutes from './src/routes/productos.routes.js';
import pedidosRoutes from './src/routes/pedidos.routes.js';

// todo lo que entre a /param1 lo manda al router de param2
app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// exporta con ES Modules
export default app;