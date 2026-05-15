//const { Router } = require('express');
//const insumosController = require('../controllers/insumos.controller');
//const router = Router();
import { Router } from 'express';
import insumosController from '../controllers/insumos.controller.js';
const router = Router();

router.get('/', insumosController.obtenerTodos);
router.post('/', insumosController.crear);
router.delete('/:id', insumosController.darDeBaja); 

//module.exports = router;
export default router;