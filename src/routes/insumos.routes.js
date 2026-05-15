const { Router } = require('express');
const insumosController = require('../controllers/insumos.controller');

const router = Router();

router.get('/', insumosController.obtenerTodos);
router.post('/', insumosController.crear);
router.delete('/:id', insumosController.darDeBaja); 

module.exports = router;