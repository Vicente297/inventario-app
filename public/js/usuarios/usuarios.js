const tabla = document.getElementById("tablaUsuarios");

function editarUsuario(id) {
  window.location.href = `/views/usuarios/formUsuario.html?id=${id}`;
}

async function cargarUsuarios() {
  try {
    const res = await fetch("/api/usuarios");
    const data = await res.json();

    tabla.innerHTML = "";

    data.forEach((usuario) => {
      tabla.innerHTML += `
        <tr id="usuario-${usuario.id_usuario}">
          <td>
            <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id_usuario})">X</button>
          </td>
          <td>
            <button class="btn-editar" onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
          </td>
          <td>${usuario.id_usuario}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.email}</td>
          <td>${usuario.telefono}</td>
          <td>${usuario.nombre_departamento}</td>
          <td>${usuario.direccion}</td>
          <td>${usuario.cargo}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      document.getElementById(`usuario-${id}`).remove();
      alert("Usuario eliminado correctamente");
    } else {
      const data = await res.json();
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

cargarUsuarios();
