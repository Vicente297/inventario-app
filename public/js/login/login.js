const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message);
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);

    if (data.rol === "admin") {
      window.location.href = "/views/equipos/equipo.html";
    } else {
      window.location.href = "/views/asignaciones/asignaciones.html";
    }
  } catch (error) {
    console.error(error);
    alert("Error login");
  }
});
