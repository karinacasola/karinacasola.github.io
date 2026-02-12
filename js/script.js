document.addEventListener('DOMContentLoaded', function() {
    const selectTyped = document.querySelector('.typed');
    
    if (selectTyped) {
        // Verifica se já existe um cursor para não duplicar
        const existingCursor = document.querySelector('.typed-cursor');
        if (existingCursor) {
            existingCursor.remove();
        }

        let typed_strings = selectTyped.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',');

        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000,
            showCursor: False,
            
        });
    }
});

/* ==========================================================================
   LÓGICA DO MENU MOBILE (NAVBAR)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão e o menu pelos IDs que foram definidos no HTML
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    // Verifica se os elementos existem para evitar erros no console
    if (menuToggle && navbarMenu) {
        
        // 1. Abre/Fecha o menu ao clicar no botão hambúrguer
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            
            // Troca o ícone (Lista vs. X) para dar feedback visual
            const icon = menuToggle.querySelector('i');
            if (navbarMenu.classList.contains('active')) {
                icon.classList.replace('bi-list', 'bi-x-lg');
            } else {
                icon.classList.replace('bi-x-lg', 'bi-list');
            }
        });

        // 2. Fecha o menu automaticamente ao clicar em qualquer link
        // Isso é essencial para que o menu não cubra o conteúdo após o clique
        const links = navbarMenu.querySelectorAll('.navbar-link, .navbar-button');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('bi-x-lg', 'bi-list');
            });
        });
    }
});


(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

function setModalTheme(theme) {
    // Procura o container de texto do modal (pai dos botões)
    const textContainer = document.querySelector('.modal-col-text');
    const btnDark = document.getElementById('modal-btn-dark');
    const btnLight = document.getElementById('modal-btn-light');

    if (!textContainer) return;

    if (theme === 'light') {
        // Ativa o tema claro
        textContainer.classList.add('ice-theme');
        
        // Troca o estado dos botões
        if(btnDark) btnDark.classList.remove('active');
        if(btnLight) btnLight.classList.add('active');
        
    } else {
        // Volta para o tema escuro (padrão)
        textContainer.classList.remove('ice-theme');
        
        // Troca o estado dos botões
        if(btnLight) btnLight.classList.remove('active');
        if(btnDark) btnDark.classList.add('active');
    }
}


function changeReflection(index, imagePath) {
    // 1. Troca a imagem da esquerda com efeito fade
    const imgElement = document.getElementById('main-modal-img');
    imgElement.style.opacity = '0';
    
    setTimeout(() => {
        imgElement.src = imagePath;
        imgElement.style.opacity = '1';
    }, 300);

    // 2. Atualiza o número do cabeçalho (ex: 01, 02)
    const headerNum = document.getElementById('current-reflection-num');
    if(headerNum) headerNum.innerText = index.toString().padStart(2, '0');

    // 3. Alterna a visibilidade dos blocos de texto
    document.querySelectorAll('.reflection-block').forEach(block => {
        block.classList.remove('active');
    });
    const targetBlock = document.getElementById('ref-' + index);
    if(targetBlock) targetBlock.classList.add('active');

    // 4. Atualiza visualmente o botão do seletor
    document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
        if (idx + 1 === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // 5. Reseta o scroll lateral para o topo para nova leitura
    const textCol = document.querySelector('.modal-col-text');
    if(textCol) textCol.scrollTop = 0;
}

/* ==========================================================================
   LÓGICA DE REFLEXÕES (CONTADOR E NAVEGAÇÃO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. CONTADOR AUTOMÁTICO NO CARD ---
    // Busca todos os blocos de reflexão que existem no modal
    const reflexoes = document.querySelectorAll('.reflection-block');
    const contadorElemento = document.getElementById('total-reflections-count');
    
    if (contadorElemento && reflexoes.length > 0) {
        // Atualiza o texto do card com o total encontrado (ex: 02, 05)
        contadorElemento.innerText = reflexoes.length.toString().padStart(2, '0');
    }

    // --- 2. RESET DE SCROLL AO FECHAR ---
    // Garante que se o usuário fechar o modal, ao abrir de novo ele comece do topo
    const modalLinks = document.querySelectorAll('a[href="#modal-programacao"]');
    modalLinks.forEach(link => {
        link.addEventListener('click', () => {
            const textCol = document.querySelector('.modal-col-text');
            if (textCol) textCol.scrollTop = 0;
        });
    });
});

/**
 * Função Global para trocar a reflexão dentro do modal
 * Precisa estar fora do DOMContentLoaded para ser acessível pelo 'onclick' do HTML
 */

function atualizarContadorReflexoes() {
    // 1. Busca todos os blocos que existem no modal
    const blocos = document.querySelectorAll('.reflection-block');
    const displayContador = document.getElementById('total-reflections-count');
    
    // Log para te ajudar a depurar (aparece no F12 do navegador)
    console.log("Total de blocos encontrados:", blocos.length);

    if (displayContador) {
        if (blocos.length > 0) {
            displayContador.innerText = blocos.length.toString().padStart(2, '0');
        } else {
            console.warn("Nenhum bloco com a classe .reflection-block foi encontrado.");
        }
    } else {
        console.error("Não foi encontrado nenhum elemento com o ID 'total-reflections-count'.");
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorReflexoes();
    
    // Aproveite para garantir que os links do menu mobile funcionem aqui também
    // se houver necessidade de reinicializar outras funções.
});

/* A função de troca deve ficar fora para ser global */
function changeReflection(index, imagePath) {
    const imgElement = document.getElementById('main-modal-img');
    if (imgElement) {
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.src = imagePath;
            imgElement.style.opacity = '1';
        }, 200);
    }

    document.getElementById('current-reflection-num').innerText = index.toString().padStart(2, '0');

    document.querySelectorAll('.reflection-block').forEach(block => {
        block.classList.remove('active');
    });
    
    const target = document.getElementById('ref-' + index);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', (idx + 1) === index);
    });

    const textCol = document.querySelector('.modal-col-text');
    if (textCol) textCol.scrollTop = 0;
}



