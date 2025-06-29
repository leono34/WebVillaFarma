let productos = [
    { id: 1, nombre: "Paracetamol", precio: 5, categoria: "medicina", imagen: "Imagenes/paracetamol.jpg" },
    { id: 2, nombre: "Ibuprofeno", precio: 8, categoria: "medicina", imagen: "Imagenes/ibuprofeno.png" },
    { id: 3, nombre: "Alcohol en gel", precio: 4, categoria: "higiene", imagen: "Imagenes/alcohol_gel.png" },
    { id: 4, nombre: "Papel higiénico", precio: 2, categoria: "higiene", imagen: "Imagenes/papel_higienico.png" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.getElementById("registroForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const dni = document.getElementById("dni").value;
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const cumple = document.getElementById("cumple").value;
  const celular = document.getElementById("celular").value;

  const usuario = { dni, nombres, apellidos, cumple, celular };
  localStorage.setItem("usuario", JSON.stringify(usuario));
  document.getElementById("registro-container").classList.add("d-none");
  document.getElementById("catalogo-container").classList.remove("d-none");
  cargarCatalogo();
});

function cargarCatalogo(filtro = "") {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";
    const productosFiltrados = filtro ? productos.filter(p => p.categoria === filtro) : productos;

    productosFiltrados.forEach(producto => {
        const card = document.createElement("div");
        card.className = "col-md-3";
        card.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}"> <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">S/ ${producto.precio}</p>
                    <input type="number" min="1" value="1" class="form-control mb-2" id="cantidad-${producto.id}"/>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
                </div>
            </div>`;
        catalogo.appendChild(card);
    });
}

function filtrarProductos() {
  const filtro = document.getElementById("categoriaFiltro").value;
  cargarCatalogo(filtro);
}

function agregarAlCarrito(id) {
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(p => p.id === id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito");
}

function mostrarCarrito() {
  document.getElementById("catalogo-container").classList.add("d-none");
  document.getElementById("carrito-container").classList.remove("d-none");
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";
  carrito.forEach((item, i) => {
    contenedor.innerHTML += `
      <div class="card mb-2 p-2">
        ${item.nombre} - Cantidad: ${item.cantidad} - Total: S/ ${item.cantidad * item.precio}
        <button class="btn btn-sm btn-danger float-end" onclick="eliminarProducto(${i})">Eliminar</button>
      </div>`;
  });
}

function eliminarProducto(i) {
  carrito.splice(i, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

function seguirComprando() {
  document.getElementById("carrito-container").classList.add("d-none");
  document.getElementById("catalogo-container").classList.remove("d-none");
}

function finalizarCompra() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const metodo = document.getElementById("metodoPago").value;
    const distrito = document.getElementById("distrito").value;
	const direccionExacta = document.getElementById("direccionExacta").value; // <-- Captura el valor de la nueva dirección
    const boleta = document.getElementById("boleta");
    let total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Ocultar el contenedor del carrito y mostrar solo la boleta
    document.getElementById("carrito-container").classList.add("d-none");
    document.getElementById("registro-container").classList.add("d-none"); // Asegurarse de que el registro también esté oculto
    document.getElementById("catalogo-container").classList.add("d-none"); // Asegurarse de que el catálogo también esté oculto

    // Mostrar el contenedor de la boleta (si es un contenedor separado, o el div de boleta lo puedes hacer más grande)
	document.getElementById("boleta-container").classList.remove("d-none");
    // Para este caso, vamos a hacer que el div 'boleta' se muestre como un bloque principal
    // Puedes envolver el div 'boleta' en un nuevo contenedor si deseas que ocupe una nueva sección completa.
    // Por ahora, asumiremos que el div 'boleta' contendrá todo lo que necesitas mostrar.

    boleta.innerHTML = `
        <div class="container my-4"> <h4>Boleta de Venta</h4>
            <p><strong>Cliente:</strong> ${usuario.nombres} ${usuario.apellidos} | <strong>DNI:</strong> ${usuario.dni}</p>
            <p><strong>Celular:</strong> ${usuario.celular} | <strong>Dirección:</strong> ${direccionExacta}, ${distrito}</p>
            <ul>${carrito.map(item => `<li>${item.nombre} x${item.cantidad} - S/ ${item.cantidad * item.precio}</li>`).join("")}</ul>
            <p><strong>Total: S/ ${total}</strong></p>
            <p><strong>Método de Pago:</strong> ${metodo}</p>
            <button class="btn btn-primary mt-2" onclick="window.print()">Imprimir</button>
            <button class="btn btn-secondary mt-2 ms-2" onclick="volverInicio()">Volver al Inicio</button> </div>
    `;

    // Quitar la clase d-none al contenedor de la boleta si lo tuvieras,
    // o simplemente asegurar que el 'boleta' div sea visible.
    // Como el div 'boleta' está dentro del carrito-container, necesitas sacarlo
    // o manejar su visibilidad de forma diferente.

    // Si tu div "boleta" siempre es visible y solo se llena de contenido,
    // entonces no necesitas un "d-none" en él.
    // Pero si "boleta" estuviera envuelto en un contenedor propio con "d-none", lo mostrarías aquí.

    localStorage.removeItem("carrito");
    carrito = [];
}

// Además, necesitarás una nueva función para "Volver al Inicio" o "Nueva Compra"
function volverInicio() {
    // Ocultar todo
    document.getElementById("registro-container").classList.add("d-none");
    document.getElementById("catalogo-container").classList.add("d-none");
    document.getElementById("carrito-container").classList.add("d-none");
    document.getElementById("boleta").innerHTML = ""; // Limpiar la boleta

    // Mostrar el registro o el catálogo, según lo que quieras que sea el "inicio"
    // Si quieres que inicie de nuevo con el registro:
    // document.getElementById("registro-container").classList.remove("d-none");

    // Si quieres que vuelva al catálogo directamente (asumiendo que el usuario ya está registrado):
    document.getElementById("catalogo-container").classList.remove("d-none");
    cargarCatalogo(); // Recargar el catálogo
}