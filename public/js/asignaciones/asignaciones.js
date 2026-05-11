fetch("/api/asignaciones")
  .then((res) => res.json())
  .then((data) => {
    const tabla = document.getElementById("tablaAsignaciones");

    data.forEach((asig) => {
      const asignacion = `
        <tr>
          <td>
          <a href="/views/asignaciones/detalleAsignacion.html?id=${asig.id_asignacion}">
          <button class="btn btn-detalle">
          Ver detalle
          </button>
          </a></td>
          <td>${asig.id_asignacion}</td>
          <td>${asig.serie}</td>
          <td>${asig.nombre_usuario}</td>
          <td>${asig.nombre_tecnico}</td>
          <td>${asig.fecha_entrega}</td>
          <td>${asig.fecha_recepcion}</td>
        </tr>
      `;
      tabla.innerHTML += asignacion;
    });
  })
  .catch((error) => console.error("Error:", error));
