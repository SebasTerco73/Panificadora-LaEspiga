const { Router } = require('express');
const productosController = require('../controllers/productos.controller');

const router = Router();

router.get('/', productosController.obtenerTodos);
router.post('/', productosController.crear);
router.delete('/:id', productosController.darDeBaja); 

module.exports = router;