// Funcionalidade para fechar o modal com a tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        
        if (window.location.hash.includes('modal-programacao')) {
            window.location.hash = '#close';
        }
    }
});


const modalOverlay = document.getElementById('modal-programacao');
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        window.location.hash = '#close';
    }
});
