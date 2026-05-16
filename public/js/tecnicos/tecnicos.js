const tabla = document.getElementById("tablaTecnicos");
const rol = localStorage.getItem("rol");
const contenedorTabla = document.getElementById("tablaContainer");

if (rol !== "admin") {
  alert("Acceso denegado");
  window.location.href = "/views/asignaciones/asignaciones.html";
}

function editarTecnico(id) {
  window.location.href = `/views/tecnicos/formTecnico.html?id=${id}`;
}

async function cargarTecnicos() {
  try {
    const res = await fetch("/api/tecnicos");
    const data = await res.json();
    tecnicos = data;

    if (!tecnicos || tecnicos.length === 0) {
      contenedorTabla.innerHTML = `
      <div class="alerta">
      No existen tecnicos registrados
      </div>
      `;
      return;
    }
    mostrarTecnicos(tecnicos);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function mostrarTecnicos(lista) {
  tabla.innerHTML = "";
  lista.forEach((tecnico) => {
    tabla.innerHTML += `
      <tr id="tecnico-${tecnico.id_tecnico}">
        <td><button class="btn-eliminar" onclick="eliminarTecnico(${tecnico.id_tecnico})">X</button></td>
        <td><button class="btn-editar" onclick="editarTecnico(${tecnico.id_tecnico})">Editar</button></td>
        <td>${tecnico.id_tecnico}</td>
        <td>${tecnico.nombre}</td>
        <td>${tecnico.email}</td>
        <td>${tecnico.telefono ?? "Sin telefono"}</td>
      </tr>
      `;
  });
}

async function eliminarTecnico(id) {
  if (!confirm("¿Estás seguro de eliminar este técnico?")) return;

  try {
    const response = await fetch(`/api/tecnicos/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      tecnicos = tecnicos.filter((t) => t.id_tecnico !== id);
      mostrarTecnicos(tecnicos);
      if (tecnicos.length === 0) {
        contenedorTabla.innerHTML = `
      <div class="alerta">
        No existen técnicos registrados
      </div>
    `;
      }
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

cargarTecnicos();
