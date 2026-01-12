/* ==========================================================================

========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. INICIALIZAÇÃO DO TYPED.JS (EFEITO DE DIGITAÇÃO)
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
        let typed_strings = selectTyped.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',');
        
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000
        });
    }

    // 2. ACORDEÃO DA SEÇÃO DE PROFISSÕES
    const professionCards = document.querySelectorAll('.profession-card');

    professionCards.forEach(clickedCard => {
        clickedCard.addEventListener('click', () => {
            
            // Fecha todos os outros cards que não foram o clicado
            professionCards.forEach(otherCard => {
                if (otherCard !== clickedCard) {
                    otherCard.classList.remove('expand');
                }
            });

            // Alterna a classe expand no card clicado
            clickedCard.classList.toggle('expand');
        });
    });

});