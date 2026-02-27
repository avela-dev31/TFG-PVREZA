 document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("carousel-track");
    const slides = track.querySelectorAll("img");
    const totalSlides = slides.length;

    let index = 0;

    function moveCarousel() {
      index = (index + 1) % totalSlides;
      track.style.transform = `translateX(-${index * 100}vw)`;
    }

    // Establece ancho dinámico del track
    track.style.width = `${totalSlides * 100}vw`;

    // Inicia el movimiento cada 4 segundos
    setInterval(moveCarousel, 4000);
  });