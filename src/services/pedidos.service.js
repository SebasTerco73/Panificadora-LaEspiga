// commonjs
/*
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
*/
// ES Modules
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Para obtener __dirname en ES Modules, se necesita esta configuración adicional
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas

// Rutas a nuestras "tablas" en la base de datos
const pedidosPath = path.join(__dirname, '../data/pedidos.json');
const clientesPath = path.join(__dirname, '../data/clientes.json');
const productosPath = path.join(__dirname, '../data/productos.json');
const recetasPath = path.join(__dirname, '../data/recetas.json');  
const insumosPath = path.join(__dirname, '../data/insumos.json');

const leerJson = (ruta) => {
  if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
};

const guardarJson = (ruta, datos) => {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

class PedidosService {
  obtenerTodos() {
    return leerJson(pedidosPath);
  }

  crear(datos) {
    const { clienteId, items } = datos;
    const clientes = leerJson(clientesPath);
    const productosDb = leerJson(productosPath);
    const pedidos = leerJson(pedidosPath);

    // Validar Cliente (Ajustado para usar estado: 1)
    const cliente = clientes.find(c => c.id === clienteId && c.estado === 1);
    if (!cliente) throw new Error("Cliente inválido o inactivo.");

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

  //AUTOMATIZACIÓN DE STOCK

  actualizarEstado(id, nuevoEstado) {
    const estadosPermitidos = ['Pendiente', 'En Producción', 'Despachado', 'Entregado'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error("Estado inválido.");
    }

    const pedidos = leerJson(pedidosPath);
    const index = pedidos.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Pedido no encontrado.");

    const pedido = pedidos[index];

    // Solo descontamos stock si pasa a Producción por primera vez
    if (pedido.estado === 'Pendiente' && nuevoEstado === 'En Producción') {
      const recetas = leerJson(recetasPath);
      const insumos = leerJson(insumosPath);

      // 1. Calcular insumos totales requeridos para todo el pedido
      const insumosRequeridos = {}; 

      for (const item of pedido.productos) {
        const receta = recetas.find(r => r.productoId === item.productoId);
        if (!receta) {
          throw new Error(`El producto ${item.nombre} no tiene una receta configurada. Imposible producir.`);
        }

        // Multiplicamos la cantidad del ingrediente por la cantidad de productos pedidos
        for (const ing of receta.ingredientes) {
          if (!insumosRequeridos[ing.insumoId]) insumosRequeridos[ing.insumoId] = 0;
          insumosRequeridos[ing.insumoId] += (ing.cantidad * item.cantidad);
        }
      }

      // 2. Verificar que haya stock suficiente de todo ANTES de descontar
      for (const insumoId in insumosRequeridos) {
        const insumoDb = insumos.find(i => i.id === insumoId);
        if (!insumoDb) throw new Error(`Insumo ${insumoId} no encontrado.`);

        const cantidadNecesaria = insumosRequeridos[insumoId];
        if (insumoDb.stockActual < cantidadNecesaria) {
          const faltante = cantidadNecesaria - insumoDb.stockActual;
          throw new Error(`Stock insuficiente de ${insumoDb.nombre}. Faltan ${faltante} ${insumoDb.unidad}.`);
        }
      }

      // 3. Descontar el stock (Si llegamos aquí, es porque alcanza todo)
      for (const insumoId in insumosRequeridos) {
        const insumoIndex = insumos.findIndex(i => i.id === insumoId);
        insumos[insumoIndex].stockActual -= insumosRequeridos[insumoId];
      }

      // Guardamos el nuevo stock en la base de datos de insumos
      guardarJson(insumosPath, insumos);
    }

    // Actualizamos el estado del pedido y guardamos
    pedido.estado = nuevoEstado;
    guardarJson(pedidosPath, pedidos);
    
    return pedido;
  }
}

// commonjs
// module.exports = new PedidosService();
// ES Modules
export default new PedidosService();
