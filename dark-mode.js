const body = document.querySelector("body");
const darkmodeBtn = document.querySelector(".dark-mode-btn");
const icon = document.querySelector(".fa-moon");

darkmodeBtn.addEventListener("click", () => {
  if (icon.classList.contains("fa-moon")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
  body.classList.toggle("dark-mode");
});
