document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. SLIDER DE IMAGENS
       ========================================= */
    const wrapper = document.getElementById('slider-wrapper');
    const images = document.querySelectorAll('.main-project-img');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (wrapper && images.length > 0) {
        let currentIndex = 0;
        const totalImages = images.length;

        function updateSlider() {
            // Move o wrapper
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Atualiza os dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalImages;
                updateSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateSlider();
            });
        }

        // Navegação pelos dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
    }

    /* =========================================
       2. MENU MOBILE (Navbar)
       ========================================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            
            // Troca ícone (Hamburguer <-> X)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navbarMenu.classList.contains('active')) {
                    icon.classList.remove('bi-list');
                    icon.classList.add('bi-x-lg');
                } else {
                    icon.classList.remove('bi-x-lg');
                    icon.classList.add('bi-list');
                }
            }
        });
    }
});

/* =========================================
   3. FUNÇÃO DE MODO LEITURA (GLOBAL)
   ========================================= */
function setReadingMode(mode) {
    const content = document.getElementById('post-content');
    const btnDefault = document.getElementById('btn-default');
    const btnLight = document.getElementById('btn-light');

    if (!content || !btnDefault || !btnLight) return;

    if (mode === 'light') {
        // Ativa Modo Gelo
        content.classList.add('ice-theme');
        
        // Atualiza Botões
        btnDefault.classList.remove('active');
        btnLight.classList.add('active');
    } else {
        // Volta ao Padrão
        content.classList.remove('ice-theme');
        
        // Atualiza Botões
        btnLight.classList.remove('active');
        btnDefault.classList.add('active');
    }
}
//Mapa mental
document.addEventListener('DOMContentLoaded', () => {
    const mindmapContainers = document.querySelectorAll('.mindmap-app');
    if (mindmapContainers.length === 0 || typeof Vue === 'undefined') return;

    const { createApp } = Vue;

    // Componente Recursivo do Mapa Mental
    const MindMapNode = {
        name: 'mind-map-node',
        props: {
            node: Object,
            isRoot: {
                type: Boolean,
                default: false
            }
        },
        template: `
            <div class="mm-container" :class="{ 'is-root': isRoot, 'has-children': node.children && node.children.length && isOpen }">
                <div class="mm-node-wrapper">
                    <div class="mm-node" @click="toggle">
                        {{ node.label }}
                    </div>
                </div>
                <transition name="fade">
                    <div class="mm-children" v-if="isOpen && node.children && node.children.length">
                        <mind-map-node 
                            v-for="(child, index) in node.children" 
                            :key="index" 
                            :node="child"
                            :isRoot="false">
                        </mind-map-node>
                    </div>
                </transition>
            </div>
        `,
        data() {
            return {
                isOpen: true
            };
        },
        methods: {
            toggle() {
                if (this.node.children && this.node.children.length) {
                    this.isOpen = !this.isOpen;
                }
            }
        }
    };

    // Inicializa um mapa independente para cada .mindmap-app encontrado na página
    mindmapContainers.forEach((container) => {
        const dataScript = container.querySelector('.mindmap-data');
        if (!dataScript) return;

        let parsedData;
        try {
            parsedData = JSON.parse(dataScript.textContent);
        } catch (err) {
            console.error('Erro no JSON do Mapa Mental:', err);
            return;
        }

        const app = createApp({
            components: {
                'mind-map-node': MindMapNode
            },
            data() {
                return {
                    treeData: parsedData
                };
            },
            methods: {
                toggleFullscreen() {
                    const el = this.$refs.mindmapWrapper;
                    if (!document.fullscreenElement) {
                        el.requestFullscreen().catch(err => {
                            console.warn(`Erro ao tentar ativar tela cheia: ${err.message}`);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                }
            },
            template: `
                <div class="mindmap-wrapper" ref="mindmapWrapper">
                    <button class="btn-fullscreen" @click="toggleFullscreen" title="Tela Cheia">
                        <i class="bi bi-arrows-fullscreen"></i>
                    </button>
                    <div class="mindmap-inner">
                        <mind-map-node :node="treeData" :is-root="true"></mind-map-node>
                    </div>
                </div>
            `
        });

        app.mount(container);
    });
});

/* =========================================
   3. FUNÇÃO DE MODO LEITURA (GLOBAL)
   ========================================= */
function setReadingMode(mode) {
    const content = document.getElementById('post-content');
    const sidebar = document.getElementById('sidebar-toc'); // Nova variável
    const btnDefault = document.getElementById('btn-default');
    const btnLight = document.getElementById('btn-light');

    if (!content || !btnDefault || !btnLight) return;

    if (mode === 'light') {
        // Ativa Modo Gelo no texto e na barra lateral
        content.classList.add('ice-theme');
        if(sidebar) sidebar.classList.add('ice-theme'); 
        
        // Atualiza Botões
        btnDefault.classList.remove('active');
        btnLight.classList.add('active');
    } else {
        // Volta ao Padrão no texto e na barra lateral
        content.classList.remove('ice-theme');
        if(sidebar) sidebar.classList.remove('ice-theme');
        
        // Atualiza Botões
        btnLight.classList.remove('active');
        btnDefault.classList.add('active');
    }
}