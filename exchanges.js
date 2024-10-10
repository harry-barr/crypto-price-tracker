const exchangeBtn = document.querySelector("#exchanges");
const mainSection = document.querySelector(".main-section");
const exchangeSection = document.querySelector(
  ".cryptocurrency-exchanges-section"
);

let mainContentIsShowing = false; // Initialize as false

exchangeBtn.addEventListener("click", toggleExchange);

function toggleExchange() {
  if (mainContentIsShowing) {
    mainSection.style.display = "none"; // Clear the content
    exchangeSection.style.display = "";
    mainContentIsShowing = false; // Toggle the flag
  } else {
    mainSection.style.display = "";
    exchangeSection.style.display = "none";
    mainContentIsShowing = true; // Toggle the flag
  }
}
