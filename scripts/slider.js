function nextSlide(btn) {
    const container = btn.closest('.slider').querySelector('.slides-container');
    const slides = container.querySelectorAll('.slide');
    let currentIndex = parseInt(container.dataset.index || '0');
    currentIndex = (currentIndex + 1) % slides.length;
    container.dataset.index = currentIndex;
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function prevSlide(btn) {
    const container = btn.closest('.slider').querySelector('.slides-container');
    const slides = container.querySelectorAll('.slide');
    let currentIndex = parseInt(container.dataset.index || '0');
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    container.dataset.index = currentIndex;
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
}
