// Bloqueia o clique com o botão direito para evitar o "Inspecionar", 
// mas o utilizador ainda pode usar Ctrl+C para copiar texto selecionado.
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Intercepta atalhos de teclado específicos de desenvolvimento e salvamento
document.addEventListener('keydown', function(e) {
    // F12 (Ferramentas de Desenvolvedor)
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I ou Cmd+Option+I (Inspecionar)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J ou Cmd+Option+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U ou Cmd+U (Ver código-fonte)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }

    // Ctrl+S ou Cmd+S (Salvar página)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
    }

    // Ctrl+P ou Cmd+P (Imprimir página, que pode imprimir para PDF)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        return false;
    }
    
    
});