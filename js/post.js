document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. SLIDER DE IMAGENS
       ========================================= */
    const wrapper = document.getElementById('slider-wrapper');
    const images = document.querySelectorAll('.main-project-img');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (wrapper && images.length > 0) {
        let currentIndex = 0;
        const totalImages = images.length;

        function updateSlider() {
            // Move o wrapper
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Atualiza os dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalImages;
                updateSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateSlider();
            });
        }

        // Navegação pelos dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
    }

    /* =========================================
       2. MENU MOBILE (Navbar)
       ========================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            
            // Troca ícone (Hamburguer <-> X)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navbarMenu.classList.contains('active')) {
                    icon.classList.remove('bi-list');
                    icon.classList.add('bi-x-lg');
                } else {
                    icon.classList.remove('bi-x-lg');
                    icon.classList.add('bi-list');
                }
            }
        });
    }
});

/* =========================================
   3. FUNÇÃO DE MODO LEITURA (GLOBAL)
   ========================================= */
function setReadingMode(mode) {
    const content = document.getElementById('post-content');
    const btnDefault = document.getElementById('btn-default');
    const btnLight = document.getElementById('btn-light');

    if (!content || !btnDefault || !btnLight) return;

    if (mode === 'light') {
        // Ativa Modo Gelo
        content.classList.add('ice-theme');
        
        // Atualiza Botões
        btnDefault.classList.remove('active');
        btnLight.classList.add('active');
    } else {
        // Volta ao Padrão
        content.classList.remove('ice-theme');
        
        // Atualiza Botões
        btnLight.classList.remove('active');
        btnDefault.classList.add('active');
    }
}