const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
let index = 0;

function moveCarousel() {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

function autoSlide() {
  index = (index + 1) % slides.length;
  moveCarousel();
}

window.addEventListener('resize', moveCarousel);
moveCarousel();

setInterval(autoSlide, 3000); // Cambia cada 3 segundos
