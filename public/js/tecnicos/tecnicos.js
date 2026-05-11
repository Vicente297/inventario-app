const tabla = document.getElementById("tablaTecnicos");

function editarTecnico(id) {
  window.location.href = `/views/tecnicos/formTecnico.html?id=${id}`;
}

async function cargarTecnicos() {
  try {
    const res = await fetch("/api/tecnicos");
    const data = await res.json();

    tabla.innerHTML = "";

    data.forEach((tecnico) => {
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
  } catch (error) {
    console.error("Error:", error);
  }
}

async function eliminarTecnico(id) {
  if (!confirm("¿Estás seguro de eliminar este técnico?")) return;

  try {
    const response = await fetch(`/api/tecnicos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.getElementById(`tecnico-${id}`).remove();
      alert("Eliminado correctamente");
    } else {
      const errorData = await response.json();
      alert("Error: " + errorData.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

cargarTecnicos();
