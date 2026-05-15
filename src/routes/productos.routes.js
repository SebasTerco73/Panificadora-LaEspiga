// commonjs
/*
const { Router } = require('express');
const productosController = require('../controllers/productos.controller');
*/
// ES Modules
import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';

const router = Router();

router.get('/', productosController.obtenerTodos);
router.post('/', productosController.crear);
router.delete('/:id', productosController.darDeBaja); 

// commonjs
// module.exports = router;
// ES Modules
export default router;
