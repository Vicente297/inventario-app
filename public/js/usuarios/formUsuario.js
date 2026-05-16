const params = new URLSearchParams(window.location.search);
const form = document.getElementById("formUsuario");
const id = params.get("id");

const rol = localStorage.getItem("rol");

if (rol !== "admin") {
  window.location.href = "/views/asignaciones/asignaciones.html";
  alert("Acceso denegado");
}

if (id) {
  cargarUsuario();
}

async function cargarUsuario() {
  try {
    const res = await fetch(`/api/usuarios/${id}`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el usuario");
    }
    const data = await res.json();
    document.getElementById("nombre").value = data.nombre;
    document.getElementById("email").value = data.email;
    document.getElementById("telefono").value = data.num_telefono;
    document.getElementById("departamento").value = data.id_departamento;
    document.getElementById("direccion").value = data.direccion;
    document.getElementById("cargo").value = data.cargo;
  } catch (error) {
    console.error("Error al cargar usuario:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const departamento = document.getElementById("departamento").value;
  const direccion = document.getElementById("direccion").value.trim();
  const cargo = document.getElementById("cargo").value.trim();

  const errorNombre = document.getElementById("errorNombre");
  const errorEmail = document.getElementById("errorEmail");
  const errorTelefono = document.getElementById("errorTelefono");
  const errorDepartamento = document.getElementById("errorDepartamento");
  const errorDireccion = document.getElementById("errorDireccion");
  const errorCargo = document.getElementById("errorCargo");
  errorNombre.textContent = "";
  errorEmail.textContent = "";
  errorTelefono.textContent = "";
  errorDepartamento.textContent = "";
  errorDireccion.textContent = "";
  errorCargo.textContent = "";

  let hayErrores = false;

  if (!nombre) {
    errorNombre.textContent = "*El nombre es obligatorio";
    hayErrores = true;
  } else if (nombre.length < 3) {
    errorNombre.textContent = "*El nombre debe tener al menos 3 caracteres";
    hayErrores = true;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    errorEmail.textContent = "*El correo es obligatorio";
    hayErrores = true;
  } else if (!emailRegex.test(email)) {
    errorEmail.textContent = "*Ingrese un correo válido";
    hayErrores = true;
  }

  if (!telefono) {
    errorTelefono.textContent = "*El teléfono es obligatorio";
    hayErrores = true;
  } else {
    const telefonoLimpio = telefono.replace(/\D/g, "");
    const telefonoValido =
      (telefonoLimpio.length === 9 && telefonoLimpio.startsWith("9")) ||
      (telefonoLimpio.length === 11 && telefonoLimpio.startsWith("569"));
    if (!telefonoValido) {
      errorTelefono.textContent = "*Ingrese un teléfono válido";
      hayErrores = true;
    }
  }

  if (!departamento) {
    errorDepartamento.textContent = "*Seleccione un departamento";
    hayErrores = true;
  }

  if (!direccion) {
    errorDireccion.textContent = "*La direccion es obligatorio";
    hayErrores = true;
  } else if (direccion.length < 5) {
    errorDireccion.textContent = "*Ingrese una dirección válida";
    hayErrores = true;
  }

  if (!cargo) {
    errorCargo.textContent = "*El cargo es obligatorio";
    hayErrores = true;
  } else if (cargo.length < 3) {
    errorCargo.textContent = "*Ingrese un cargo válido";
    hayErrores = true;
  }

  if (hayErrores) return;

  const usuario = {
    nombre,
    email,
    telefono,
    id_departamento: departamento,
    direccion,
    cargo,
  };

  try {
    const res = await fetch(id ? `/api/usuarios/${id}` : "/api/usuarios", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al guardar usuario");
    }

    alert(id ? "Usuario actualizado con éxito" : "Usuario creado con éxito");

    window.location.href = "/views/usuarios/usuarios.html";
  } catch (error) {
    console.error(error);
    alert("Error al guardar el usuario");
  }
});
