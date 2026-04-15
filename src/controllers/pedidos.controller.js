const pedidosService = require('../services/pedidos.service');

class PedidosController {
  obtenerTodos = (req, res) => {
    try {
      const pedidos = pedidosService.obtenerTodos();
      res.status(200).json({ error: false, data: pedidos });
    } catch (error) {
      res.status(500).json({ error: true, mensaje: error.message });
    }
  };

  crear = (req, res) => {
    try {
      const nuevoPedido = pedidosService.crear(req.body);
      res.status(201).json({ error: false, data: nuevoPedido, mensaje: "Pedido creado con éxito" });
    } catch (error) {
      res.status(400).json({ error: true, mensaje: error.message });
    }
  };

  actualizarEstado = (req, res) => {
    try {
      const pedidoActualizado = pedidosService.actualizarEstado(req.params.id, req.body.estado);
      res.status(200).json({ error: false, data: pedidoActualizado });
    } catch (error) {
      res.status(400).json({ error: true, mensaje: error.message });
    }
  };
}

module.exports = new PedidosController();