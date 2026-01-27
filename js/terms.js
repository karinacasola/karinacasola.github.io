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

        // Fechar menu ao clicar em links
        const navLinks = navbarMenu.querySelectorAll('.navbar-link, .navbar-button');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('bi-x-lg', 'bi-list');
            });
        });
    }

    // Adiciona uma classe de "scrolled" na navbar para efeitos visuais extras
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });
});