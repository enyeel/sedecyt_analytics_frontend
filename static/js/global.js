/**
 * global.js
 * Funcionalidad común (sidebar, acordeón)
 */

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

// Lógica del Acordeón para la barra lateral
// Usamos window.onload para asegurar que los elementos existan
window.onload = function() {
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            // Toggle de la propiedad CSS 'display' para mostrar/ocultar
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}