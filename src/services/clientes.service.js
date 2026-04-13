const fs = require('fs');

const leerClientes = () => {
  return JSON.parse(fs.readFileSync('./clientes.json', 'utf-8'));
};

const guardarClientes = (clientes) => {
  fs.writeFileSync('./clientes.json', JSON.stringify(clientes, null, 2));
};

const getClientesActivos = () => {
  const clientes = leerClientes();
  return clientes.filter(c => c.estado === 1);
};

const crearCliente = (datos) => {
  const clientes = leerClientes();
  const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
  const nuevoCliente = { ...datos, id: nuevoId,estado: 1 };
  clientes.push(nuevoCliente);
  guardarClientes(clientes);
  return nuevoCliente;
};

const eliminarCliente = (id) => {
  try {
    const clientes = leerClientes();
    const clienteIndex = clientes.findIndex(c => c.id === id);    
    if (clienteIndex === -1) {
      throw new Error('Cliente no encontrado');
    }
    clientes.splice(clienteIndex, 1);
    guardarClientes(clientes);
  } catch (error) {
    throw error;
  }
};

const actualizarCliente = (id, datos) => {
  try {
    const clientes = leerClientes();
    const clienteIndex = clientes.findIndex(c => c.id === id);
    if (clienteIndex === -1) {
      throw new Error('Cliente no encontrado');
    }
    clientes[clienteIndex] = { ...clientes[clienteIndex], ...datos };
    guardarClientes(clientes);
    return clientes[clienteIndex];
  } catch (error) {
        console.log(error);
        throw error;
  }
};

module.exports = { getClientesActivos, crearCliente, eliminarCliente, actualizarCliente };