let productosJSON = [];
let totalCarrito;
let contenedor = document.querySelector(".productos");
let botonFinalizar = document.getElementById("finalizar");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let iconoCarrito = document.getElementById("icono-carrito")
carrito.length != 0 && dibujarTabla();

function dibujarTabla() {
  for (const producto of carrito) {
    document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><button class="btn btn-light" onclick="eliminar(event)">🗑️</button></td>
        </tr>
    `;
  }
  totalCarrito = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio,
    0
  );
  let infoTotal = document.getElementById("total");
  infoTotal.innerText = "Total a pagar $: " + totalCarrito;
}

function renderizarProds() {
  for (const producto of productosJSON) {
    let { img, id, nombre, precio } = producto;
    contenedor.innerHTML += `
        <div class="card">
        <img src="${img}">
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">$${precio}</p>
            <button id = "btn${id}" class="btn">COMPRAR</button>
        </div>
        </div>
`;
  }

  //EVENTOS
  productosJSON.forEach((producto) => {
    //evento para cada boton
    document
      .getElementById(`btn${producto.id}`)
      .addEventListener("click", function () {
        agregarAlCarrito(producto);
      });
  });
}

function agregarAlCarrito(productoComprado) {
  carrito.push(productoComprado);
  console.table(carrito);

  //sweet alert
  Swal.fire({
    title: productoComprado.nombre,
    text: "Agregado al carrito",
    imageUrl: productoComprado.foto,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: productoComprado.nombre,
    showConfirmButton: false,
    timer: 1500,
  });
  document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${productoComprado.id}</td>
            <td>${productoComprado.nombre}</td>
            <td>${productoComprado.precio}</td>
            <td><button class="btn btn-light" onclick="eliminar(event)"><i class="fa-solid fa-trash"></i></button></td>
        </tr>
    `;
  totalCarrito = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio,
    0
  );
  let infoTotal = document.getElementById("total");
  infoTotal.innerText = "Total a pagar $: " + totalCarrito;
  //storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminar(ev) {
  let fila = ev.target.parentElement.parentElement;
  let id = fila.children[0].innerText;
  let indice = carrito.findIndex((producto) => producto.id == id);
  //remueve el producto 
  carrito.splice(indice, 1);
  fila.remove();
  //recalcular el total
  let preciosAcumulados = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio,
    0
  );
  total.innerText = "Total a pagar $: " + preciosAcumulados;
  //storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}




// rendizado de JSON
async function obtenerJSON() {
  const URLJSON = "productos.json";
  const resp = await fetch(URLJSON);
  const data = await resp.json();
  productosJSON = data;
  renderizarProds();
}
//Cerrando al compra
botonFinalizar.onclick = () => {
  if (carrito.length == 0) {
    Swal.fire({
      title: "El carro está vacío",
      text: "compre algun producto",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    carrito = [];
    document.getElementById("tablabody").innerHTML = "";
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar $: ";
    Toastify({
      text: "Pronto recibirá un mail de confirmacion",
      duration: 3000,
      gravity: "bottom",
      position: "left",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c92d)",
      },
    }).showToast();
  }
};

obtenerJSON();
