async function loadSidebar() {
  const container = document.getElementById("sidebar-container");

  const response = await fetch("./sidebar.html");

  const html = await response.text();

  container.innerHTML = html;

  // 사이드바 JS 다시 실행
  const script = document.createElement("script");
  script.src = "./js/sidebar.js";
  document.body.appendChild(script);
}

loadSidebar();
