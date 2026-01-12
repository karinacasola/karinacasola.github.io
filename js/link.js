/* link.js - Lógica Unificada para Página de Links */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. INICIALIZAÇÃO DO TYPED.JS (EFEITO DE DIGITAÇÃO)
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
        let typed_strings = selectTyped.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',').map(item => item.trim());

        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000
        });
    }


}); 