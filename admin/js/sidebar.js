const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".sidebar a").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");
  }
});

const toggleBtn = document.getElementById("toggleSidebar");

const sidebar = document.querySelector(".sidebar");

toggleBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

const savedState = localStorage.getItem("sidebar");

if (savedState === "collapsed") {
  sidebar.classList.add("collapsed");
}

toggleBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");

  localStorage.setItem("sidebar", sidebar.classList.contains("collapsed") ? "collapsed" : "open");
});

const toggles = document.querySelectorAll(".menu-toggle");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.parentElement.classList.toggle("active");
  });
});
