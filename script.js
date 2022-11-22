
// VARIABLES


let productosJSON = [];
let totalCarrito;
let contenedor = document.querySelector(".productos");
let botonFinalizar = document.getElementById("finalizar");
// LA COMPRA
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let iconoCarrito = document.getElementById("icono-carrito")
let carritoSeccion = document.querySelector(".carrito")
let basura = document.getElementById("basura")



const actualizarTotal = () => {
  totalCarrito = carrito.reduce((acumulador,producto)=> acumulador + producto.precio,0);
  let infoTotal = document.getElementById("total");
  infoTotal.innerText=`Total:$${totalCarrito}`;
}

// carrito.length != 0 && dibujarTabla();
function dibujarTabla(){
  for(const producto of carrito){
      document.getElementById("tablabody").innerHTML += `
      <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.precio}</td>
          <td><button class = "btn btn-basura" onclick="eliminar(event)"><i class="fa-solid fa-trash basura"></i></button></td>
      </tr>
  `;
  }
  totalCarrito = carrito.reduce((acumulador,producto)=> acumulador + producto.precio,0);
  let infoTotal = document.getElementById("total");
  infoTotal.innerText="Total a pagar $: "+totalCarrito;
}


function renderizarProds() {
  for (const producto of productosJSON) {
    let { img, id, nombre, precio } = producto;
    contenedor.innerHTML += `
        <article class="card">
        <img src="${img}">
          <div class="card-body">
              <h5 class="card-title">${nombre}</h5>
              <p class="card-text">$${precio}</p>
              <button id = "btn${id}" class="btn">COMPRAR</button>
          </div>
        </article>
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

  document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${productoComprado.id}</td>
            <td>${productoComprado.nombre}</td>
            <td>${productoComprado.precio}</td>
            <td><button class = "btn btn-basura" onclick="eliminar(event)"><i class="fa-solid fa-trash basura"></i></button></td>
        </tr>
    `;
    totalCarrito = carrito.reduce((acumulador,producto)=> acumulador + producto.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito;

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
  </table>
  <p id ="total">TOTAL:$</p>
  `

      ,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: `Finalizar Compra`,
  }).then((result) => {

    if (result.isConfirmed) {
      Swal.fire({
        title: "Gracias por su compra",
        icon: 'success',
        text: "Le enviaremos como seguir por mail",
      })
      finalizarCompra();

    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
  dibujarTabla();
}


// rendizado de JSON
async function obtenerJSON() {
  const URLJSON = "productos.json";
  const resp = await fetch(URLJSON);
  const data = await resp.json();
  productosJSON = data;
  renderizarProds();
}




const finalizarCompra = () => {
  if (carrito.length == 0) {
    Swal.fire({
      title: "El carro está vacío",
      text: "Compre algun producto",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    carrito = [];
    document.getElementById("tablabody").innerHTML = "";
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar $: ";
  }
};

obtenerJSON();
