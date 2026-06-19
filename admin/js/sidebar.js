const currentPage = location.pathname.split("/").pop();

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
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
