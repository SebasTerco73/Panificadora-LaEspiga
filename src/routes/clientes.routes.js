// ECMAScript Modules
import express from 'express';
import { 
  getClientes, 
  postCliente, 
  deleteCliente, 
  putCliente
} from '../controllers/clientes.controller.js';

import { getClientesActivos } from '../services/clientes.service.js';

const router = express.Router();

// LISTAR
router.get('/', getClientes);

// NUEVA RUTA: devuelve JSON con todos los clientes para que el fetch la consuma
router.get('/api', async (req, res) => {
  try {
    const clientes = await getClientesActivos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// CREAR
router.post('/', postCliente);

// FORM EDITAR
router.put('/:id', putCliente);

// ELIMINAR
router.delete('/:id', deleteCliente);

// ECMAScript Modules
export default router;