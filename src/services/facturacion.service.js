const fs = require('fs');
const path = require('path');

const clientesPath = path.join(__dirname, '../data/clientes.json');
const pedidosPath = path.join(__dirname, '../data/pedidos.json');

const leerJson = (ruta) => {
  if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
};

class FacturacionService {
  generarReporteFranquicias() {
    const clientes = leerJson(clientesPath);
    const pedidos = leerJson(pedidosPath);

    // 1. Filtramos solo los clientes que son "franquicia" y están activos
    const franquicias = clientes.filter(c => c.tipo === 'franquicia' && c.estado === 1);

    // 2. Construimos el reporte iterando sobre cada franquicia
    const reporte = franquicias.map(franquicia => {
      // Buscamos los pedidos de esta franquicia que ya fueron entregados
      const pedidosCompletados = pedidos.filter(p => 
        p.clienteId === franquicia.id && 
        p.estado === 'Entregado'
      );

      // Sumamos el total de esos pedidos
      const totalAdeudado = pedidosCompletados.reduce((suma, pedido) => suma + pedido.total, 0);

      return {
        clienteId: franquicia.id,
        nombreFranquicia: franquicia.nombre,
        pedidosEntregados: pedidosCompletados.length,
        totalAdeudado: totalAdeudado
      };
    });

    return reporte;
  }
}

module.exports = new FacturacionService();