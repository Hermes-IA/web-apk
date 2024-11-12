if (hora == "Actual") {
    hora = fechaActual.toLocaleString('es-AR', options);
}

function extraerHora(fechaTexto) {
    const fecha = new Date(fechaTexto);
    const horas = String(fecha.getHours()).padStart(2, '0'); // Asegura que tenga 2 dígitos
    const minutos = String(fecha.getMinutes()).padStart(2, '0'); // Asegura que tenga 2 dígitos
    return `${horas}:${minutos}`;
}
function obtenerHoraActual() {
    const fecha = new Date();  // Obtiene la fecha y hora actual
    let horas = fecha.getHours();  // Obtiene las horas
    let minutos = fecha.getMinutes();  // Obtiene los minutos

    // Asegura que las horas y minutos siempre tengan dos dígitos
    horas = horas.toString().padStart(2, '0');
    minutos = minutos.toString().padStart(2, '0');

    // Devuelve la hora en formato HH:mm
    return `${horas}:${minutos}`;
}

CrearEntrada();



async function CrearEntrada() {
    try {
        // Validamos que los datos necesarios existan
        if (!email || !DestiNombre1) {
            throw new Error('Faltan datos requeridos');
        }

        const nuevaEntrada = {
            email: email,
            nombre: DestiNombre1,
            nombreComp: DestiNombre2,
            codigo: codT,
            monto: monto,
            fecha: fechaFormateada + " - " + obtenerHoraActual() + " hs",
            cbu: DestiCbuDest,
            cuit: DestiCuit,
            motivo: RemiMotivo,
            tipo: DestiTipo,
            billetera: DestiCuenta,
            urlimg: DestiImagen,
            Rnombre: RemiNombre,
            Rcuit: RemiCuit,
            Rcbu: RemiCbu
        };

        console.log('Datos a enviar:', nuevaEntrada); // Para debug
        
        const response = await fetch(localStorage.getItem('url_bd') + '/tr/transacciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si tienes CORS, podrías necesitar esto:
                'Accept': 'application/json'
            },
            body: JSON.stringify(nuevaEntrada)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Error del servidor: ${responseData.error || response.statusText}`);
        }

        console.log('Transacción guardada exitosamente:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error detallado:', error);
        console.error('Mensaje de error:', error.message); 
        throw error;
    }
}


function normalizarNumero(numeroStr) { 
    return parseFloat(numeroStr.replace(/\./g, '').replace(',', '.'));
}
 

function realizarResta(num1, num2) { 
    const n1 = normalizarNumero(num1);
    const n2 = normalizarNumero(num2); 
    const resultado = n1 - n2; 
    return resultado;
}
 
const resultado = realizarResta(RemiSaldo, monto); 
  
const actualizarSaldo = async (email, nombre, nuevo_saldo) => {
    try {
        const response = await fetch(localStorage.getItem('url_bd') +'/user/update-saldo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: email,
                nombre: nombre,
                nuevo_saldo: nuevo_saldo,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el saldo');
        }
        
        const data = await response.json();
        console.log('Saldo actualizado:', data);
        } catch (error) {
        console.error('Error al actualizar el saldo:', error);
    }
};

// Llamada a la función
actualizarSaldo(email, RemiNombre, resultado);

