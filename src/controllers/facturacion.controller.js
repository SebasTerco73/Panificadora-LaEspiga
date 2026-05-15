const facturacionService = require('../services/facturacion.service');

class FacturacionController {
  obtenerReporte = (req, res) => {
    try {
      const reporte = facturacionService.generarReporteFranquicias();
      res.status(200).json({ error: false, data: reporte });
    } catch (error) {
      res.status(500).json({ error: true, mensaje: error.message });
    }
  };
}

module.exports = new FacturacionController();