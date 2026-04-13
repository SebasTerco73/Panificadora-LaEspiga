// Importa libreria express y crea el servidor
const express = require('express');
const app = express();

// Configura el puerto
const PORT = process.env.PORT || 3000;

// Middleware le dice al servidor que entienda JSON en el body de las requests
app.use(express.json());

// importa el router de clientes
const clientesRoutes = require('./src/routes/clientes.routes');

// todo lo que entre a /clientes lo manda al router de clientes
app.use('/clientes', clientesRoutes);

// arranca el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

