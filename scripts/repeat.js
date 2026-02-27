document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner-content");
    const original = banner.innerHTML; // Guarda el contenido original
    const repeatCount = 10; // Número de repeticiones

    // Repite el contenido X veces
    let repeatedContent = "";
    for (let i = 0; i < repeatCount; i++) {
        repeatedContent += original;
    }

    // Establece el contenido repetido en el banner
    banner.innerHTML = repeatedContent;
});

