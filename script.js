document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".year")) {
    const year = document.createElement("span");
    year.className = "year";
    year.textContent = new Date().getFullYear();
    footer.appendChild(year);
  }
});
