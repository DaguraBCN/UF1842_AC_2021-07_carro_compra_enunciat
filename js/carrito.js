/*
Hay que programar un carrito de compra de fruta.

El cliente eligirá que fruta quiere haciendo click sobre la imagen.
Un mensaje emergente le preguntará qué cantidad quiere.

Esta información se mostrará a la derecha, bajo "Total carrito", 
en <p id="carrito"></p>, de esta forma:
 Kiwi 2 kg x 4,20€/kg = 8,40 €

El total se actualizará con cada compra
 Total Compra: 8,40€
 
Se dará la opción de añadir o no más productos que se mostrarán
a continuación de los anteriores, y se sumará todo en el total. 
Por ejemplo:  
 Kiwi 2 kg x 4, 20€/kg = 8, 40€
 Pomelo 1 kg x 2,50€/kg = 2,50€
 Total Compra: 10,90€

Puedes modificar el código facilitado si ello te ayuda con el ejercicio,
pero deberás justificarlo.

Recuerda la importancia comentar con detalle el código.

 Lo importante es el cálculo, no los estilos css
 */

/**************************************************************************************************************************************************
    Para esta práctica he creido conveniente realizar tres aportes
    1: Crear eventos y botones para la introducción de las cantidades, controlando en todos ellos que no se introduzcan cantidades erroneas,
       como numeros negativos y/o decimales cuando la unidad de peso es "ud"
    2: Crear un botón de finalizar compra, que solo será visible si hay algun articulo en el carrito. 
       Al pulsarlo se bloqueará las acciones de añadir o eliminar articulos y se creará un ticket de compra con la apariencia de uno de impresora.
    3: Crear un botón de nueva compra, que solo será visible despues de haber generado el ticket y que reiniciará todos los objetos de cero,  
       para comenzar a crear una nueva lista.
**************************************************************************************************************************************************/

//  definimos los dos objetos que contendrán los elementos y valor total
let carrito = [];
let total = 0;
let compraFinalizada = false;

// creamos la función para seleccionar el producto
function seleccionarProducto(parentId, nombre, precio, unidad) {
    if (compraFinalizada) return;

    const parentElement = document.getElementById(parentId);

    // controlamos que no vuelva a añadir el mismo producto varias veces
    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        alert("Ya has añadido este producto al carrito. Puedes modificar la cantidad directamente.");
        return;
    }

    // creamos el objeto de la caja y los botones, llamamos a la funcion actualizarCarrito cuando se produce el evento .onclick o .onchange en el input
    const divProducto = document.createElement("div");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.step = 0.05
    inputCantidad.value = 1;
    inputCantidad.min = 0.05;
    inputCantidad.onchange = () => actualizarCarrito(nombre, precio, unidad, inputCantidad.value);

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.onclick = () => {
        if (inputCantidad.value > 1) {
            inputCantidad.value--;
            controlUnidad(unidad, inputCantidad);
            actualizarCarrito(nombre, precio, unidad, inputCantidad.value);
        }
    };

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.onclick = () => {
        inputCantidad.value++;
        controlUnidad(unidad, inputCantidad);
        actualizarCarrito(nombre, precio, unidad, inputCantidad.value);
    };

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML =  '<i class="fa-solid fa-trash-can"></i>';//'<i class="fa-solid fa-circle-minus"></i>'
    btnEliminar.className = "remove-button";
    btnEliminar.onclick = () => eliminarProducto(nombre, precio, unidad, divProducto);

    // controlamos las entradas manuales de negativos desde el input
    inputCantidad.addEventListener("change",()=>{
        if(parseFloat(inputCantidad.value)<0){
            inputCantidad.value=0.05;
        } 
        controlUnidad(unidad, inputCantidad);
        actualizarCarrito(nombre, precio, unidad, inputCantidad.value);
        
    })
    
    // creamos la caja de control de unidades y le añadimos los botones y el input usando appendChild
    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";
    quantityControls.appendChild(btnMenos);
    quantityControls.appendChild(inputCantidad);
    quantityControls.appendChild(btnMas);
    quantityControls.appendChild(btnEliminar);

    divProducto.appendChild(quantityControls);
    parentElement.appendChild(divProducto);

    carrito.push({ nombre, precio, unidad, cantidad: 1 });
    actualizarTotal();
}

// función para controlar la unidad y redondear la cantidad si es necesario
// se llama a la funcióm en los eventos de cambio, botones y carrito
function controlUnidad(unidad, inputCantidad) {
    if (unidad === 'ud') {
        inputCantidad.value = Math.round(inputCantidad.value);
    }
}

