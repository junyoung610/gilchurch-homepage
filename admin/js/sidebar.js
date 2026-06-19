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

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  // 저장된 상태 불러오기
  const savedState = localStorage.getItem("sidebar");

  if (savedState === "collapsed") {
    sidebar.classList.add("collapsed");
  }

  // 접기 버튼
  toggleBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    localStorage.setItem("sidebar", sidebar.classList.contains("collapsed") ? "collapsed" : "open");
  });

  // 아코디언 메뉴
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
});
