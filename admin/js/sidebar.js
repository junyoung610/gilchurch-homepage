const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".submenu a, .menu-group > a").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");

    const group = link.closest(".menu-group");

    if (group) {
      group.classList.add("active");
    }
  }
});

const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

const savedState = localStorage.getItem("sidebar");

if (savedState === "collapsed") {
  sidebar?.classList.add("collapsed");
}

toggleBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");

  localStorage.setItem("sidebar", sidebar.classList.contains("collapsed") ? "collapsed" : "open");
});

document.querySelectorAll(".menu-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const group = toggle.parentElement;

    document.querySelectorAll(".menu-group").forEach((item) => {
      if (item !== group) {
        item.classList.remove("active");
      }
    });

    group.classList.toggle("active");
  });
});
