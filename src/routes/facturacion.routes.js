const { Router } = require('express');
const facturacionController = require('../controllers/facturacion.controller');

const router = Router();

// Endpoint para obtener lo que debe cada franquicia
router.get('/franquicias', facturacionController.obtenerReporte);

module.exports = router;