function actualizarCarrito(nombre, precio, unidad, cantidad) {
    if (compraFinalizada) return;

    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        controlUnidad(unidad, { value: cantidad });  // Asegúrate de que la cantidad esté redondeada si es 'ud'
        producto.cantidad = cantidad;
        actualizarTotal();
    }
}

// con esta función eliminamos un producto del carrito
function eliminarProducto(nombre, precio, unidad, divProducto) {
    if (compraFinalizada) return;

    carrito = carrito.filter(item => item.nombre !== nombre);
    divProducto.remove();
    actualizarTotal();
}

// con esta función vamos controlando y acgtualizando el objeto carrito y el total
function actualizarTotal() {
    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = "";

    total = 0;
    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio;
        total += subtotal;

        const itemCarrito = document.createElement("p");
        itemCarrito.textContent = `${item.nombre} ${item.cantidad} ${item.unidad} x ${item.precio.toFixed(2)}€/ ${item.unidad} = ${subtotal.toFixed(2)}€`;
        carritoDiv.appendChild(itemCarrito);
    });

    document.getElementById("preuFinal").textContent = `${total.toFixed(2)}€`;

    // Mostramos u ocultamos la sección de finalizar compra
    const finalizarCompraSection = document.getElementById("finalizarCompra");
    if (carrito.length > 0) {
        finalizarCompraSection.style.display = "block";
    } else {
        finalizarCompraSection.style.display = "none";
    }
}

// función para finalizar la compra y mostrar el ticket
function finalizarCompra() {
    compraFinalizada = true;

    const ticketDiv = document.getElementById("ticketCompra");
    ticketDiv.innerHTML = "";

    const totalConIVA = total * 1.05;
    const iva = total * 0.05;

     // Generamos fecha y hora actual
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES');
    const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Generamos número de operación aleatorio
    const numeroOperacion = Math.floor(Math.random() * 1000000);

    // Información de la empresa
    const empresaInfo = `
        <h2><i class="fa-solid fa-cart-shopping"></i>  MERCAFRUTA  <i class="fa-solid fa-cart-shopping fa-flip-horizontal"></i></h2>
        <p>NIF: 12345678A</p>
        <p>C/ Ejemplo 123</p>
        <p>08026 BARCELONA</p>
        <p>Tel.: 854123698</p>
        <p>Fecha: ${fechaFormateada} Hora: ${horaFormateada} Op.Nº: ${numeroOperacion}</p>
        <hr>
    `;
    ticketDiv.innerHTML += empresaInfo;

    // Cabecera del ticket
    const ticketHeader = document.createElement("h2");
    ticketHeader.textContent = "Ticket de Compra";
    ticketDiv.appendChild(ticketHeader);
   
    // Creamos el contenedor del grid del ticket
    const gridContainer = document.createElement("div");
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
    gridContainer.style.gap = "10px";
    gridContainer.style.textAlign = "right"
    ticketDiv.appendChild(gridContainer);

    // Creamos cabecera del grid
    const descripcion = document.createElement("div");
    const unidadDescripcion = document.createElement("div");
    const precioDescripcion = document.createElement("div");
    const subtotalDescripcion = document.createElement("div");

    descripcion.textContent = "Descripción";
    unidadDescripcion.textContent = "Unidades";
    precioDescripcion.textContent = "Precio";
    subtotalDescripcion.textContent = "Subtotal";

    gridContainer.appendChild(descripcion);
    gridContainer.appendChild(unidadDescripcion);    
    gridContainer.appendChild(precioDescripcion);
    gridContainer.appendChild(subtotalDescripcion);
    
    // Recorremos el carrito para rellenar el grid del contenedor del ticket
    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio;

        // Creamos los elementos de cada columna
        const nombreDiv = document.createElement("div");
        nombreDiv.textContent = item.nombre;
        gridContainer.appendChild(nombreDiv);

        const unidadDiv = document.createElement("div");
        unidadDiv.textContent = `${item.cantidad}${item.unidad}`;
        gridContainer.appendChild(unidadDiv);

        const precioDiv = document.createElement("div");
        precioDiv.textContent = `${item.precio.toFixed(2)}€/${item.unidad}`;
        gridContainer.appendChild(precioDiv);

        const subtotalDiv = document.createElement("div");
        subtotalDiv.textContent = `${subtotal.toFixed(2)}€`;
        gridContainer.appendChild(subtotalDiv);
    });

    const separador = document.createElement("hr");
    ticketDiv.appendChild(separador);

    const baseIVA = document.createElement("p");
    baseIVA.textContent = `Base: ${total.toFixed(2)} €`;
    baseIVA.style.textAlign = "right"
    ticketDiv.appendChild(baseIVA);

    const totalIVA = document.createElement("p");
    totalIVA.textContent = `IVA (5%): ${iva.toFixed(2)} €`;
    totalIVA.style.textAlign = "right"
    ticketDiv.appendChild(totalIVA);

    const totalFinal = document.createElement("p");
    totalFinal.textContent = `Total con IVA: ${totalConIVA.toFixed(2)} €`;
    totalFinal.style.textAlign = "right"
    ticketDiv.appendChild(totalFinal);

    document.getElementById("btnFinalizar").style.display = "none";
    document.getElementById("btnNuevaCompra").style.display = "block";

}

