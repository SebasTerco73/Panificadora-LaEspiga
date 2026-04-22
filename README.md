# Panificadora La Espiga — Back-End (PFO1)

Back-End del proyecto **Panificadora La Espiga**. Es una app **Node.js + Express** con renderizado de vistas usando **Pug** y archivos estáticos en `public/`.

- Repo: https://github.com/SebasTerco73/Panificadora-LaEspiga
- Rama: `main`

## Tecnologías

- **Node.js** (CommonJS)
- **Express**
- **Pug** (motor de plantillas)
- **dotenv** (variables de entorno)
- **nodemon** (desarrollo)

## Requisitos

- Node.js (recomendado: LTS)
- npm

## Instalación

```bash
git clone https://github.com/SebasTerco73/Panificadora-LaEspiga.git
cd Panificadora-LaEspiga
npm install
```

## Configuración (.env)

El proyecto carga variables de entorno con `dotenv`.

Crear un archivo `.env` en la raíz (opcional si usás el puerto por defecto):

```env
PORT=3000
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

Servidor:
- `http://localhost:3000` (o el `PORT` configurado)

## Scripts (package.json)

- `npm run dev` → `nodemon index.js`
- `npm start` → `node index.js`

## Estructura del proyecto (árbol)

```text
Panificadora-LaEspiga/
├─ .gitignore
├─ app.js
├─ index.js
├─ package-lock.json
├─ package.json
├─ public/
│  ├─ img/
│  │  └─ override.png
│  └─ styles/
│     └─ styles.css
├─ src/
│  ├─ controllers/
│  │  ├─ clientes.controller.js
│  │  ├─ pedidos.controller.js
│  │  └─ productos.controller.js
│  ├─ data/
│  │  ├─ clientes.json
│  │  ├─ pedidos.json
│  │  └─ productos.json
│  ├─ middleware/
│  │  └─ logger.middleware.js
│  ├─ models/
│  │  └─ cliente.model.js
│  ├─ routes/
│  │  ├─ clientes.routes.js
│  │  ├─ pedidos.routes.js
│  │  └─ productos.routes.js
│  └─ services/
│     ├─ clientes.service.js
│     ├─ pedidos.service.js
│     └─ productos.service.js
└─ views/
   ├─ clientes.pug
   ├─ clientes_edit.pug
   ├─ clientes_form.pug
   └─ index.pug
```

## Datos / Persistencia

La persistencia es mediante archivos JSON ubicados en:

- `src/data/clientes.json`
- `src/data/productos.json`
- `src/data/pedidos.json`

## Manejo de errores (general)

- 404: `{"error":"Ruta no encontrada"}`
- 500: `{"error":"Error interno del servidor"}`

> Nota: El modulo clientes responden con HTML/redirects y en errores devuelven JSON.

---

# Endpoints

## Convenciones

- En **Clientes** se usa **render de vistas + formularios HTML** (respuestas HTML y `redirect`).
- En **Productos** y **Pedidos** se usa **API JSON** con forma típica:
  - OK: `{ "error": false, "data": ... }` 
  - Error: `{ "error": true, "mensaje": "..." }`

## Tabla de endpoints

### Home

| Método | Ruta | Tipo | Descripción | Request | Respuesta OK | Errores |
|---|---|---|---|---|---|---|
| GET | `/` | HTML | Renderiza `index.pug` | — | HTML | — |

### Clientes (`/clientes`) — HTML + formularios

| Método | Ruta | Tipo | Descripción | Request | Respuesta OK | Errores |
|---|---|---|---|---|---|---|
| GET | `/clientes/` | HTML | Lista clientes activos y renderiza `clientes.pug` | — | HTML (vista `clientes`) | 500 JSON: `{"error":"No se pudo leer el archivo"}` |
| GET | `/clientes/nuevo` | HTML | Muestra formulario de alta | — | HTML (vista `clientes_form`) | — |
| POST | `/clientes/` | HTML/Redirect | Crea cliente | Body (requerido): `nombre`, `email`, `tipo`, `direccion`, `telefono` | 302 Redirect → `/clientes` | 400 texto: `"Faltan datos"`; 500 JSON: `{"error":"No se pudo crear el cliente"}` |
| POST | `/clientes/:id/eliminar` | HTML/Redirect | Baja lógica (soft delete) de cliente | Params: `id` (number) | 302 Redirect → `/clientes` | 500 JSON: `{"error":"No se pudo eliminar el cliente"}` *(el service puede fallar por reglas de negocio)* |
| GET | `/clientes/:id/editar` | HTML | Muestra formulario de edición | Params: `id` (number) | HTML (vista `clientes_edit`) | 404 texto: `"Cliente no encontrado"` |
| POST | `/clientes/:id/editar` | HTML/Redirect | Edita cliente | Params: `id`; Body: `nombre`, `email`, `tipo`, `direccion`, `telefono` | 302 Redirect → `/clientes` | 500 JSON: `{"error":"No se pudo actualizar el cliente"}` |

