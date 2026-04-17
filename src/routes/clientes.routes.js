const express = require('express');
const router = express.Router();

const {
  getClientes,
  postCliente,
  deleteCliente,
  putCliente
} = require('../controllers/clientes.controller');

const { getClientesActivos } = require('../services/clientes.service');

// LISTAR
router.get('/', getClientes);

// FORM CREAR
router.get('/nuevo', (req, res) => {
  res.render('clientes_form');
});

// CREAR
router.post('/', postCliente);

// ELIMINAR
router.post('/:id/eliminar', deleteCliente);

// FORM EDITAR
router.get('/:id/editar', (req, res) => {
  const id = parseInt(req.params.id);
  const clientes = getClientesActivos();
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).send("Cliente no encontrado");
  }

  res.render('clientes_edit', { cliente });
});

// EDITAR
router.post('/:id/editar', putCliente);

module.exports = router;