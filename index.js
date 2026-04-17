// Importa y ejecuta dotenv para cargar variables de entorno desde el archivo .env
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = require('./app');
console.log(`Servidor inicializando...`);

// arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor de La Espiga de Oro corriendo en http://localhost:${PORT}`);
});
