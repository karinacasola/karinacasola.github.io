/* ==========================================================================
   LÓGICA DE ALTERNÂNCIA DE TEMA MINIMALISTA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (!themeToggleBtn) return;

    // 1. Verifica a preferência salva
    const savedTheme = localStorage.getItem('site-theme');
    
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light-mode');
    } else {
        htmlElement.classList.remove('light-mode');
        htmlElement.classList.add('dark');
    }

    // 2. Escuta o clique
    themeToggleBtn.addEventListener('click', () => {
        const isLightModeActive = htmlElement.classList.contains('light-mode');
        
        if (isLightModeActive) {
            // Liga o modo escuro
            htmlElement.classList.remove('light-mode');
            htmlElement.classList.add('dark');
            localStorage.setItem('site-theme', 'dark');
        } else {
            // Liga o modo claro
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light-mode');
            localStorage.setItem('site-theme', 'light');
        }
    });
});