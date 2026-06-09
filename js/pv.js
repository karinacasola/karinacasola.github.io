// 1. Bloquear o clique direito (Menu de Contexto / Inspecionar)
  document.addEventListener('contextmenu', event => event.preventDefault());

  // 2. Bloquear atalhos comuns do DevTools
  document.addEventListener('keydown', event => {
    // F12
    if (event.key === 'F12') {
      event.preventDefault();
    }
    // Ctrl+Shift+I (Windows/Linux) ou Cmd+Option+I (Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'i') {
      event.preventDefault();
    }
    // Ctrl+Shift+J (Console)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'j') {
      event.preventDefault();
    }
    // Ctrl+U (Ver Código Fonte)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'u') {
      event.preventDefault();
    }
  });