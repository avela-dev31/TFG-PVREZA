function toggleSocial() {
  const links = document.getElementById('social-links');
  const icon = document.getElementById('toggle-icon');
  const isHidden = links.classList.contains('social-hidden');

  // Alternar visibilidad
  links.classList.toggle('social-hidden');

  // Cambiar símbolo del botón
  icon.textContent = isHidden ? '−' : '+';
}
