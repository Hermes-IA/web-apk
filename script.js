 
async function obtenerTasa() {  
    try {
        const response = await fetch(localStorage.getItem('url_bd') + '/get-tasa'); 
        if (!response.ok) {
            throw new Error('Error al obtener la tasa');
		}
        const data = await response.json();
        console.log('Tasa obtenida:', data.tasa);
        document.getElementById("tasa").textContent = data.tasa;
		} catch (error) {
        console.error('Error:', error);
	}
}

document.addEventListener('DOMContentLoaded', function() {
    obtenerTasa();
  });


function agregarNuevaEntrada(monto, nombre, fecha, imagen, id) {
    // Crear un nuevo elemento div para la nueva entrada
    const nuevaEntrada = document.createElement("div");
    nuevaEntrada.setAttribute("style", "display: flex; justify-content: space-between;align-items: center;margin-bottom: 8%;");
    nuevaEntrada.setAttribute("data-id", id);
	
    // Obtener iniciales del nombre
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
	
    const partes = fecha.split(" - ");
    const fechaCorta = partes[0];
	function convertirFecha(fecha) {
		const meses = {
			"enero": "01",
			"febrero": "02",
			"marzo": "03",
			"abril": "04",
			"mayo": "05",
			"junio": "06",
			"julio": "07",
			"agosto": "08",
			"septiembre": "09",
			"octubre": "10",
			"noviembre": "11",
			"diciembre": "12"
		};
		
		// Separar el día y el mes
		const partes = fecha.split(" de ");
		const dia = partes[0].trim();
		const mes = partes[1].trim().toLowerCase();
		
		// Convertir día a dos dígitos
		const diaFormateado = String(dia).padStart(2, '0');
		
		// Obtener el número del mes
		const mesFormateado = meses[mes];
		
		// Devolver el resultado en el formato deseado
		return `${diaFormateado}/${mesFormateado}`;
	}
	
	
    // Contenido de la nueva entrada
    const contenidoNuevo = `
    <div id="izq" onclick="irAcomprob()" style="display: flex; align-items: center;">
	${imagen !== "no"   ? 
	`<div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0; position: relative;">
	<img src="${imagen}" alt="" style="width: 100%; height: 100%; object-fit: cover;">
	</div>` : 
	`<div style="width: 48px; height: 48px; border-radius: 50%; border: solid 1px #68666675; display: flex; align-items: center; justify-content: center; color: white;">
	<span id="ico"><b>${inicial}</b></span>
	</div>`
	}
	<div id="izqText" style="margin-left: 12px;">
	<span style="display: block;">Transferencia enviada</span>
	<span style="font-size:13px; color:gray">a ${nombre}</span>
	</div>
    </div>
    <div id="der" style="text-align: right;">
	<div id="izqText">
	<span style="color: #424040;">-$${monto},00</span> 
	<span style="font-size:13px; color:gray;text-align: right;">${convertirFecha(fechaCorta)}</span>
	</div>
    </div>
	`; 
	
    // Insertar el contenido en la nueva entrada
    nuevaEntrada.innerHTML = contenidoNuevo;
	
    // Obtener el contenedor de entradas existentes
    const contenedorEntradas = document.getElementById("transferencias");
	
    // Insertar la nueva entrada al principio del contenedor
    contenedorEntradas.insertBefore(nuevaEntrada, contenedorEntradas.firstChild);
	
    // Agregar un controlador de eventos click al elemento de entrada
    nuevaEntrada.addEventListener("click", async function () {
        try {
            const response = await fetch(`${localStorage.getItem('url_bd')}/api/transacciones/detalle/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la transacción');
			}
            const transaccion = await response.json();
			
            window.open('movimientos/comprob/comprob.html?' +
                'titular=' + titular +
                '&micuit=' + micuit +
                '&cbu=' + cbu +
                '&nombre=' + transaccion.nombre +
                '&dni=' + transaccion.cuit +
                '&wallet=' + transaccion.billetera +
                '&tipo=' + tipo +
                '&saldo=' + saldo +
                '&motivo=' + motivo +
                '&monto=' + transaccion.monto +
                "&fecha=" + transaccion.fecha +
                "&codT=" + transaccion.codigo +
                "&urlImg=" + imagen +
			"&TresCod=" + TresCod, '_self' + "&email=" + email);
			} catch (error) {
            console.error('Error al obtener detalles de la transacción:', error);
		}
	});
}


function irAcomprob() {
    window.open("movimientos/movimientos.html?RemiNombre=" + RemiNombre + "&RemiCuit=" + RemiCuit + "&RemiCbu=" + RemiCbu + "&RemiSaldo=" + RemiSaldo + "&RemiMotivo=" + RemiMotivo + "&DestiNombre1=" + DestiNombre1 + "&DestiNombre2=" + DestiNombre2 + "&DestiAlias=" + DestiAlias + "&DestiCbuDest=" + DestiCbuDest + "&DestiCuit=" + DestiCuit + "&DestiCuenta=" + DestiCuenta + "&DestiTipo=" + DestiTipo + "&DestiImagen=" + DestiImagen + "&monto=0" + "&hora=" + hora + "&TresCod=" + TresCod + "&email=" + email, '_self');
	
}



async function obtenerYMostrarTransacciones(email) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const RemiNombre = urlParams.get('RemiNombre');
         

        if (!email || !RemiNombre) {
            throw new Error('Falta email o RemiNombre');
        }

        const response = await fetch(  `${localStorage.getItem('url_bd')}/tr/transaccionesen/${encodeURIComponent(email)}/${encodeURIComponent(RemiNombre)}`
        );
 

        const data = await response.json();
        
 

        const contenedorTransferencias = document.getElementById("transferencias");
        contenedorTransferencias.innerHTML = '';

        if (!data || (Array.isArray(data) && data.length === 0)) {
            contenedorTransferencias.innerHTML = '<p class="text-center p-4">No se encontraron transacciones para este usuario.</p>';
            return;
        }

        // Si data es un objeto de error
        if (data.error) {
            throw new Error(data.error);
        }

        // Asegurarse de que data sea un array
        const transacciones = Array.isArray(data) ? data : [data];

        transacciones.forEach(transaccion => {
            agregarNuevaEntrada(
                transaccion.monto,
                transaccion.nombre,
                transaccion.fecha,
                transaccion.url_img,
                transaccion.id
            );
        });
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack
        });
        
        const contenedorTransferencias = document.getElementById("transferencias");
        contenedorTransferencias.innerHTML = `<p class="text-center p-4 text-red-500">Error: ${error.message}</p>`;
    }
}




const urlParams2 = new URLSearchParams(window.location.search);
var email2 = urlParams2.get('email');
obtenerYMostrarTransacciones(email2);
