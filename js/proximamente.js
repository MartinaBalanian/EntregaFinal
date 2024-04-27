// Función para cargar el archivo JSON desde el servidor utilizando fetch
async function cargarJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
        return null;
    }
}

// Llamada a la función cargarJSON
cargarJSON("data/proximamente.json")
    .then(data => {
        if (data) {
            const productos = data.map(producto => ({
                titulo: producto.titulo,
                img: producto.img
            }));

            // Agregar los productos al contenedor HTML
            const contenedorProximamente = document.getElementById("proximamenteID");
            productos.forEach(producto => {
                const divProducto = document.createElement("div");
                divProducto.classList.add("productoProx");
                divProducto.innerHTML = `
                    <img class= "imagen-prox" src="${producto.img}" alt="${producto.titulo}">
                    <h3 class= "texto">${producto.titulo}</h3>
                `;
                contenedorProximamente.appendChild(divProducto);
            });
        }
    });