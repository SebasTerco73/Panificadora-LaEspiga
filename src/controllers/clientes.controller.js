// EcmaScript Modules - importación de funciones desde el servicio de clientes
import {
  getClientesActivos,
  getClientesActivosPorId,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
} from "../services/clientes.service.js";

const getClientes = async (req, res) => {
  try {
    const clientesActivos = await getClientesActivos();
    res.render("clientes", {
      title: "Clientes",
      clientes: clientesActivos,
    });
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los clientes" });
  }
};

const postCliente = async (req, res) => {
  try {
    const { 
      nombre, 
      email, 
      tipo, 
      direccion, 
      telefono 
    } = req.body;

    if (
      !nombre || 
      !email || 
      !tipo || 
      !direccion || 
      !telefono
    ) {
      return res
      .status(400)
      .send("Faltan datos");
    }
    const nuevo = await crearCliente(req.body);
    res.status(201).json({ ok: true, cliente: nuevo }); // ← JSON, no redirect

  } catch (error) {
    console.log(error);
     if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ error: mensajes });
    }
    res.status(500).json({ error: "No se pudo crear el cliente" });
  }
};

const deleteCliente = async(req, res) => {
  try {
    // agarra la id del cliente a eliminar desde los parámetros de la URL
    const id = req.params.id;
    await eliminarCliente(id);
    res.json({ ok: true }); 

  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el cliente" });
  }
};

const putCliente = async(req, res) => {
  try {
    const id = req.params.id;

    const { 
      nombre, 
      email, 
      tipo, 
      direccion, 
      telefono
    } = req.body;

    const actualizado = await actualizarCliente(id, {
      nombre,
      email,
      tipo,
      direccion,
      telefono,
    });

    res.json({ ok: true, cliente: actualizado }); // ← JSON, no redirect

  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el cliente" });
  }
};

// ES Modules - no poner default si se exportan varias cosas
export { 
  getClientes, 
  postCliente, 
  deleteCliente, 
  putCliente };
