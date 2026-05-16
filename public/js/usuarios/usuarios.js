const tabla = document.getElementById("tablaUsuarios");
const rol = localStorage.getItem("rol");
const contenedorTabla = document.getElementById("tablaContainer");

if (rol !== "admin") {
  alert("Acceso denegado");
  window.location.href = "/views/asignaciones/asignaciones.html";
}

function editarUsuario(id) {
  window.location.href = `/views/usuarios/formUsuario.html?id=${id}`;
}

async function cargarUsuarios() {
  try {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    usuarios = data;
    if (!usuarios || usuarios.length === 0) {
      contenedorTabla.innerHTML = `
        <div class="alerta">
          No existen usuarios registrados
        </div>
      `;
      return;
    }
    mostrarUsuarios(usuarios);
  } catch (error) {
    console.error("Error:", error);
  }
}

function mostrarUsuarios(lista) {
  tabla.innerHTML = "";

  lista.forEach((usuario) => {
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
        <td>${usuario.telefono ?? "Sin teléfono"}</td>
        <td>${usuario.nombre_departamento}</td>
        <td>${usuario.direccion}</td>
        <td>${usuario.cargo}</td>
      </tr>
    `;
  });
}

async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
  try {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      usuarios = usuarios.filter((u) => u.id_usuario !== id);
      mostrarUsuarios(usuarios);
      if (usuarios.length === 0) {
        contenedorTabla.innerHTML = `
          <div class="alerta">
            No existen usuarios registrados
          </div>
        `;
      }
      alert(data.message || "Usuario eliminado correctamente");
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

cargarUsuarios();
