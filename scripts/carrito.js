document.addEventListener("DOMContentLoaded", function () {
    const cartButton = document.querySelector('.cart-button-header');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');

    function openCart() {
        cartPanel.classList.add('open');
        cartOverlay.classList.add('active');
    }

    function closeCartPanel() {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('active');
    }

    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeCart.addEventListener('click', closeCartPanel);
    cartOverlay.addEventListener('click', closeCartPanel);
});