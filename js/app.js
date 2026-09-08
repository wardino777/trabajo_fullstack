function validarCorreo(email) {
    return email.endsWith("@duoc.cl") || 
           email.endsWith("@gmail.com");
}

const formRegistro = document.getElementById('form-registro');
const inputCorreoRegistro = document.getElementById('correo');

if (inputCorreoRegistro) {
    const mensajeDinamico = document.createElement('span');
    mensajeDinamico.style.fontSize = '12px';
    mensajeDinamico.style.fontWeight = 'bold';
    inputCorreoRegistro.parentNode.insertBefore(mensajeDinamico, inputCorreoRegistro.nextSibling);

    inputCorreoRegistro.addEventListener('input', function() {
        const correoEscrito = inputCorreoRegistro.value;
        if (validarCorreo(correoEscrito)) {
            mensajeDinamico.textContent = "Válido";
            mensajeDinamico.style.color = "green";
        } else {
            mensajeDinamico.textContent = "Inválido";
            mensajeDinamico.style.color = "red";
        }
    });
}

if (formRegistro) {
    formRegistro.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const correo = document.getElementById('correo').value;
        const pass = document.getElementById('contrasena').value;
        const confirmPass = document.getElementById('confirmar-contraseña').value;

        if (!validarCorreo(correo)) return alert("Error en correo");
        if (pass.length < 4 || pass.length > 10) return alert("Error en contraseña");
        if (pass !== confirmPass) return alert("Contraseñas no coinciden");
        alert("Registro exitoso");
    });
}

const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const correo = document.getElementById('login-correo').value;
        const pass = document.getElementById('login-contrasena').value;

        if (!validarCorreo(correo)) return alert("Error en correo");
        if (pass.length < 4 || pass.length > 10) return alert("Error en contraseña");
        
        window.location.href = "admin_home.html";
    });
}

const formContacto = document.getElementById('form-contacto');

if (formContacto) {
    formContacto.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const correo = document.getElementById('correo-contacto').value;
        const comentario = document.getElementById('comentario').value;

        if (!validarCorreo(correo)) return alert("Error en correo");
        if (comentario.length > 500) return alert("Comentario largo");
        alert("Mensaje enviado");
    });
}

const productosBase = [
    { id: 1, codigo: "PRD-001", nombre: "Alimento Gatos 3kg", precio: 25000, stock: 15, categoria: "Gatos", imagen: "img/Alimento-Gato.jpg" },
    { id: 2, codigo: "PRD-002", nombre: "Arena Sanitaria 10kg", precio: 12000, stock: 5, categoria: "Gatos", imagen: "img/Arena.webp" },
    { id: 3, codigo: "PRD-003", nombre: "Varita interactiva", precio: 4500, stock: 20, categoria: "Gatos", imagen: "img/varita.webp" },
    { id: 4, codigo: "PRD-004", nombre: "Alimento Perros 15kg", precio: 35000, stock: 10, categoria: "Perros", imagen: "img/Alimento-Perro.jpg" },
    { id: 5, codigo: "PRD-005", nombre: "Hueso Masticable", precio: 3500, stock: 50, categoria: "Perros", imagen: "img/hueso.jpg" },
    { id: 6, codigo: "PRD-006", nombre: "Correa Retráctil 5m", precio: 15000, stock: 8, categoria: "Perros", imagen: "img/cue.jpg" },
    { id: 7, codigo: "PRD-007", nombre: "Alimento Hámster 1kg", precio: 4500, stock: 12, categoria: "Exoticos", imagen: "img/Alimento-Hamster.jpg" },
    { id: 8, codigo: "PRD-008", nombre: "Heno para Conejos 2kg", precio: 6000, stock: 25, categoria: "Exoticos", imagen: "img/heno.jpg" },
    { id: 9, codigo: "PRD-009", nombre: "Cama Suave Gatos", precio: 18000, stock: 6, categoria: "Gatos", imagen: "img/Cama.webp" },
    { id: 10, codigo: "PRD-010", nombre: "Shampoo Perros", precio: 8000, stock: 30, categoria: "Perros", imagen: "img/sha.webp" },
    { id: 11, codigo: "PRD-011", nombre: "Jaula Transportadora", precio: 22000, stock: 4, categoria: "Perros", imagen: "img/ja.jpg" }
];

let inventarioData = JSON.parse(localStorage.getItem('inventarioVetShop')) || productosBase;
let carrito = JSON.parse(localStorage.getItem('carritoVetShop')) || [];

const contenedorProductos = document.querySelector('.grilla-productos');

