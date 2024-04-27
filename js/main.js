
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const cargarProductos = async () => {
    try {
        const response = await fetch("data/productos.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo de productos.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
};

const mostrarProductos = async () => {
    const productos = await cargarProductos();
    const contenedorProductos = document.querySelector("#productos");

    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
        `;

        let button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        div.append(button);
        contenedorProductos.append(div);
    });
};

const actualizarCarrito = () => {
    const carritoVacio = document.querySelector("#carrito-vacio");
    const carritoProductos = document.querySelector("#carrito-productos");
    const carritoTotal = document.querySelector("#carrito-total");
    const vaciar = document.querySelector("#vaciar");
    const confirmar = document.querySelector("#confirmar");

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciar.classList.add("d-none");
        confirmar.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciar.classList.remove("d-none");
        confirmar.classList.remove("d-none");

        const carritoProductosElement = document.querySelector("#carrito-productos");
        carritoProductosElement.innerHTML = "";

        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
            `;

            let buttonMenos = document.createElement("button");
            buttonMenos.classList.add("carrito-producto-btn");
            buttonMenos.innerText = "⬇️";
            buttonMenos.addEventListener("click", () => {
                disminuirCantidad(producto);
            });

            let buttonMas = document.createElement("button");
            buttonMas.classList.add("carrito-producto-btn");
            buttonMas.innerText = "⬆️";
            buttonMas.addEventListener("click", () => {
                aumentarCantidad(producto);
            });

            let buttonX = document.createElement("button");
            buttonX.classList.add("carrito-producto-btn");
            buttonX.innerText = "✖️";
            buttonX.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(buttonMenos);
            div.append(buttonMas);
            div.append(buttonX);
            carritoProductosElement.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarAlCarrito = (producto) => {
    const itemEncontrado = carrito.find((item) => item.id === producto.id);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();

    Toastify({
        text: `${producto.titulo} agregado al carrito.`,
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #5470de)",
            color: "#f2ebd9",
            borderRadius: ".5rem",
        },
    }).showToast();
};

const borrarDelCarrito = (producto) => {
    const prodIndex = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(prodIndex, 1);
    actualizarCarrito();
};

const actualizarTotal = () => {
    const carritoTotal = document.querySelector("#carrito-total");
    if (carrito.length === 0) {
        carritoTotal.innerText = "$0";
    } else {
        const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
        carritoTotal.innerText = `$${total}`;
    }
};

const disminuirCantidad = (producto) => {
    const itemEncontrado = carrito.find(item => item.id === producto.id);
    if (itemEncontrado.cantidad > 1) {
        itemEncontrado.cantidad--;
    } else if (itemEncontrado.cantidad === 1) {
        borrarDelCarrito(itemEncontrado);
    }
    actualizarCarrito();
};

const aumentarCantidad = (producto) => {
    const itemEncontrado = carrito.find(item => item.id === producto.id);
    itemEncontrado.cantidad++;
    actualizarCarrito();
};

const vaciarCarrito = () => {
    Swal.fire({
        title: "¿Quieres borrar todos los productos?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, vaciar carrito",
        cancelButtonText: "No, no vaciar carrito"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarCarrito();
            Swal.fire({
                title: "Carrito vaciado!",
                icon: "success",
            });
        }
    });
};

const confirmarCompra = () => {
    Swal.fire({
        title: "¿Quieres confirmar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, comprar",
        cancelButtonText: "No, apreté sin querer",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarCarrito();
            Swal.fire({
                title: "¡Muchas gracias por tu compra!",
                icon: "success",
            });
        }
    });
};

const vaciar = document.querySelector("#vaciar");
vaciar.addEventListener("click", vaciarCarrito);

const confirmar = document.querySelector("#confirmar");
confirmar.addEventListener("click", confirmarCompra);

// Llamar a la función para mostrar los productos cuando se carga la página
window.addEventListener("load", mostrarProductos);

