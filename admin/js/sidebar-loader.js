async function loadSidebar() {
  const container = document.getElementById("sidebar-container");

  const response = await fetch("./sidebar.html");

  const html = await response.text();

  container.innerHTML = html;

  const script = document.createElement("script");
  script.src = "./js/sidebar.js";
  document.body.appendChild(script);
}

loadSidebar();