function nuevaCompra() {
    compraFinalizada = false;
    carrito = [];
    total = 0;

    // Limpiar la sección de carrito
    document.getElementById("carrito").innerHTML = "";
    document.getElementById("preuFinal").textContent = "0,00€";

    // Limpiar el ticket
    document.getElementById("ticketCompra").innerHTML = "";

    // Limpiar los productos en la sección de productos
    const productosSection = document.querySelector(".productes");
    productosSection.innerHTML = "";

    // Mostrar el botón de finalizar compra y ocultar el botón de nueva compra
    document.getElementById("btnFinalizar").style.display = "block";
    document.getElementById("btnNuevaCompra").style.display = "none";
    document.getElementById("finalizarCompra").style.display = "none";

    // Reinicializar la seccion de productos
    inicializarProductos();
}

// Función para re-inicializar la sección de productos
function inicializarProductos() {
    const productosSection = document.querySelector(".productes");

    const productos = [
        { id: 'producto-pomelo', nombre: 'Pomelo', precio: 2.50, unidad: 'kg', imagen: 'img/aranja.png', alt: 'Aranja' },
        { id: 'producto-kiwi', nombre: 'Kiwi', precio: 4.20, unidad: 'kg', imagen: 'img/kiwi.png', alt: 'Kiwi' },
        { id: 'producto-limon', nombre: 'Limón', precio: 1.20, unidad: 'kg', imagen: 'img/llimones.png', alt: 'Llimones' },
        { id: 'producto-pina', nombre: 'Piña', precio: 2.80, unidad: 'ud', imagen: 'img/pinya.png', alt: 'Pinya' },
        { id: 'producto-sandia', nombre: 'Sandía', precio: 1.20, unidad: 'kg', imagen: 'img/sindria.png', alt: 'Sindria' },
        { id: 'producto-aguacate', nombre: 'Aguacate', precio: 2.50, unidad: 'ud', imagen: 'img/aguacates.jpg', alt: 'Aguacates' },
        { id: 'producto-freson', nombre: 'Fresón', precio: 6.20, unidad: 'kg', imagen: 'img/freson.jpg', alt: 'Fresón' },
        { id: 'producto-mandarina', nombre: 'Mandarina', precio: 1.90, unidad: 'kg', imagen: 'img/mandarina.jpg', alt: 'Mandarina' },
        { id: 'producto-manzana-fuji', nombre: 'Manzana Fuji', precio: 4.20, unidad: 'kg', imagen: 'img/manzana_fuji.jpg', alt: 'Manzana Fuji' },
        { id: 'producto-platanos', nombre: 'Plátanos', precio: 3.20, unidad: 'kg', imagen: 'img/platans.png', alt: 'Plátanos' },
        { id: 'producto-pera', nombre: 'Pera', precio: 1.80, unidad: 'kg', imagen: 'img/pera.jpg', alt: 'Pera' },
        { id: 'producto-manzana-golden', nombre: 'Manzana Golden', precio: 3.50, unidad: 'kg', imagen: 'img/manzana_golden.jpg', alt: 'Manzana Golden' },
    ];

    productos.forEach(producto => {
        const divProducto = document.createElement("div");
        divProducto.id = producto.id;

        const imgProducto = document.createElement("img");
        imgProducto.loading = "lazy";
        imgProducto.className = "imatges";
        imgProducto.src = producto.imagen;
        imgProducto.alt = producto.alt;
        imgProducto.onclick = () => seleccionarProducto(producto.id, producto.nombre, producto.precio, producto.unidad);

        const pProducto = document.createElement("p");
        pProducto.textContent = `${producto.nombre} : ${producto.precio.toFixed(2)}€/${producto.unidad}`;

        divProducto.appendChild(imgProducto);
        divProducto.appendChild(pProducto);

        productosSection.appendChild(divProducto);
    });
}

