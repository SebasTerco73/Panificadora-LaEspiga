// commonjs
/*
const { Router } = require('express');
const productosController = require('../controllers/productos.controller');
*/
// ES Modules
import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';
import productosService from '../services/productos.service.js';

const router = Router();

router.get('/', productosController.obtenerTodos);
router.get('/api', productosController.obtenerApi);
router.post('/', productosController.crear);
router.put('/:id', productosController.actualizar);
router.delete('/:id', productosController.darDeBaja); 

// commonjs
// module.exports = router;
// ES Modules
export default router;
