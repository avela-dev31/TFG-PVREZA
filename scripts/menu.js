  const menu = document.querySelector('.side-menu');
  const openBtn = document.querySelector('.menu-button');
  const closeBtn = document.querySelector('.close-button');

  openBtn.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.classList.add('menu-open');
  });

  closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });