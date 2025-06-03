// src/renderer.js
// Este archivo maneja la lógica de la interfaz de usuario y la interacción con el usuario

let perlas = []; // Array para almacenar el estado de las perlas
let iteraciones = []; // Array para almacenar las iteraciones del proceso
let giro = 0; // Contador de giros realizados
let activas = 1; // Contador de perlas activas
let intervalo = null; // Variable para almacenar el intervalo de tiempo
let ultimaTransformada = -1; // Índice de la última perla transformada

// Inicializar los botones y eventos
// Metodo para añadir el evento de teclado al input ENTER
document.getElementById("numPerlas").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { // Si se presiona Enter
    document.getElementById("startBtn").click(); // Simula el clic en el botón de inicio
  }
});

document.getElementById("startBtn").addEventListener("click", () => { // Iniciar el proceso
  const n = parseInt(document.getElementById("numPerlas").value); // Obtener el número de perlas del input
  if (isNaN(n) || n <= 0) { // Validar que el número de perlas sea un número válido y positivo
    Swal.fire({ // Mostrar alerta de error
      title: "Error",
      text: "Introduce un número válido de perlas.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return; // Si no es válido, salir de la función
  }

  document.getElementById("startBtn").disabled = true; // Deshabilitar el botón de inicio
  document.getElementById("stopBtn").disabled = false; // Habilitar el botón de detener

  perlas = Array(n).fill("negra"); // Inicializar el array de perlas con 'negra'
  perlas[0] = "blanca"; // La primera perla es 'blanca'
  iteraciones = []; // Reiniciar el array de iteraciones
  giro = 0; // Reiniciar el contador de giros
  activas = 1; // Reiniciar el contador de perlas activas

  generarEncabezado(n); // Generar el encabezado de la tabla de iteraciones
  registrarIteracion(); // Registrar la primera iteración
  mostrarCollar(); // Mostrar el collar inicial
  ciclo(); // Iniciar el ciclo de iteraciones
});

document.getElementById("stopBtn").addEventListener("click", () => { // Detener el proceso
  if (intervalo) clearInterval(intervalo); // Limpiar el intervalo si está activo

  document.getElementById("startBtn").disabled = false; // Habilitar el botón de inicio
  document.getElementById("stopBtn").disabled = true; // Deshabilitar el botón de detener
});

function ciclo() { // Función que maneja el ciclo de iteraciones
  const collar = document.getElementById("collar-circular"); // Obtener el contenedor del collar

  intervalo = setInterval(() => { // Iniciar un intervalo para actualizar el collar
    perlas = rotar(perlas); // Rotar las perlas una posición a la izquierda
    giro++; // Incrementar el contador de giros

    if (giro % perlas.length === 0 && activas < perlas.length) { // Cada n giros, transformar una perla negra a blanca
      perlas[activas] = "blanca"; // Cambiar la perla activa a blanca
      activas++; // Incrementar el contador de perlas activas
    }

    const negrasRestantes = perlas.filter((p) => p === "negra").length; // Contar las perlas negras restantes
    if (negrasRestantes === 1) { // Si solo queda una perla negra, transformarla a blanca
      const idx = perlas.findIndex((p) => p === "negra"); // Encontrar el índice de la última perla negra
      perlas[idx] = "blanca"; // Transformar la perla a blanca
      activas++; // Incrementar el contador de perlas activas
      ultimaTransformada = idx; // Guardar el índice de la última perla transformada
    }

    registrarIteracion(); // Registrar la iteración actual
    mostrarCollar(); // Mostrar el collar actualizado

    if (iteraciones.length >= (perlas.length - 1) ** 2) { // Si se han realizado suficientes iteraciones, detener el proceso
      clearInterval(intervalo); // Limpiar el intervalo
      intervalo = null; // Reiniciar la variable de intervalo

      document.getElementById("startBtn").disabled = false; // Habilitar el botón de inicio
      document.getElementById("stopBtn").disabled = true; // Deshabilitar el botón de detener

      Swal.fire({ // Mostrar alerta de éxito al finalizar el proceso
        title: "¡Proceso terminado!",
        text: `Total de iteraciones: ${iteraciones.length} (esperado: ${(perlas.length - 1) ** 2 
          })`, // Mensaje con el total de iteraciones
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      return; // Salir de la función si el proceso ha terminado
    }
  }, 800); // Intervalo de 800 ms para actualizar el collar
}

// function rotar(arr) {
//   return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
// }
function rotar(arr) { 
  return [...arr.slice(1), arr[0]]; // Rotar el array una posición a la izquierda
}

function mostrarCollar() { // Función para mostrar el collar circular con las perlas
  const contenedor = document.getElementById("collar-circular"); // Obtener el contenedor del collar
  contenedor.innerHTML = ""; // Limpiar el contenido del contenedor

  const n = perlas.length; // Número de perlas
  const perlaSize = 20; // Diámetro de cada perla
  const padding = 5; // Espacio opcional entre perlas
  const angle = (2 * Math.PI) / n; // Ángulo entre perlas en radianes
  const minRadius = 20; // Radio mínimo para el collar
  
  // Calcular el radio del collar basado en el número de perlas y el tamaño de las perlas
  const radius = Math.max(minRadius, (perlaSize + padding) / (2 * Math.sin(angle / 2))); 
  const centerX = radius + 50; // Centro del collar en el eje X
  const centerY = radius + 50; // Centro del collar en el eje Y

  // Ajustar el tamaño del contenedor según el nuevo radio
  contenedor.style.width = `${centerX * 2}px`; // Ancho del contenedor
  contenedor.style.height = `${centerY * 2}px`; // Alto del contenedor
  contenedor.style.position = "relative"; // Posición relativa para posicionar las perlas

  perlas.forEach((color, i) => { // Iterar sobre cada perla
    const theta = (2 * Math.PI * i) / n; // Calcular el ángulo para la posición de la perla
    const x = centerX + radius * Math.cos(theta) - perlaSize / 2; // Calcular la posición X de la perla
    const y = centerY + radius * Math.sin(theta) - perlaSize / 2; // Calcular la posición Y de la perla

    const div = document.createElement("div"); // Crear un nuevo elemento div para la perla
    div.className = `perla ${color}`; // Asignar clases según el color de la perla
    div.style.left = `${x}px`; // Posicionar la perla en el eje X
    div.style.top = `${y}px`; // Posicionar la perla en el eje Y
    div.style.transform = `translate(-50%, -50%)`; // Centrar la perla
    div.style.position = "absolute"; // Posición absoluta para que se posicione correctamente en el contenedor

    const label = color === "blanca" ? `b${i + 1}` : `n${i + 1}`; // Etiqueta para la perla
    div.textContent = label; // Asignar el texto de la perla

    div.classList.add("salto"); // Añadir clase de salto para animación

    contenedor.appendChild(div); // Añadir la perla al contenedor

    if (i === ultimaTransformada) { // Si es la última perla transformada, añadir una clase especial
      div.classList.add("ultima-transformada"); // Añadir clase para destacar la última perla transformada
    }
  });

  ultimaTransformada = -1; // Reiniciar el índice de la última perla transformada
}

function generarEncabezado(n) { // Función para generar el encabezado de la tabla de iteraciones
  const headRow = document.getElementById("encabezado"); // Obtener la fila del encabezado de la tabla
  headRow.innerHTML = "<th>Iteración</th>"; // Limpiar el contenido del encabezado
  for (let i = 1; i <= n; i++) { // Iterar desde 1 hasta n para crear las columnas de perlas
    const th = document.createElement("th"); // Crear un nuevo elemento th para cada perla
    th.textContent = `${i}`; // Asignar el texto del número de perla
    headRow.appendChild(th); // Añadir el th al encabezado
  }
  document.getElementById("registro").innerHTML = ""; // Limpiar el registro de iteraciones
}

function registrarIteracion() { // Función para registrar la iteración actual en la tabla
  const row = document.createElement("tr"); // Crear una nueva fila para la iteración
  row.innerHTML = `<td>${iteraciones.length + 1}</td>`; // Añadir el número de iteración en la primera celda
  perlas.forEach((p, i) => { // Iterar sobre cada perla para añadir su estado a la fila
    const td = document.createElement("td"); // Crear una nueva celda para cada perla
    const esBlanca = p === "blanca"; // Verificar si la perla es blanca
    td.textContent = esBlanca ? `b${i + 1}` : `n${i + 1}`; // Asignar el texto de la perla
    td.classList.add(esBlanca ? "perla-blanca" : "perla-negra"); // Añadir clase según el color de la perla
    row.appendChild(td); // Añadir la celda a la fila
  });

  document.getElementById("registro").appendChild(row); // Añadir la fila al registro de iteraciones
  iteraciones.push([...perlas]); // Guardar el estado actual de las perlas en el array de iteraciones
}
