window.addEventListener('load', function () {
  const video = document.querySelector('video');
  const hero = document.querySelector('.hero');

  // Forzar reinicio del video al cargar
  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {
      console.log('Autoplay bloqueado en este navegador');
    });
  }

  // Fallback para móviles si el vídeo se congela
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    if (video) video.style.display = 'none';
    if (hero) hero.style.backgroundImage = "url('/ruta/imagen-fondo.jpg')";
  }
});
