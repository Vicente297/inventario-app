const params = new URLSearchParams(window.location.search);
const form = document.getElementById("formEquipo");
const id = params.get("id");
const rol = localStorage.getItem("rol");

if (rol !== "admin") {
  alert("Acceso denegado");
  window.location.href = "/views/asignaciones/asignaciones.html";
}

if (id) {
  cargarEquipo();
}

async function cargarEquipo() {
  try {
    const res = await fetch(`/api/equipos/${id}`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el equipo");
    }
    const data = await res.json();
    document.getElementById("tipo_equipo").value = data.tipo_equipo;
    document.getElementById("id_modelo").value = data.id_modelo;
    document.getElementById("serie").value = data.serie;
    document.getElementById("procesador").value = data.procesador;
    document.getElementById("ram").value = data.ram;
    document.getElementById("disco").value = data.disco;
    document.getElementById("id_sistema_operativo").value =
      data.id_sistema_operativo;
    document.getElementById("id_estado").value = data.id_estado;
    document.getElementById("factura").value = data.factura;
    document.getElementById("id_proveedor").value = data.id_proveedor;
    document.getElementById("entregaProveedor").value =
      data.fecha_entrega_proveedor;
    document.getElementById("valor").value = data.valor;
    document.getElementById("garantia").value = data.garantia;
    document.getElementById("terminoGarantia").value = data.termino_garantia;
    document.getElementById("comentario").value = data.comentario;
  } catch (error) {
    console.error("Error al cargar equipo:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo_equipo = document.getElementById("tipo_equipo").value.trim();
  const id_modelo = document.getElementById("id_modelo").value;
  const serie = document.getElementById("serie").value.trim();
  const procesador = document.getElementById("procesador").value.trim();
  const ram = document.getElementById("ram").value.trim();
  const disco = document.getElementById("disco").value.trim();
  const id_sistema_operativo = document.getElementById(
    "id_sistema_operativo",
  ).value;
  const id_estado = document.getElementById("id_estado").value;
  const factura = document.getElementById("factura").value.trim();
  const id_proveedor = document.getElementById("id_proveedor").value;
  const fecha_entrega_proveedor =
    document.getElementById("entregaProveedor").value;
  const valor = document.getElementById("valor").value.trim();
  const garantia = document.getElementById("garantia").value.trim();
  const termino_garantia = document.getElementById("terminoGarantia").value;
  const comentario = document.getElementById("comentario").value.trim();

  const errorTipoEquipo = document.getElementById("errorTipoEquipo");
  const errorModelo = document.getElementById("errorModelo");
  const errorSerie = document.getElementById("errorSerie");
  const errorProcesador = document.getElementById("errorProcesador");
  const errorRam = document.getElementById("errorRam");
  const errorDisco = document.getElementById("errorDisco");
  const errorSistema = document.getElementById("errorSistema");
  const errorEstado = document.getElementById("errorEstado");
  const errorFactura = document.getElementById("errorFactura");
  const errorProveedor = document.getElementById("errorProveedor");
  const errorEntrega = document.getElementById("errorEntrega");
  const errorValor = document.getElementById("errorValor");
  const errorGarantia = document.getElementById("errorGarantia");
  const errorTerminoGarantia = document.getElementById("errorTerminoGarantia");
  errorTipoEquipo.textContent = "";
  errorModelo.textContent = "";
  errorSerie.textContent = "";
  errorProcesador.textContent = "";
  errorRam.textContent = "";
  errorDisco.textContent = "";
  errorSistema.textContent = "";
  errorEstado.textContent = "";
  errorFactura.textContent = "";
  errorProveedor.textContent = "";
  errorEntrega.textContent = "";
  errorValor.textContent = "";
  errorGarantia.textContent = "";
  errorTerminoGarantia.textContent = "";

  let hayErrores = false;

  if (!tipo_equipo) {
    errorTipoEquipo.textContent = "*El tipo de equipo es obligatorio";
    hayErrores = true;
  }

  if (!id_modelo) {
    errorModelo.textContent = "*Seleccione un modelo";
    hayErrores = true;
  }

  if (!serie) {
    errorSerie.textContent = "*La serie es obligatoria";
    hayErrores = true;
  }

  if (!procesador) {
    errorProcesador.textContent = "*El procesador es obligatorio";
    hayErrores = true;
  }

  if (!ram) {
    errorRam.textContent = "*La RAM es obligatoria";
    hayErrores = true;
  }

  if (!disco) {
    errorDisco.textContent = "*El disco es obligatorio";
    hayErrores = true;
  }

  if (!id_sistema_operativo) {
    errorSistema.textContent = "*Seleccione un sistema operativo";
    hayErrores = true;
  }

  if (!id_estado) {
    errorEstado.textContent = "*Seleccione un estado";
    hayErrores = true;
  }

  if (!factura) {
    errorFactura.textContent = "*La factura es obligatoria";
    hayErrores = true;
  }

  if (!id_proveedor) {
    errorProveedor.textContent = "*Seleccione un proveedor";
    hayErrores = true;
  }

  if (!fecha_entrega_proveedor) {
    errorEntrega.textContent = "*Seleccione una fecha";
    hayErrores = true;
  }

  if (!valor || Number(valor) <= 0) {
    errorValor.textContent = "*Ingrese un valor válido";
    hayErrores = true;
  }

  if (!garantia) {
    errorGarantia.textContent = "*La garantía es obligatoria";
    hayErrores = true;
  }

  if (!termino_garantia) {
    errorTerminoGarantia.textContent = "*Seleccione término de garantía";
    hayErrores = true;
  }

  if (hayErrores) return;

  const equipo = {
    tipo_equipo,
    id_modelo,
    serie,
    procesador,
    ram,
    disco,
    id_sistema_operativo,
    id_estado,
    factura,
    id_proveedor,
    fecha_entrega_proveedor,
    valor,
    garantia,
    termino_garantia,
    comentario,
  };

  try {
    const res = await fetch(id ? `/api/equipos/${id}` : "/api/equipos", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipo),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al guardar equipo");
    }

    alert(id ? "Equipo actualizado con éxito" : "Equipo creado con éxito");

    window.location.href = "/views/equipos/equipo.html";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
