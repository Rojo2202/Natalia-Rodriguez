
// VARIABLES


let productosJSON = [];
let totalCarrito;
let contenedor = document.querySelector(".productos");
let botonFinalizar = document.getElementById("finalizar");
// LA COMPRA
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let iconoCarrito = document.getElementById("icono-carrito")
let carritoSeccion = document.querySelector(".carrito")



// carrito.length != 0 && dibujarTabla();

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

function agregarAlCarrito( productoComprado ) {
  carrito.push( productoComprado );
  let {nombre , img } = productoComprado
  //sweet alert
  Swal.fire({
    title: nombre,
    text: "Agregado al carrito",
    imageUrl: img,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: nombre,
    showConfirmButton: false,
    timer: 1500,
  });
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

iconoCarrito.onclick = () => {

  Swal.fire({
    title: '<strong>CARRITO</strong>',
    html:
      `<table class="table table-striped">
      <thead>
          <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Accion</th>
          </tr>
      </thead>
      <tbody id="tablabody">
          <!-- aqui tabla carrito -->
      </tbody>
  </table>`
      ,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText:
      '<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: 'Thumbs down'
  })
}


// rendizado de JSON
async function obtenerJSON() {
  const URLJSON = "productos.json";
  const resp = await fetch(URLJSON);
  const data = await resp.json();
  productosJSON = data;
  renderizarProds();
}




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
