// Manejador del botón de retroceso
var backButton = document.getElementById("img1");
backButton.addEventListener("click", function() {
    window.history.back();
});

window.addEventListener('goBack', function () {
 	window.history.back();
});

var backButton2 = document.getElementById("img2");
backButton2.addEventListener("click", function() {
    window.history.back();
});

// Función para obtener iniciales del nombre
function obtenerIniciales(nombre) {
    if (!nombre) return ""; 
    
    const palabras = nombre.split(' ');
    let iniciales = '';
    
    if (palabras.length > 0) {
        iniciales += palabras[0][0].toUpperCase();
	}
    
    if (palabras.length > 1) {
        iniciales += palabras[palabras.length - 1][0].toUpperCase();
	}
    
    let inicial = iniciales.slice(0, 2);
    
    if (inicial.endsWith('.')) {
        inicial = " " + inicial.slice(0, -1) + '. ';
	}
    
    return inicial;
}

async function obtenerYMostrarTransacciones(email) {
    try {
		const urlParams = new URLSearchParams(window.location.search);
        const RemiNombre = urlParams.get('RemiNombre');
		const response = await fetch(
            `${localStorage.getItem('url_bd')}/tr/transaccionesen/${encodeURIComponent(email)}/${encodeURIComponent(RemiNombre)}`
		);
        if (!response.ok) {
            throw new Error('Error al obtener las transacciones');
		}
        const transacciones = await response.json();
        console.log('Datos completos del servidor:', transacciones);
        
        const contenedorTransferencias = document.getElementById("transferencias");
        contenedorTransferencias.innerHTML = '';
		
        transacciones.forEach(transaccion => {
            console.log('Transacción individual:', transaccion);
            
            // Usar los nombres exactos de las columnas de la base de datos
            const datosTransaccion = {
                monto: transaccion.monto,
                nombre: transaccion.nombre,
                fecha: transaccion.fecha,
                imagen: transaccion.url_img || 'no',
                // Nombres que coinciden con la base de datos
                remitenteNombre: transaccion.remitente_nombre,
                remitenteCuit: transaccion.remitente_cuit,
                remitenteCbu: transaccion.remitente_cbu,
                destiCbuDest: transaccion.cbu,           // En la BD es solo 'cbu'
                destiNombre2: transaccion.nombre_comp,   // En la BD es 'nombre_comp'
                destiCuit: transaccion.cuit,             // En la BD es solo 'cuit'
                destiCuenta: transaccion.billetera,      // En la BD es 'billetera'
                destiTipo: transaccion.tipo,             // En la BD es solo 'tipo'
                codT: transaccion.codigo                 // En la BD es 'codigo'
			};
            
            agregarNuevaEntrada(datosTransaccion);
		});
		
		} catch (error) {
        console.error('Error al obtener transacciones:', error);
	}
}

function agregarNuevaEntrada(datos) {
    if (!datos.nombre) return;
	
    const nuevaEntrada = document.createElement("div");
    nuevaEntrada.setAttribute("style", "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8%;");
    
const inicial = obtenerIniciales(datos.nombre);
let fechaCorta = datos.fecha ? datos.fecha.split(" - ")[0] : "";

const contenidoNuevo = `
<div id="izq" style="display: flex; align-items: center;">
${datos.imagen !== "no"  ? 
`<img src="${datos.imagen}" alt="" width="44" height="44" style="border-radius: 50%; margin-left: 15px; margin-right: 10px;">` : 
`<span id="ico"><b>${inicial}</b></span>`
}
<div id="izqText">
<span style="display: block;">Transferencia enviada</span>
<span style="font-size:13px; color:gray">a ${datos.nombre}</span>
</div>
</div>
<div id="der" style="text-align: right;">
<div id="izqText">
<span style="color: #424040;">-$${datos.monto},00</span>
<span style="font-size:13px; color:gray; text-align: right;">${fechaCorta}</span>
</div>
</div>`;

nuevaEntrada.innerHTML = contenidoNuevo;
const contenedorEntradas = document.getElementById("transferencias");
contenedorEntradas.appendChild(nuevaEntrada);

nuevaEntrada.addEventListener("click", function() {
console.log('Datos para el comprobante:', datos);
 
const comprobanteURL = new URLSearchParams({
RemiNombre: datos.remitenteNombre || '',
RemiCuit: datos.remitenteCuit || '',
RemiCbu: datos.remitenteCbu || '',
DestiCbuDest: datos.destiCbuDest || '',
DestiNombre1: datos.nombre || '',
DestiNombre2: datos.destiNombre2 || '',
DestiAlias: '',
DestiCuit: datos.destiCuit || '',
DestiCuenta: datos.destiCuenta || '',
DestiTipo: datos.destiTipo || '',
monto: datos.monto || '',
hora: datos.fecha || '',
codT: datos.codT || '',
DestiImagen: datos.imagen || ''
}).toString();

console.log('URL del comprobante:', 'comprob/comprob.html?' + comprobanteURL + "&email=" + email);
window.open('comprob/comprob.html?' + comprobanteURL + "&email=" + email, '_self');
});
}

// Inicialización
let email;

document.addEventListener('DOMContentLoaded', function() {
const urlParams = new URLSearchParams(window.location.search);
email = urlParams.get('email');

if (email) {
obtenerYMostrarTransacciones(email);
}

var loader = document.getElementById("loader");
var content = document.getElementById("content");

if (loader && content) {
loader.style.display = "none";
content.style.display = "block";
}
});

// Deshabilitar zoom táctil
document.addEventListener('touchstart', function(event) {
if (event.touches.length > 1) {
event.preventDefault();
}
}, { passive: false });

document.addEventListener('touchmove', function(event) {
if (event.touches.length > 1) {
event.preventDefault();
}
}, { passive: false });