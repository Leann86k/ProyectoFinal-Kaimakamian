// Array de productos
const productos = [
  {
    id: 1,
    nombre: "Hueso de juguete para perro",
    precio: 5000,
    imagen: "./assets/photos/huesojuguete.webp",
  },
  {
    id: 2,
    nombre: "Ratón de juguete para gato",
    precio: 3000,
    imagen: "./assets/photos/ratonjuguete.webp",
  },
  {
    id: 4,
    nombre: "Alimento de gato 3 kg (Gatti)",
    precio: 15000,
    imagen: "./assets/photos/Gatti 3kg.webp",
  },
  {
    id: 5,
    nombre: "Alimento de perro 8 kg (Cat Chow)",
    precio: 20000,
    imagen: "./assets/photos/Dog chow 8kg.webp",
  },
  {
    id: 6,
    nombre: "Alimento de gato 8 kg (Cat Chow)",
    precio: 25000,
    imagen: "./assets/photos/Cat chow 8kg.webp",
  },
  {
    id: 8,
    nombre: "Alimento de gato 8 kg (Excelent)",
    precio: 32000,
    imagen: "./assets/photos/Excellent 8kg.webp",
  },
];

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para mostrar los productos
const mostrarProductos = () => {
  const productosContainer = document.getElementById("productos");
  productosContainer.innerHTML = "";
  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.className = "product";
    productoDiv.innerHTML = `
<div class="card">
  <div class="row g-0">
    <div class="col-5 col-sm-4">
      <img src="${
        producto.imagen
      }" class="img-fluid w-20 img" alt="card-horizontal-image">
    </div>
    <div class="col-7 col-sm-8">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">$${producto.precio.toFixed(2)}</p>
  
      </div>
    </div>
  </div>
</div>
          
  <button onclick="agregarAlCarrito(${
    producto.id
  })">Agregar al carrito</button>  
  `;
    productosContainer.appendChild(productoDiv);
  });
};

//hacer acá lo de fetch, productos.json//

// Función para agregar un producto al carrito

const agregarAlCarrito = (id) => {
  const producto = productos.find((p) => p.id === id);
  carrito.push(producto);
  Toastify({
    text: `${producto.nombre} se agregó al carrito`,
    duration: 2500,
  }).showToast();
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

//Confirmación de compra

const comprarButton = document.getElementById("comprarButton");

comprarButton.addEventListener("click", () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: `¿Confirma la compra con monto $${mostrarCarrito()}?`,
      text: "No vas a poder revertir la operación!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar la compra",
      cancelButtonText: "No, ¡cancelar!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Compra realizada!",
          text: "Sus productos fueron comprados con exito",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Compra cancelada",
          text: "",
          icon: "error",
        });
      }
    });
});

// Función para mostrar el carrito
const mostrarCarrito = () => {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  carrito.forEach((producto, index) => {
    const item = document.createElement("li");
    item.className = "cart-item";
    item.innerHTML = `
            ${producto.nombre} - $${producto.precio.toFixed(2)}
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
    cartList.appendChild(item);
  });
  const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
  document.getElementById("resultado").textContent = `Total: $${total.toFixed(
    2
  )}`;
  return total;
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
    text: "Todos los productos han sido eliminados.",
    icon: "success",
    confirmButtonText: "OK",
  });
};

// Botón Borrar todo
const vaciarButton = document.getElementById("vaciarButton");
vaciarButton.addEventListener("click", vaciarCarrito);

// Inicializar la página
mostrarProductos();
mostrarCarrito();

// Manejo del menú hamburguesa
document.querySelector(".menu-button")?.addEventListener("click", () => {
  const menu = document.querySelector(".menu");
  menu?.classList.toggle("open");
});

const yearElement = document.getElementById("current_year");

const currentYear = new Date().getFullYear();

yearElement.textContent = currentYear;
