const productosService = require('../services/productos.service');

class ProductosController {
  obtenerTodos = (req, res) => {
    try {
      const productos = productosService.obtenerTodos();
      res.status(200).json({ error: false, data: productos });
    } catch (error) {
      res.status(500).json({ error: true, mensaje: error.message });
    }
  };

    crear = (req, res) => {
      try {
        const nuevoProducto = productosService.crear(req.body);
        res.status(201).json({ error: false, data: nuevoProducto, mensaje: "Producto creado con éxito" });
      } catch (error) {
        res.status(400).json({ error: true, mensaje: error.message });
      }
    };

  darDeBaja = (req, res) => {
    try {
      const producto = productosService.darDeBaja(req.params.id);
      res.status(200).json({ error: false, data: producto, mensaje: "Producto desactivado correctamente." });
    } catch (error) {
      res.status(400).json({ error: true, mensaje: error.message });
    }
  };
}

module.exports = new ProductosController();