let perlas = [];
let iteraciones = [];
let giro = 0;
let activas = 1;
let intervalo = null;
let ultimaTransformada = -1;

document.getElementById("numPerlas").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("startBtn").click();
  }
});

document.getElementById("startBtn").addEventListener("click", () => {
  const n = parseInt(document.getElementById("numPerlas").value);
  if (n <= 0) return Swal.fire("Introduce un número válido de perlas.");

  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;

  perlas = Array(n).fill("negra");
  perlas[0] = "blanca";
  iteraciones = [];
  giro = 0;
  activas = 1;

  generarEncabezado(n);
  registrarIteracion();
  mostrarCollar();
  ciclo();
});

document.getElementById("stopBtn").addEventListener("click", () => {
  if (intervalo) clearInterval(intervalo);

  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
});

function ciclo() {
  const collar = document.getElementById("collar-circular");

  intervalo = setInterval(() => {
    perlas = rotar(perlas);
    giro++;

    if (giro % perlas.length === 0 && activas < perlas.length) {
      perlas[activas] = "blanca";
      activas++;
    }

    // ⚠️ Revisión: si solo queda una negra, transformarla en blanca sin registrar
    const negrasRestantes = perlas.filter((p) => p === "negra").length;
    if (negrasRestantes === 1) {
      const idx = perlas.findIndex((p) => p === "negra");
      perlas[idx] = "blanca";
      activas++; // ya que activamos una más
      ultimaTransformada = idx;
      // Swal.fire({
      //   title: "¡Última perla negra transformada!",
      //   text: `Perla en posición ${idx + 1} transformada a blanca.`,
      //   icon: "info",
      //   confirmButtonText: "Aceptar",
      // });
    }

    registrarIteracion();
    mostrarCollar();

    if (iteraciones.length >= (perlas.length - 1) ** 2) {
      clearInterval(intervalo);
      intervalo = null;

      document.getElementById("startBtn").disabled = false;
      document.getElementById("stopBtn").disabled = true;

      // Swal.fire({
      //   title: "¡Proceso terminado!",
      //   text: `Total de iteraciones: ${iteraciones.length} (esperado: ${(perlas.length - 1) ** 2})`,
      //   icon: "success",
      //   confirmButtonText: "Aceptar",
      // });

      return;
    }
  }, 800);
}

function rotar(arr) {
  return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
}

function mostrarCollar() {
  const contenedor = document.getElementById("collar-circular");
  contenedor.innerHTML = "";

  const n = perlas.length;
  const radius = 150;
  const centerX = 125;
  const centerY = 125;

  perlas.forEach((color, i) => {
    const angle = (2 * Math.PI * i) / n;
    const x = centerX + radius * Math.cos(angle) - 15;
    const y = centerY + radius * Math.sin(angle) - 15;

    const div = document.createElement("div");
    div.className = `perla ${color}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.transform = `translate(-50%, -50%)`;
    div.style.position = "absolute";

    const label = color === "blanca" ? `b${i + 1}` : `n${i + 1}`;
    div.textContent = label;

    div.classList.add("salto");

    contenedor.appendChild(div);
    if (i === ultimaTransformada) {
      div.classList.add("ultima-transformada");
    }
  });
  ultimaTransformada = -1; // Reiniciar para la próxima iteración
}

function generarEncabezado(n) {
  const headRow = document.getElementById("encabezado");
  headRow.innerHTML = "<th>Iteración</th>";
  for (let i = 1; i <= n; i++) {
    const th = document.createElement("th");
    th.textContent = `${i}`;
    headRow.appendChild(th);
  }
  document.getElementById("registro").innerHTML = "";
} 

function registrarIteracion() {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${iteraciones.length + 1}</td>`;
  perlas.forEach((p, i) => {
    const td = document.createElement("td");
    const esBlanca = p === "blanca";
    td.textContent = esBlanca ? `b${i + 1}` : `n${i + 1}`;
    td.classList.add(esBlanca ? "perla-blanca" : "perla-negra");
    row.appendChild(td);
  });

  document.getElementById("registro").appendChild(row);
  iteraciones.push([...perlas]);
}
