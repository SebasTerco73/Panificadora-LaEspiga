const app = require('./app');
const PORT = process.env.PORT || 3000;

// arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor de La Espiga de Oro corriendo en http://localhost:${PORT}`);
});