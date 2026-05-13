document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("tryon-modal");
    const btnOpen = document.getElementById("btn-open-tryon");
    const spanClose = document.getElementsByClassName("tryon-close")[0];

    btnOpen.onclick = function() {
        modal.style.display = "block";
    }

    spanClose.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const heightSlider = document.getElementById("height-slider");
    const weightSlider = document.getElementById("weight-slider");
    const heightVal = document.getElementById("height-val");
    const weightVal = document.getElementById("weight-val");

    heightSlider.oninput = function() {
        heightVal.innerHTML = this.value + " cm";
    }

    weightSlider.oninput = function() {
        weightVal.innerHTML = this.value + " kg";
    }
});
