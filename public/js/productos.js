// public/js/productos.js

const form        = document.getElementById('formProducto');
const tabla       = document.getElementById('tablaProductos');
const btnCancelar = document.getElementById('btnCancelar');

let editando = false;
let idActual = null;

async function cargarProductos() {
  const res       = await fetch('/productos/api');
  const productos = await res.json();

  tabla.innerHTML = '';
  productos.forEach(p => {
    tabla.innerHTML += `
      <tr id="fila-${p._id}">
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>$${p.precio}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn" onclick="editar('${p._id}','${p.nombre}','${p.categoria}',${p.precio},${p.stock})">
            Editar
          </button>
          <button class="btn eliminar" onclick="eliminar('${p._id}')">X</button>
        </td>
      </tr>`;
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    nombre:    document.getElementById('inputNombre').value,
    categoria: document.getElementById('inputCategoria').value,
    precio:    Number(document.getElementById('inputPrecio').value),
    stock:     Number(document.getElementById('inputStock').value),
  };

  const metodo = editando ? 'PUT' : 'POST';
  const url    = editando ? `/productos/${idActual}` : '/productos';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const err = await res.json();
    alert('Error: ' + err.error);
    return;
  }

  resetForm();
  cargarProductos();
});

function editar(id, nombre, categoria, precio, stock) {
  idActual  = id;
  editando  = true;

  document.getElementById('inputNombre').value    = nombre;
  document.getElementById('inputCategoria').value = categoria;
  document.getElementById('inputPrecio').value    = precio;
  document.getElementById('inputStock').value     = stock;

  btnCancelar.style.display = 'inline';
}

async function eliminar(id) {
  if (!confirm('¿Dar de baja el producto?')) return;

  const res = await fetch(`/productos/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const err = await res.json();
    alert('Error: ' + err.error);
    return;
  }

  resetForm();
  cargarProductos();
}

btnCancelar.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editando  = false;
  idActual  = null;
  btnCancelar.style.display = 'none';
}

cargarProductos();