**Regla de negocio (clientes):**
- No permite dar de baja si el cliente tiene pedidos con estado **"Pendiente"** o **"En Producción"**.

### Productos (`/productos`) — API JSON

| Método | Ruta | Tipo | Descripción | Request | Respuesta OK | Errores |
|---|---|---|---|---|---|---|
| GET | `/productos/` | JSON | Lista productos activos (`activo: true`) | — | 200: `{ "error": false, "data": [ ... ] }` | 500: `{ "error": true, "mensaje": "..." }` |
| POST | `/productos/` | JSON | Crea un producto | Body: objeto libre (se persiste con `id` autogenerado y `activo: true`) | 201: `{ "error": false, "data": {...}, "mensaje":"Producto creado con éxito" }` | 400: `{ "error": true, "mensaje": "..." }` |
| DELETE | `/productos/:id` | JSON | Baja lógica (soft delete) del producto | Params: `id` (string, ej `prod_ab12cd34`) | 200: `{ "error": false, "data": {...}, "mensaje":"Producto desactivado correctamente." }` | 400: `{ "error": true, "mensaje": "Producto no encontrado" }` o `"No se puede dar de baja: El producto está en pedidos activos."` |

**Regla de negocio (productos):**
- No permite dar de baja si el producto aparece en pedidos con estado **"Pendiente"** o **"En Producción"**.

### Pedidos (`/pedidos`) — API JSON

| Método | Ruta | Tipo | Descripción | Request | Respuesta OK | Errores |
|---|---|---|---|---|---|---|
| GET | `/pedidos/` | JSON | Lista todos los pedidos | — | 200: `{ "error": false, "data": [ ... ] }` | 500: `{ "error": true, "mensaje": "..." }` |
| POST | `/pedidos/` | JSON | Crea un pedido | Body: `{ "clienteId": number, "items": [{ "productoId": string, "cantidad": number>0 }] }` | 201: `{ "error": false, "data": {...}, "mensaje":"Pedido creado con éxito" }` | 400: `{ "error": true, "mensaje": "..." }` (cliente inválido/inactivo, producto inexistente/inactivo, cantidad inválida, etc.) |
| PATCH | `/pedidos/:id/estado` | JSON | Cambia el estado del pedido | Params: `id` (string, ej `ped_ab12cd34`); Body: `{ "estado": "Pendiente" \| "En Producción" \| "Despachado" \| "Entregado" }` | 200: `{ "error": false, "data": {...} }` | 400: `{ "error": true, "mensaje": "Estado inválido." }` o `"Pedido no encontrado."` |

---

## **👨‍🎓👩‍🎓 Equipo**

| [<img src="https://avatars.githubusercontent.com/u/128065511?v=4" width="115"><br><sub>Ailén Páez</sub><br><sub>a.jorgelinapaez@gmail.com</sub>](https://github.com/ailenpaez) | [<img src="https://avatars.githubusercontent.com/u/124319050?v=4" width="115"><br><sub>Marcela Herrera</sub><br><sub>mfh.jea1814@gmail.com</sub>](https://github.com/HerreraMarcela) | [<img src="https://avatars.githubusercontent.com/u/95725306?v=4" width="115"><br><sub>Neyel Vilaseco</sub><br><sub>neyelvilaseco@gmail.com</sub>](https://github.com/NeyelVila) | [<img src="https://avatars.githubusercontent.com/u/138830413?v=4" width="115"><br><sub>Sebastián Matías Puche</sub><br><sub>sebasterco10@gmail.com</sub>](https://github.com/SebasTerco73) |
| :---: | :---: | :---: | :---: | 

---

## Licencia

Proyecto con fines educativos (PFO1). Repositorio: https://github.com/SebasTerco73/Panificadora-LaEspiga
