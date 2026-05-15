const { Router } = require('express');
const recetasController = require('../controllers/recetas.controller');

const router = Router();

router.get('/', recetasController.obtenerTodas);
router.get('/producto/:productoId', recetasController.obtenerPorProducto);
router.post('/', recetasController.crear);

module.exports = router;