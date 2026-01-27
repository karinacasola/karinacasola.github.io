document.addEventListener('DOMContentLoaded', () => {
    /* Lógica do Menu Mobile */
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navbarMenu.classList.contains('active')) {
                icon.classList.replace('bi-list', 'bi-x-lg');
            } else {
                icon.classList.replace('bi-x-lg', 'bi-list');
            }
        });
    }

    /* Interação com o Banner de Cookies */
    const cookieBtn = document.getElementById('open-cookie-banner');
    
    if (cookieBtn) {
        cookieBtn.addEventListener('click', () => {
            // Seleciona o container de cookies que você já tem no index.html
            const banner = document.querySelector('.cookies-container');
            if (banner) {
                banner.style.display = 'flex';
                banner.style.opacity = '1';
                banner.style.visibility = 'visible';
            } else {
                alert("Para gerir as suas preferências, utilize as definições do seu navegador ou regresse à página inicial.");
            }
        });
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});