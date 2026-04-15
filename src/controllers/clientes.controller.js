const { getClientesActivos, crearCliente, eliminarCliente, actualizarCliente } = require('../services/clientes.service');

const getClientes = (req, res) => {
  try {
    const clientesActivos = getClientesActivos();
    res.json(clientesActivos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo leer el archivo' });
  }
};

const postCliente = (req, res) => {
  try {
    const { nombre, email, tipo, direccion, telefono } = req.body;
    if (!nombre || !email || !tipo || !direccion || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoCliente = crearCliente(req.body);
    res.status(201).json({ ...nuevoCliente, message: 'Cliente creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el cliente' });
  }
};

const deleteCliente = (req, res) => {
  try {
    // agarra la id del cliente a eliminar desde los parámetros de la URL
    const id = parseInt(req.params.id);
    eliminarCliente(id);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el cliente' });
  }
};

const putCliente = (req, res) => {
  try {    
    const id = parseInt(req.params.id);
    const { nombre, email, tipo, direccion, telefono } = req.body;
    const clienteActualizado = actualizarCliente(id, { nombre, email, tipo, direccion, telefono });
    res.json(clienteActualizado, { message: 'Cliente actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el cliente' });
    console.log(error); // 👈 para ver exactamente qué falló en la consola del servidor
  }
};

module.exports = { getClientes, postCliente, deleteCliente, putCliente };