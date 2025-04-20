const menuGamburger = document.querySelector(".gamburger")
const sections = document.querySelector(".sections")

menuGamburger.addEventListener("click", () => {
    sections.classList.toggle("sections_active")
})



