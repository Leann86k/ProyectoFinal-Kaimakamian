let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

// Función para obtener productos desde el archivo JSON local
const obtenerProductos = async () => {
  try {
    const response = await fetch("productos.json");
    if (!response.ok) throw new Error("Error en la red");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Función para mostrar los productos
const mostrarProductos = (productos) => {
  const productosContainer = document.getElementById("productos");
  productosContainer.innerHTML = productos
    .map(
      ({ id, imagen, nombre, precio }) => `
   
            <div class="card rounded float-start justify-content-center align-items-center d-flex">
                <img class="img-fluid " src="${imagen}" alt="${nombre}">
                <h5>${nombre}</h5>
                <p>$${precio.toFixed(2)}</p>
                <button onclick="agregarAlCarrito(${id})">Agregar al carrito</button>
            </div>
       
    `
    )
    .join("");
};

// Función para agregar un producto al carrito
const agregarAlCarrito = (id) => {
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    carrito.push(producto);
    Toastify({
      text: `${producto.nombre} se agregó al carrito`,
      duration: 2500,
    }).showToast();
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
};

// Función para mostrar el carrito
const mostrarCarrito = () => {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = carrito
    .map(
      ({ nombre, precio }, index) => `
        <li class="cart-item">
            ${nombre} - $${precio.toFixed(2)}
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        </li>
    `
    )
    .join("");

  const total = carrito.reduce((sum, { precio }) => sum + precio, 0);
  document.getElementById("resultado").textContent = `Total: $${total.toFixed(
    2
  )}`;
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = (index) => {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

// Función para vaciar el carrito
const vaciarCarrito = () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  Swal.fire({
    title: "Carrito vaciado",
    text: "OPERACIÓN REALIZADA CON EXITO",
    icon: "success",
    confirmButtonText: "OK",
  });
};

// Botón Borrar todo
document
  .getElementById("vaciarButton")
  .addEventListener("click", vaciarCarrito);

// Confirmación de compra
document.getElementById("comprarButton").addEventListener("click", () => {
  const total = carrito.reduce((sum, { precio }) => sum + precio, 0);

  if (total === 0) {
    Swal.fire({
      title: "El carrito está vacío",
      text: "Agrega productos antes de comprar.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  Swal.fire({
    title: `¿Confirma la compra con monto $${total.toFixed(2)}?`,
    text: "No podrás revertir la operación!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar la compra",
    cancelButtonText: "No, ¡cancelar!",
    customClass: {
      confirmButton: "boton-confirm",
      cancelButton: "boton-cancel",
    },

    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Compra realizada!",
        text: "Sus productos fueron comprados con éxito.",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Compra cancelada",
        icon: "error",
      });
    }
  });
});

// Inicializar la página
document.addEventListener("DOMContentLoaded", async () => {
  productos = await obtenerProductos();
  mostrarProductos(productos);
  mostrarCarrito();
});
