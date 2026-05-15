// commonjs 
//const productosService = require('../services/productos.service');
// ES Modules
import productosService from '../services/productos.service.js';

class ProductosController {
  obtenerTodos = (req, res) => {
    try {
      const productos = productosService.obtenerTodos();
      res.render('productos', { productos });
    } catch (error) {
      res.status(500).json({ error: 'No se pudieron obtener los productos' });
    }
  };

  obtenerApi = async (req, res) => {
    try {
      const productos = await productosService.obtenerTodos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  };

  crear = async (req, res) => {
    try {
      const { nombre, categoria, precio, stock } = req.body;
      if (!nombre || !categoria || !precio || stock === undefined) {
        return res.status(400).json({ error: 'Faltan datos' });
      }
      const nuevo = await productosService.crear(req.body);
      res.status(201).json({ ok: true, producto: nuevo });
    } catch (error) {
      res.status(500).json({ error: 'No se pudo crear el producto' });
    }
  };

  actualizar = async (req, res) => {
    try {
      const { nombre, categoria, precio, stock } = req.body;
      const actualizado = await productosService.actualizar(req.params.id, {
        nombre, categoria, precio, stock
      });
      res.json({ ok: true, producto: actualizado });
    } catch (error) {
      res.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
  };

  darDeBaja = async (req, res) => {
    try {
      await productosService.darDeBaja(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

// commonjs
// module.exports = new ProductosController();
// ES Modules
export default new ProductosController();