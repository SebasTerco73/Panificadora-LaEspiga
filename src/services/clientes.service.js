const fs = require('fs');
const path = require('path');
const Cliente = require('../models/cliente.model');

// Rutas absolutas
const clientesPath = path.join(__dirname, '../data/clientes.json');
const pedidosPath = path.join(__dirname, '../data/pedidos.json');

// Funciones auxiliares con validación de existencia
const leerClientes = () => {
  if (!fs.existsSync(clientesPath)) fs.writeFileSync(clientesPath, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(clientesPath, 'utf-8'));
};

const leerPedidos = () => {
  if (!fs.existsSync(pedidosPath)) fs.writeFileSync(pedidosPath, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
};

const guardarClientes = (clientes) => {
  fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
};

// MÉTODOS

const getClientesActivos = () => {
  const clientes = leerClientes();
  return clientes.filter(c => c.estado === 1);
};

const crearCliente = (datos) => {
  const clientes = leerClientes();
  const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
  const nuevoCliente = new Cliente({ ...datos, id: nuevoId, estado: 1 });
  clientes.push(nuevoCliente);
  guardarClientes(clientes);
  return nuevoCliente;
};

const actualizarCliente = (id, datos) => {
  const clientes = leerClientes();
  const clienteIndex = clientes.findIndex(c => c.id === Number(id));

  if (clienteIndex === -1) {
    throw new Error('Cliente no encontrado');
  }

  const clienteActual = clientes[clienteIndex];

  const datosPermitidos = {};

  // Cambiar solo los campos que vienen en el body (si vienen)
  if (datos.nombre !== undefined) datosPermitidos.nombre = datos.nombre;
  if (datos.email !== undefined) datosPermitidos.email = datos.email;
  if (datos.tipo !== undefined) datosPermitidos.tipo = datos.tipo;
  if (datos.direccion !== undefined) datosPermitidos.direccion = datos.direccion;
  if (datos.telefono !== undefined) datosPermitidos.telefono = datos.telefono;

  const clienteActualizado = new Cliente({
    ...clienteActual,
    ...datosPermitidos
  });

  clientes[clienteIndex] = clienteActualizado;
  guardarClientes(clientes);

  return clienteActualizado;
};

// REGLA DE BAJA (Soft Delete)
const eliminarCliente = (id) => {
  const clientes = leerClientes();
  const pedidos = leerPedidos();
  
  const clienteIndex = clientes.findIndex(c => c.id === Number(id));
  if (clienteIndex === -1) {
    throw new Error('Cliente no encontrado');
  }

  // 1. Validar que no tenga pedidos activos
  const tienePedidosActivos = pedidos.some(pedido => 
    pedido.clienteId === Number(id) && 
    ['Pendiente', 'En Producción'].includes(pedido.estado)
  );

  if (tienePedidosActivos) {
    throw new Error('No se puede dar de baja: El cliente tiene pedidos en curso.');
  }

  // 2. Baja lógica en lugar de splice
  clientes[clienteIndex].estado = 0;
  guardarClientes(clientes);
  
  return clientes[clienteIndex]; // Retornamos el cliente modificado
};

module.exports = { getClientesActivos, crearCliente, eliminarCliente, actualizarCliente };