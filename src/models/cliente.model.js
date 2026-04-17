class Cliente {
  constructor({ id, nombre, email, tipo, direccion, telefono, estado = 1 }) {
    if (!nombre || !email) {
      throw new Error('Nombre y email son obligatorios');
    }

    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.tipo = tipo;
    this.direccion = direccion;
    this.telefono = telefono;
    this.estado = estado;
  }
}

module.exports = Cliente;