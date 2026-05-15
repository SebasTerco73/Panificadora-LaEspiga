import Producto from '../models/Producto.js';
import Pedido from '../models/Pedido.js';

class ProductosService {
  async obtenerTodos() {
    return await Producto.find({ activo: true });
  }

  async obtenerPorId(id) {
    return await Producto.findOne({ _id: id, activo: true });
  }

  async crear(datos) {

    const nuevoProducto = new Producto({
      ...datos,
      activo: true
    });

    return await nuevoProducto.save();
  }

  async actualizar(id, datos) {
    const actualizado = await Producto.findByIdAndUpdate(id, datos, { new: true });
   // new true devuelve el documento ya actualizado en lugar del original
    if(!actualizado) {
      throw new Error("Producto no encontrado");
    }

    return actualizado;
  }

  async darDeBaja(id) {
    // 1. Regla de negocio: ¿Está en un pedido en curso?
    const pedidoActivo = await Pedido.findOne({
      "productos.productoId": id,
      estado: { $in: ['Pendiente', 'En Producción'] }
    });

    if (pedidoActivo) {
      throw new Error("No se puede dar de baja: El producto está en un pedido en curso.");
    }

    // 2. Si pasa la validación, hacemos el soft delete
    return await Producto.findByIdAndUpdate(id, { activo: false }, { new: true });
  }
}

export default new ProductosService();
