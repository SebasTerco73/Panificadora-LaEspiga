const form        = document.getElementById('formCliente');
const tabla       = document.getElementById('tablaClientes');
const btnCancelar = document.getElementById('btnCancelar');

let editando = false;
let idActual = null;

document.getElementById('inputTelefono').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

async function cargarClientes() {
  const res      = await fetch('/clientes/api');
  const clientes = await res.json();

  tabla.innerHTML = '';
  clientes.forEach(c => {
    tabla.innerHTML += `
      <tr id="fila-${c._id}">
        <td>${c.nombre}</td>
        <td>${c.email}</td>
        <td>${c.telefono}</td>
        <td>${c.direccion}</td>
        <td>${c.tipo}</td>
        <td>
          <button class="btn" onclick="editar('${c._id}','${c.nombre}','${c.email}','${c.telefono}','${c.direccion}','${c.tipo}')">
            Editar
          </button>
          <button class="btn eliminar" onclick="eliminar('${c._id}')">X</button>
        </td>
      </tr>`;
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    nombre:    document.getElementById('inputNombre').value,
    email:     document.getElementById('inputEmail').value,
    telefono:  document.getElementById('inputTelefono').value,
    direccion: document.getElementById('inputDireccion').value,
    tipo:      document.getElementById('inputTipo').value,
  };

  const metodo = editando ? 'PUT' : 'POST';
  const url    = editando ? `/clientes/${idActual}` : '/clientes';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const err = await res.json();
    alert('Error: ' + (Array.isArray(err.error) ? err.error.join(', ') : err.error));
    return;
  }

  resetForm();
  cargarClientes();
});

function editar(id, nombre, email, telefono, direccion, tipo) {
  idActual  = id;
  editando  = true;

  document.getElementById('inputNombre').value    = nombre;
  document.getElementById('inputEmail').value     = email;
  document.getElementById('inputTelefono').value  = telefono;
  document.getElementById('inputDireccion').value = direccion;
  document.getElementById('inputTipo').value      = tipo;

  btnCancelar.style.display = 'inline';
}

async function eliminar(id) {
  if (!confirm('¿Eliminar cliente?')) return;

  const res = await fetch(`/clientes/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const err = await res.json();
    alert('Error: ' + err.error);
    return;
  }

  resetForm();
  cargarClientes();
}

btnCancelar.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editando  = false;
  idActual  = null;
  btnCancelar.style.display = 'none';
}

cargarClientes();