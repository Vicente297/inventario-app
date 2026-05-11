const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const detalle = document.getElementById("detalleAsignacion");

async function cargarDetalle() {
  try {
    const res = await fetch(`/api/asignaciones/${id}`);
    const data = await res.json();

    detalle.innerHTML = `
      <div class="card">
      <h2><strong># ${data.serie}</strong></h2>
        <hr>

        <h2>Equipo</h2>
        <p><strong>Tipo:</strong> ${data.tipo_equipo}</p>
        <p><strong>Modelo:</strong> ${data.nombre_modelo}</p>
        <p><strong>Serie:</strong> ${data.serie}</p>
        <p><strong>Procesador:</strong> ${data.procesador}</p>
        <p><strong>RAM:</strong> ${data.ram} GB</p>
        <p><strong>Disco:</strong> ${data.disco}</p>
        <p><strong>Sistema Operativo:</strong> ${data.sistema_operativo}</p>

        <hr>

        <h2>Usuario asignado</h2>
        <p><strong>Nombre:</strong> ${data.nombre_usuario}</p>
        <p><strong>Cargo:</strong> ${data.cargo}</p>
        <p><strong>Departamento:</strong> ${data.departamento}</p>
        <p><strong>Dirección:</strong> ${data.direccion}</p>

        <hr>

        <h2>Entregado por</h2>
        <p><strong>Técnico:</strong> ${data.nombre_tecnico}</p>
        <p><strong>Fecha entrega:</strong> ${data.fecha_entrega}</p>
        <p><strong>Fecha recepción:</strong> ${data.fecha_recepcion || "Pendiente"}</p>

      </div>
    `;
  } catch (error) {
    console.error(error);
    detalle.innerHTML = `
      <p>Error al cargar detalle</p>
    `;
  }
}

cargarDetalle();
