const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".sidebar a").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");
  }
});
