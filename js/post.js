document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('slider-wrapper');
    const images = document.querySelectorAll('.main-project-img');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    const totalImages = images.length;

    function updateSlider() {
        // Move o wrapper horizontalmente baseado no índice atual
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os pontinhos (dots)
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages; // Volta ao início no fim
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Vai ao fim se voltar do início
        updateSlider();
    });

    // Permite clicar nos pontinhos para navegar
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // Reutilizando sua lógica de Menu Mobile existente
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('bi-list');
            icon.classList.toggle('bi-x-lg');
        });
    }
});