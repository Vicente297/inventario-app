const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const detalle = document.getElementById("detalleAsignacion");
const rol = localStorage.getItem("rol") || "";
const esAdmin = rol === "admin";

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
      <div class="btn-container">
      <button class="btn btn-detalle navbar">
        <a href="#" onclick="history.back()">Volver</a>
      </button>
      ${
        esAdmin
          ? `
        <button class="btn btn-eliminar" onclick="eliminarAsignacion(${id})">
        Eliminar
        </button>
        `
          : `
        <button class="btn btn-eliminar" disable">
        Eliminar
        </button>
        `
      }
      </div>
    `;
  } catch (error) {
    console.error(error);
    detalle.innerHTML = `
      <p>Error al cargar detalle</p>
    `;
  }
}

async function eliminarAsignacion(id) {
  if (!confirm("¿Estás seguro de eliminar esta asignacion?")) return;

  try {
    const response = await fetch(`/api/asignaciones/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Eliminado correctamente");
      window.location.href = "/views/asignaciones/asignaciones.html";
    } else {
      const errorData = await response.json();
      alert("Error: " + errorData.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

cargarDetalle();
