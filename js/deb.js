setInterval(function() {
    (function() {
      return false;
    }
    ['constructor']('debugger')
    ['call']());
  }, 50);


const devtools = { isOpen: false };
  const element = new Image();
  
  // Quando o DevTools abre, ele tenta renderizar o id do elemento, disparando o getter
  Object.defineProperty(element, 'id', {
    get: function() {
      devtools.isOpen = true;
      // Ação quando o DevTools for detectado:
      alert('Acesso não autorizado!');
      window.location.href = "about:blank"; // Redireciona para uma página em branco
    }
  });

  setInterval(function() {
    devtools.isOpen = false;
    console.log(element);
    console.clear(); // Limpa para o usuário não ver a imagem sendo impressa
  }, 1000);  