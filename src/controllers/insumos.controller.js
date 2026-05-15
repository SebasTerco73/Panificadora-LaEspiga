const insumosService = require('../services/insumos.service');

class InsumosController {
  obtenerTodos = (req, res) => {
    try {
      const insumos = insumosService.obtenerTodos();
      res.status(200).json({ error: false, data: insumos });
    } catch (error) {
      res.status(500).json({ error: true, mensaje: error.message });
    }
  };

  crear = (req, res) => {
    try {
      const nuevoInsumo = insumosService.crear(req.body);
      res.status(201).json({ error: false, data: nuevoInsumo });
    } catch (error) {
      res.status(400).json({ error: true, mensaje: error.message });
    }
  };

  darDeBaja = (req, res) => {
    try {
      const insumo = insumosService.darDeBaja(req.params.id);
      res.status(200).json({ error: false, data: insumo, mensaje: "Insumo desactivado correctamente." });
    } catch (error) {
      res.status(400).json({ error: true, mensaje: error.message });
    }
  };
}

module.exports = new InsumosController();