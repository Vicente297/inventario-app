const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const form = document.getElementById("formAsignacion");
const listaEquipos = document.getElementById("listaEquipos");
const listaUsuarios = document.getElementById("listaUsuarios");
const listaTecnicos = document.getElementById("listaTecnicos");

let equipos = [];
let usuarios = [];
let tecnicos = [];

async function cargarEquipos() {
  try {
    const res = await fetch("/api/equipos");
    equipos = await res.json();

    listaEquipos.innerHTML = "";

    equipos.forEach((equipo) => {
      listaEquipos.innerHTML += `
        <option value="${equipo.serie}">
      `;
    });

    console.log("Equipos:", equipos);
  } catch (error) {
    console.error("Error al cargar equipos:", error);
  }
}

async function cargarUsuarios() {
  try {
    const res = await fetch("/api/usuarios");
    usuarios = await res.json();

    listaUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {
      listaUsuarios.innerHTML += `
        <option value="${usuario.nombre}">
      `;
    });

    console.log("Usuarios:", usuarios);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

async function cargarTecnicos() {
  try {
    const res = await fetch("/api/tecnicos");
    tecnicos = await res.json();

    listaTecnicos.innerHTML = "";

    tecnicos.forEach((tecnico) => {
      listaTecnicos.innerHTML += `
        <option value="${tecnico.nombre}">
      `;
    });

    console.log("Tecnicos:", tecnicos);
  } catch (error) {
    console.error("Error al cargar técnicos:", error);
  }
}

async function cargarAsignacion() {
  try {
    const res = await fetch(`/api/asignaciones/${id}`);
    if (!res.ok) {
      throw new Error("No se pudo obtener la asignación");
    }

    const data = await res.json();
    const equipo = equipos.find((e) => e.id_equipo === data.id_equipo);
    const usuario = usuarios.find((u) => u.id_usuario === data.id_usuario);
    const tecnico = tecnicos.find((t) => t.id_tecnico === data.id_tecnico);

    document.getElementById("serie").value = equipo?.serie || "";
    document.getElementById("usuario").value = usuario?.nombre || "";
    document.getElementById("tecnico").value = tecnico?.nombre || "";
    document.getElementById("entrega").value = data.fecha_entrega || "";
    document.getElementById("recepcion").value = data.fecha_recepcion || "";
  } catch (error) {
    console.error("Error al cargar asignación:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const serie = document.getElementById("serie").value.trim();
  const usuarioNombre = document.getElementById("usuario").value.trim();
  const tecnicoNombre = document.getElementById("tecnico").value.trim();
  const entrega = document.getElementById("entrega").value;
  const recepcion = document.getElementById("recepcion").value;

  const errorSerie = document.getElementById("errorSerie");
  const errorUsuario = document.getElementById("errorUsuario");
  const errorTecnico = document.getElementById("errorTecnico");
  const errorEntrega = document.getElementById("errorEntrega");
  const errorRecepcion = document.getElementById("errorRecepcion");

  errorSerie.textContent = "";
  errorUsuario.textContent = "";
  errorTecnico.textContent = "";
  errorEntrega.textContent = "";
  errorRecepcion.textContent = "";

  let hayErrores = false;

  const equipo = equipos.find(
    (e) => e.serie.toLowerCase().trim() === serie.toLowerCase().trim(),
  );
  if (!serie) {
    errorSerie.textContent = "*La serie es obligatoria";
    hayErrores = true;
  } else if (!equipo) {
    errorSerie.textContent = "*Equipo no encontrado";
    alert("Equipo no encontrado");
    hayErrores = true;
  }

  const usuario = usuarios.find(
    (u) => u.nombre.toLowerCase().trim() === usuarioNombre.toLowerCase().trim(),
  );
  if (!usuarioNombre) {
    errorUsuario.textContent = "*El usuario es obligatorio";
    hayErrores = true;
  } else if (!usuario) {
    errorUsuario.textContent = "*Usuario no encontrado";
    alert("Usuario no encontrado");
    hayErrores = true;
  }

  const tecnico = tecnicos.find(
    (t) => t.nombre.toLowerCase().trim() === tecnicoNombre.toLowerCase().trim(),
  );

  if (!tecnicoNombre) {
    errorTecnico.textContent = "*El técnico es obligatorio";
    hayErrores = true;
  } else if (!tecnico) {
    errorTecnico.textContent = "*Técnico no encontrado";
    alert("Técnico no encontrado");
    hayErrores = true;
  }

  if (!entrega) {
    errorEntrega.textContent = "*Seleccione una fecha de entrega";
    alert("Seleccione una fecha de entrega");
    hayErrores = true;
  }

  if (recepcion && recepcion < entrega) {
    errorRecepcion.textContent =
      "*La recepción no puede ser menor que la entrega";
    hayErrores = true;
  }

  if (hayErrores) return;

  const asignacion = {
    id_equipo: equipo.id_equipo,
    id_usuario: usuario.id_usuario,
    id_tecnico: tecnico.id_tecnico,
    fecha_entrega: entrega,
    fecha_recepcion: recepcion || null,
  };

  try {
    const res = await fetch(
      id ? `/api/asignaciones/${id}` : "/api/asignaciones",
      {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asignacion),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al guardar la asignación");
    }
    alert(
      data.message ||
        (id
          ? "Asignación actualizada correctamente"
          : "Asignación creada correctamente"),
    );
    window.location.href = "/views/asignaciones/asignaciones.html";
  } catch (error) {
    console.error(error);
    alert("Error al guardar la asignación");
  }
});

async function iniciar() {
  await cargarEquipos();
  await cargarUsuarios();
  await cargarTecnicos();
  if (id) {
    await cargarAsignacion();
  }
}
iniciar();
