const faUser = document.querySelector(".fa-user");
const dropdownMenu = document.querySelector(".dropdown-menu");

faUser.addEventListener("mouseenter", () => {
  faUser.style.color = "#6658d3";
});
faUser.addEventListener("mouseleave", () => {
  faUser.style.color = "#1a1a1a";
});

dropdownMenu.addEventListener("mouseenter", () => {
  faUser.style.color = "#6658d3";
});
dropdownMenu.addEventListener("mouseleave", () => {
  faUser.style.color = "#1a1a1a";
});
