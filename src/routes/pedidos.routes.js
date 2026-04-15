const { Router } = require('express');
const pedidosController = require('../controllers/pedidos.controller');

const router = Router();

router.get('/', pedidosController.obtenerTodos);
router.post('/', pedidosController.crear);
router.patch('/:id/estado', pedidosController.actualizarEstado);

module.exports = router;