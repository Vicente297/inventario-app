const tabla = document.getElementById("tablaEquipos");
const busquedaSerie = document.getElementById("busquedaSerie");

let equipos = [];

function editarEquipo(id) {
  window.location.href = `/views/equipos/formEquipo.html?id=${id}`;
}

async function cargarEquipos() {
  try {
    const res = await fetch("/api/equipos");

    equipos = await res.json();

    mostrarEquipos(equipos);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function eliminarEquipo(id) {
  if (!confirm("¿Estás seguro de eliminar este Equipo?")) return;

  try {
    const response = await fetch(`/api/equipos/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      equipos = equipos.filter((equipo) => equipo.id_equipo !== id);

      mostrarEquipos(equipos);

      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function mostrarEquipos(lista) {
  tabla.innerHTML = "";

  lista.forEach((equipo) => {
    tabla.innerHTML += `
      <tr id="equipo-${equipo.id_equipo}">

        <td>
          <button
            class="btn-eliminar"
            onclick="eliminarEquipo(${equipo.id_equipo})">X</button>
        </td>
        <td>
          <button class="btn-editar"
            onclick="editarEquipo(${equipo.id_equipo})">Editar</button>
        </td>
        <td>${equipo.id_equipo}</td>
        <td>${equipo.tipo_equipo}</td>
        <td>${equipo.nombre_modelo}</td>
        <td>${equipo.serie}</td>
        <td>${equipo.procesador}</td>
        <td>${equipo.ram}</td>
        <td>${equipo.disco} GB</td>
        <td>${equipo.sistema_operativo}</td>
        <td>${equipo.nombre_estado}</td>
        <td>${equipo.factura}</td>
        <td>${equipo.nombre_proveedor}</td>
        <td>${equipo.fecha_entrega_proveedor}</td>
        <td>${equipo.valor}</td>
        <td>${equipo.garantia} meses</td>
        <td>${equipo.termino_garantia}</td>
        <td>${equipo.comentario}</td>
      </tr>
    `;
  });
}

busquedaSerie.addEventListener("input", () => {
  const texto = busquedaSerie.value.toLowerCase().trim();

  const equiposFiltrados = equipos.filter((equipo) =>
    equipo.serie.toLowerCase().includes(texto),
  );

  mostrarEquipos(equiposFiltrados);
});

let ordenGarantia = false;

function alternarOrden() {
  const btn = document.querySelector(".btn-center button");

  if (!ordenGarantia) {
    const ordenados = [...equipos].sort((a, b) => {
      return new Date(a.termino_garantia) - new Date(b.termino_garantia);
    });

    mostrarEquipos(ordenados);
    ordenGarantia = true;
  } else {
    const ordenOriginal = [...equipos].sort(
      (a, b) => a.id_equipo - b.id_equipo,
    );

    mostrarEquipos(ordenOriginal);
    ordenGarantia = false;
  }
  btn.textContent = ordenGarantia
    ? "Volver al orden normal"
    : "Ordenar por garantía";
}

cargarEquipos();
