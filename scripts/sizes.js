document.addEventListener("DOMContentLoaded", function () {
    const sizeButtons = document.querySelectorAll(".size-btn");

    sizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            sizeButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
        });
    });
});