if (contenedorProductos && window.location.pathname.includes('productos.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFiltro = urlParams.get('cat');
    
    contenedorProductos.innerHTML = '';
    
    let productosAMostrar = inventarioData;
    if (categoriaFiltro) {
        productosAMostrar = inventarioData.filter(p => p.categoria.toLowerCase() === categoriaFiltro.toLowerCase());
    }

    productosAMostrar.forEach(producto => {
        contenedorProductos.innerHTML += `
            <article class="producto-card">
                <a href="detalle_producto.html?id=${producto.id}" style="text-decoration: none; color: inherit;">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                </a>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
            </article>
        `;
    });
} else if (contenedorProductos && window.location.pathname.includes('index.html')) {
    contenedorProductos.innerHTML = '';
    inventarioData.slice(0, 4).forEach(producto => {
        contenedorProductos.innerHTML += `
            <article class="producto-card">
                <a href="detalle_producto.html?id=${producto.id}" style="text-decoration: none; color: inherit;">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                </a>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
            </article>
        `;
    });
}

let paginaActual = 1;
const filasPorPagina = 5;

function renderizarInventario() {
    const tablaInventario = document.getElementById('tabla-inventario');
    if (tablaInventario) {
        tablaInventario.innerHTML = '';
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const productosPagina = inventarioData.slice(inicio, fin);

        productosPagina.forEach((producto) => {
            const indexReal = inventarioData.indexOf(producto);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button onclick="editarProducto(${indexReal})">Editar</button>
                    <button onclick="eliminarProducto(${indexReal})">Eliminar</button>
                </td>
            `;
            tablaInventario.appendChild(tr);
        });
        renderizarPaginacion();
    }
}

function renderizarPaginacion() {
    const contenedorPaginacion = document.querySelector('.paginacion');
    if (contenedorPaginacion && document.getElementById('tabla-inventario')) {
        contenedorPaginacion.innerHTML = '';
        const totalPaginas = Math.ceil(inventarioData.length / filasPorPagina);

        let html = `<span onclick="cambiarPagina(1)">«</span>`;
        html += `<span onclick="cambiarPagina(${paginaActual > 1 ? paginaActual - 1 : 1})">‹</span>`;

        for (let i = 1; i <= totalPaginas; i++) {
            if (i === paginaActual) {
                html += `<span class="activo">${i}</span>`;
            } else {
                html += `<span onclick="cambiarPagina(${i})">${i}</span>`;
            }
        }

        html += `<span onclick="cambiarPagina(${paginaActual < totalPaginas ? paginaActual + 1 : totalPaginas})">›</span>`;
        html += `<span onclick="cambiarPagina(${totalPaginas})">»</span>`;

        contenedorPaginacion.innerHTML = html;
    }
}

window.cambiarPagina = function(nuevaPagina) {
    paginaActual = nuevaPagina;
    renderizarInventario();
};

function eliminarProducto(index) {
    if(confirm("¿Seguro que deseas eliminar este producto del inventario?")) {
        inventarioData.splice(index, 1);
        localStorage.setItem('inventarioVetShop', JSON.stringify(inventarioData));
        if (paginaActual > Math.ceil(inventarioData.length / filasPorPagina) && paginaActual > 1) {
            paginaActual--;
        }
        renderizarInventario();
    }
}

function editarProducto(index) {
    let nuevoPrecio = prompt("Ingrese nuevo precio:", inventarioData[index].precio);
    let nuevoStock = prompt("Ingrese nuevo stock:", inventarioData[index].stock);
    if (nuevoPrecio !== null && !isNaN(nuevoPrecio) && nuevoPrecio !== "" && nuevoStock !== null && !isNaN(nuevoStock) && nuevoStock !== "") {
        inventarioData[index].precio = parseInt(nuevoPrecio);
        inventarioData[index].stock = parseInt(nuevoStock);
        localStorage.setItem('inventarioVetShop', JSON.stringify(inventarioData));
        renderizarInventario();
    }
}

renderizarInventario();

function agregarAlCarrito(idProducto) {
    const productoEncontrado = inventarioData.find(prod => prod.id === idProducto);
    const itemEnCarrito = carrito.find(prod => prod.id === idProducto);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...productoEncontrado, cantidad: 1 });
    }
    
    localStorage.setItem('carritoVetShop', JSON.stringify(carrito));
    alert("Añadido al carrito");
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carritoVetShop', JSON.stringify(carrito));
    renderizarCarrito();
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById('items-carrito');
    const textoTotal = document.getElementById('precio-total');

    if (contenedorCarrito) {
        contenedorCarrito.innerHTML = ''; 

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = '<p>Tu carrito está vacío</p>';
            if (textoTotal) textoTotal.innerText = "$ 0";
        } else {
            carrito.forEach((item, index) => {
                contenedorCarrito.innerHTML += `
                    <article class="item-carrito">
                        <img src="${item.imagen}" alt="${item.nombre}" width="100">
                        <div class="item-info">
                            <h3>${item.nombre}</h3>
                        </div>
                        <div class="item-precio" style="display: flex; align-items: center; gap: 20px;">
                            <p style="margin: 0; font-weight: bold;">$ ${item.precio}</p>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <button style="width: 30px; height: 30px; cursor: pointer; border-radius: 50%; border: 1px solid #333; background: white; font-weight: bold;" onclick="cambiarCantidad(${index}, -1)">-</button>
                                <input type="text" value="${item.cantidad}" readonly style="width: 40px; text-align: center; margin: 0; padding: 5px;">
                                <button style="width: 30px; height: 30px; cursor: pointer; border-radius: 50%; border: 1px solid #333; background: white; font-weight: bold;" onclick="cambiarCantidad(${index}, 1)">+</button>
                            </div>
                        </div>
                    </article>
                `;
            });
        }
    }
}

renderizarCarrito();

const btnPagar = document.getElementById('btn-pagar');
if (btnPagar) {
    btnPagar.addEventListener('click', function() {
        if (carrito.length === 0) {
            alert("El carrito está vacío. Añade productos antes de pagar.");
            return;
        }
        alert("¡Compra realizada con éxito! Gracias por su preferencia.");  
    });
}

const regionesYComunas = {
    "Metropolitana": ["Maipú", "Santiago", "Providencia", "Padre Hurtado"],
    "Valparaiso": ["Viña del Mar", "Valparaíso", "Quilpué"],
    "Araucania": ["Temuco", "Villarrica", "Pucón"]
};

const selectRegion = document.getElementById('region-select');
const selectComuna = document.getElementById('comuna-select');

if (selectRegion && selectComuna) {
    for (let region in regionesYComunas) {
        let opcion = document.createElement('option');
        opcion.value = region;
        opcion.text = region;
        selectRegion.appendChild(opcion);
    }

    selectRegion.addEventListener('change', function() {
        selectComuna.innerHTML = '<option value="">-</option>';
        let regionElegida = this.value;
        if (regionElegida !== "") {
            let comunas = regionesYComunas[regionElegida];
            comunas.forEach(function(comuna) {
                let opcion = document.createElement('option');
                opcion.value = comuna;
                opcion.text = comuna;
                selectComuna.appendChild(opcion);
            });
        }
    });
}

const formNuevoUsuario = document.getElementById('form-nuevo-usuario');

if (formNuevoUsuario) {
    formNuevoUsuario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const run = document.getElementById('run').value;
        const correo = document.getElementById('correo-usuario').value;
        const runRegex = /^[0-9]+[0-9Kk]$/;
        if (!runRegex.test(run) || run.length < 7 || run.length > 9) return alert("RUN inválido");
        if (!validarCorreo(correo)) return alert("Correo inválido");
        alert("Usuario guardado exitosamente");
    });
}

const ventasData = [
    { date: "2024-05-25", run: "11223344-5", customer: "Delta Retail", status: "Processing", amount: "$750.00" },
    { date: "2024-05-26", run: "15556667-8", customer: "Echo Enterprises", status: "Shipped", amount: "$3000.00" },
    { date: "2024-05-27", run: "20123456-7", customer: "Foxtrot Media", status: "Pending", amount: "$1150.00" },
    { date: "2024-05-28", run: "18888999-0", customer: "Golf Goods Inc.", status: "Shipped", amount: "$2300.00" },
    { date: "2024-05-29", run: "17777888-1", customer: "Hotel Harmony", status: "Processing", amount: "$900.00" },
    { date: "2024-05-30", run: "16666777-2", customer: "India IT Solutions", status: "Cancelled", amount: "$600.00" },
    { date: "2024-05-31", run: "14444555-3", customer: "Juliett Services", status: "Shipped", amount: "$1850.00" },
    { date: "2024-06-01", run: "13333444-4", customer: "Kilo Retail Group", status: "Pending", amount: "$2750.00" },
    { date: "2024-06-01", run: "12222333-5", customer: "Lima Landscaping", status: "Shipped", amount: "$980.00" },
    { date: "2024-06-01", run: "19011022-K", customer: "Acme Corporation", status: "Shipped", amount: "$2500.00" },
    { date: "2024-06-02", run: "12345678-9", customer: "Bravo Solutions", status: "Pending", amount: "$1200.00" },
    { date: "2024-06-02", run: "9876543-2", customer: "Charlies Workshop", status: "Cancelled", amount: "$500.00" },
    { date: "2024-06-02", run: "10000111-6", customer: "Mike's Mechanics", status: "Processing", amount: "$450.00" },
    { date: "2024-06-03", run: "21111222-7", customer: "November Nightlife", status: "Shipped", amount: "$3250.00" },
    { date: "2024-06-04", run: "22222333-8", customer: "Oscar Outdoors", status: "Cancelled", amount: "$1300.00" }
];

let paginaActualVentas = 4;
const filasPorPaginaVentas = 3;

function renderizarTablaVentas() {
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    if (tablaUsuarios) {
        tablaUsuarios.innerHTML = '';
        const inicio = (paginaActualVentas - 1) * filasPorPaginaVentas;
        const fin = inicio + filasPorPaginaVentas;
        const ventasPagina = ventasData.slice(inicio, fin);

        ventasPagina.forEach((venta) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${venta.date}</td>
                <td>${venta.run}</td>
                <td>${venta.customer}</td>
                <td>${venta.status}</td>
                <td>${venta.amount}</td>
            `;
            tablaUsuarios.appendChild(tr);
        });
        renderizarPaginacionVentas();
    }
}

function renderizarPaginacionVentas() {
    const contenedorPaginacion = document.getElementById('paginacion-usuarios');
    if (contenedorPaginacion && document.getElementById('tabla-usuarios')) {
        contenedorPaginacion.innerHTML = '';
        const totalPaginas = Math.ceil(ventasData.length / filasPorPaginaVentas);

        let html = `<span onclick="cambiarPaginaVentas(1)">«</span>`;
        html += `<span onclick="cambiarPaginaVentas(${paginaActualVentas > 1 ? paginaActualVentas - 1 : 1})">‹</span>`;

        for (let i = 1; i <= totalPaginas; i++) {
            if (i === paginaActualVentas) {
                html += `<span class="activo">${i}</span>`;
            } else {
                html += `<span onclick="cambiarPaginaVentas(${i})">${i}</span>`;
            }
        }

        html += `<span onclick="cambiarPaginaVentas(${paginaActualVentas < totalPaginas ? paginaActualVentas + 1 : totalPaginas})">›</span>`;
        html += `<span onclick="cambiarPaginaVentas(${totalPaginas})">»</span>`;

        contenedorPaginacion.innerHTML = html;
    }
}

window.cambiarPaginaVentas = function(nuevaPagina) {
    paginaActualVentas = nuevaPagina;
    renderizarTablaVentas();
};

renderizarTablaVentas();

const botonesBuscar = document.querySelectorAll('.btn-buscar-global');
botonesBuscar.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const termino = prompt("BUSCADOR GLOBAL\nIngrese un código de producto, nombre, o RUN a buscar:");
        if (termino && termino.trim() !== "") {
            const busqueda = termino.toLowerCase();
            let resultados = "";
            
            const prods = inventarioData.filter(p => p.codigo.toLowerCase().includes(busqueda) || p.nombre.toLowerCase().includes(busqueda));
            if (prods.length > 0) {
                resultados += "PRODUCTOS ENCONTRADOS:\n";
                prods.forEach(p => resultados += `- ${p.codigo}: ${p.nombre} ($${p.precio})\n`);
            }

            if (typeof ventasData !== 'undefined') {
                const clientes = ventasData.filter(v => v.run.toLowerCase().includes(busqueda) || v.customer.toLowerCase().includes(busqueda));
                if (clientes.length > 0) {
                    resultados += "\nCLIENTES/ÓRDENES ENCONTRADAS:\n";
                    clientes.forEach(c => resultados += `- RUN: ${c.run} | Cliente: ${c.customer} | Estado: ${c.status}\n`);
                }
            }

            if (resultados === "") {
                alert("No se encontraron coincidencias para: " + termino);
            } else {
                alert(resultados);
            }
        }
    });
});

if (window.location.pathname.includes('detalle_producto.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(urlParams.get('id'));

    if (idProducto) {
        const productoEncontrado = inventarioData.find(p => p.id === idProducto);
        
        if (productoEncontrado) {
            const imgDetalle = document.getElementById('img-detalle');
            const nombreDetalle = document.getElementById('nombre-detalle');
            const precioDetalle = document.getElementById('precio-detalle');
            const catDetalle = document.getElementById('cat-detalle');
            const btnComprar = document.getElementById('btn-comprar-detalle');

            if (imgDetalle) imgDetalle.src = productoEncontrado.imagen;
            if (nombreDetalle) nombreDetalle.innerText = productoEncontrado.nombre;
            if (precioDetalle) precioDetalle.innerText = "$ " + productoEncontrado.precio;
            if (catDetalle) catDetalle.innerText = productoEncontrado.categoria;
            
            if (btnComprar) {
                btnComprar.setAttribute('onclick', `agregarAlCarrito(${productoEncontrado.id})`);
            }
        }
    }
}