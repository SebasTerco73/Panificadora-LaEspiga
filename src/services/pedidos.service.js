const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const pedidosPath = path.join(__dirname, '../data/pedidos.json');
const clientesPath = path.join(__dirname, '../data/clientes.json');
const productosPath = path.join(__dirname, '../data/productos.json');

const leerJson = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf-8'));
const guardarJson = (ruta, datos) => fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

class PedidosService {
  obtenerTodos() {
    return leerJson(pedidosPath);
  }

  crear(datos) {
    const { clienteId, items } = datos;
    const clientes = leerJson(clientesPath);
    const productosDb = leerJson(productosPath);
    const pedidos = leerJson(pedidosPath);

    // 1. Validar Cliente (Ajustado a tu modelo de datos)
    const cliente = clientes.find(c => c.id === clienteId && c.estado === 1);
    if (!cliente) throw new Error("Cliente inválido o inactivo.");
    
    // 2. Validar Productos y calcular total
    let total = 0;
    const productosValidados = items.map(item => {
      const producto = productosDb.find(p => p.id === item.productoId && p.activo);
      if (!producto) throw new Error(`El producto ${item.productoId} no existe o está inactivo.`);
      if (item.cantidad <= 0) throw new Error(`La cantidad para ${producto.nombre} debe ser mayor a 0.`);
      
      total += producto.precio * item.cantidad;
      return {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      };
    });

    const nuevoPedido = {
      id: `ped_${crypto.randomBytes(4).toString('hex')}`,
      clienteId,
      nombreCliente: cliente.nombre,
      productos: productosValidados,
      total,
      estado: "Pendiente",
      fechaCreacion: new Date().toISOString()
    };

    pedidos.push(nuevoPedido);
    guardarJson(pedidosPath, pedidos);
    
    return nuevoPedido;
  }

  actualizarEstado(id, nuevoEstado) {
    const estadosPermitidos = ['Pendiente', 'En Producción', 'Despachado', 'Entregado'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error("Estado inválido.");
    }

    const pedidos = leerJson(pedidosPath);
    const index = pedidos.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Pedido no encontrado.");

    pedidos[index].estado = nuevoEstado;
    guardarJson(pedidosPath, pedidos);
    
    return pedidos[index];
  }
}

module.exports = new PedidosService();