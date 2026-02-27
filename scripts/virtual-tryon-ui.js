document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const modal = document.getElementById("tryon-modal");
    const btnOpen = document.getElementById("btn-open-tryon");
    const spanClose = document.getElementsByClassName("tryon-close")[0];
    const canvasContainer = document.getElementById("avatar-canvas-container");

    // 1. Abrir el modal
    btnOpen.onclick = function() {
        modal.style.display = "block";
        console.log("Iniciando entorno 3D...");
    }

    // 2. Cerrar el modal con la X
    spanClose.onclick = function() {
        modal.style.display = "none";
    }

    // 3. Cerrar si clickas fuera del contenido
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // 4. Lógica básica de los sliders (visual)
    const heightSlider = document.getElementById("height-slider");
    const weightSlider = document.getElementById("weight-slider");
    const heightVal = document.getElementById("height-val");
    const weightVal = document.getElementById("weight-val");

    heightSlider.oninput = function() {
        heightVal.innerHTML = this.value + " cm";
        // Aquí actualizaríamos el morph target del avatar
    }

    weightSlider.oninput = function() {
        weightVal.innerHTML = this.value + " kg";
        // Aquí actualizaríamos el morph target del avatar
    }
});