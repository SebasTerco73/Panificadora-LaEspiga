// commonjs
/*
const { Router } = require('express');
const pedidosController = require('../controllers/pedidos.controller');
*/

// ES Modules
import { Router } from 'express';
import pedidosController from '../controllers/pedidos.controller.js';

const router = Router();

router.get('/', pedidosController.obtenerTodos);
router.post('/', pedidosController.crear);
router.patch('/:id/estado', pedidosController.actualizarEstado);

// commonjs
// module.exports = router;
// ES Modules
export default router;
