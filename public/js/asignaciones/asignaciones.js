const contenedorTabla = document.getElementById("tablaContainer");
const tabla = document.getElementById("tablaAsignaciones");

function editarAsignacion(id) {
  window.location.href = `/views/asignaciones/formAsignaciones.html?id=${id}`;
}

async function cargarAsignaciones() {
  try {
    const res = await fetch("/api/asignaciones");
    const data = await res.json();

    if (!data || data.length === 0) {
      contenedorTabla.innerHTML = `
      <div class="alerta">
      No existen asignaciones registradas
      </div>
      `;
      return;
    }

    let filas = "";
    data.forEach((asig) => {
      filas += `
        <tr id="asignacion-${asig.id_asignacion}">
          <td>
            <a href="/views/asignaciones/detalleAsignacion.html?id=${asig.id_asignacion}">
              <button class="btn-detalle">
                Ver detalle
              </button>
            </a>
          </td>
          <td>
            <button
              class="btn-editar"
              onclick="editarAsignacion(${asig.id_asignacion})">
              Editar
            </button>
          </td>
          <td>${asig.id_asignacion}</td>
          <td>${asig.serie}</td>
          <td>${asig.nombre_usuario}</td>
          <td>${asig.nombre_tecnico}</td>
          <td>${asig.fecha_entrega}</td>
          <td>${asig.fecha_recepcion ?? "Sin recepción"}</td>
        </tr>
      `;
    });
    tabla.innerHTML = filas;
  } catch (error) {
    console.error("Error:", error);
  }
}

cargarAsignaciones();
