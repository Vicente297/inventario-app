const params = new URLSearchParams(window.location.search);
const form = document.getElementById("formTecnico");
const id = params.get("id");
const mensajeError = document.getElementById("mensajeError");

if (id) {
  cargarTecnico();
}

async function cargarTecnico() {
  try {
    const res = await fetch(`/api/tecnicos/${id}`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el técnico");
    }
    const data = await res.json();
    document.getElementById("nombre").value = data.nombre;
    document.getElementById("email").value = data.email;
    document.getElementById("telefono").value = data.num_telefono;
  } catch (error) {
    console.error("Error al cargar técnico:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  const errorNombre = document.getElementById("errorNombre");
  const errorEmail = document.getElementById("errorEmail");
  const errorTelefono = document.getElementById("errorTelefono");
  errorNombre.textContent = "";
  errorEmail.textContent = "";
  errorTelefono.textContent = "";

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

  if (hayErrores) return;

  const tecnico = {
    nombre,
    email,
    telefono,
  };

  try {
    const res = await fetch(id ? `/api/tecnicos/${id}` : "/api/tecnicos", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tecnico),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensaje || "Error al guardar técnico");
    }
    alert(
      data.mensaje ||
        (id ? "Tecnico actualizado con exito" : "Tecnico creado con exito"),
    );
    window.location.href = "/views/tecnicos/tecnicos.html";
  } catch (error) {
    alert("Error al guardar el tecnico");
    mostrarMensaje(error.message);
  }
});
