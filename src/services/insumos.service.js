const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const insumosPath = path.join(__dirname, '../data/insumos.json');

const leerInsumos = () => {
  if (!fs.existsSync(insumosPath)) fs.writeFileSync(insumosPath, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(insumosPath, 'utf-8'));
};

const guardarInsumos = (datos) => {
  fs.writeFileSync(insumosPath, JSON.stringify(datos, null, 2));
};

class InsumosService {
  obtenerTodos() {
    const insumos = leerInsumos();
    return insumos.filter(i => i.activo);
  }

  crear(datos) {
    const insumos = leerInsumos();
    const nuevoInsumo = {
      id: `ins_${crypto.randomBytes(4).toString('hex')}`,
      ...datos,
      activo: true
    };
    
    insumos.push(nuevoInsumo);
    guardarInsumos(insumos);
    return nuevoInsumo;
  }

  darDeBaja(id) {
    const insumos = leerInsumos();
    const index = insumos.findIndex(i => i.id === id);
    
    if (index === -1) throw new Error("Insumo no encontrado");

    // Baja lógica
    insumos[index].activo = false;
    guardarInsumos(insumos);
    
    return insumos[index];
  }
}

module.exports = new InsumosService();