const express = require('express');
// crea un router, es como un mini-servidor para una sección de rutas
const router = express.Router();

// importa las funciones del controller
const { getClientes, postCliente, deleteCliente, putCliente } = require('../controllers/clientes.controller');

// cuando llega GET /clientes ejecuta getClientes
router.get('/', getClientes);
// cuando llega POST /clientes ejecuta postCliente
router.post('/', postCliente);
// cuando llega delete /clientes/:id ejecuta deleteCliente
router.delete('/:id', deleteCliente);
// cuando llega put /clientes/:id ejecuta putCliente
router.put('/:id', putCliente);

module.exports = router;