/* ==========================================================================
   LÓGICA DA PÁGINA DE AULAS E MODAL DE SLIDES (ATUALIZADO PARA PDF E LINKS)
   ========================================================================== */

const courseData = {
    0: {
        title: "PoC Integrada - Indústria 4.0",
        desc: "Estruturando fluxos desde a coleta em sensores até a inferência por IA.",
        slides: [
            "latex/aula0/1.jpg", 
            "latex/aula0/2.jpg",
            "latex/aula0/3.jpg",
            "latex/aula0/4.jpg"
        ],
        pdfFile: "latex/aula0/IoT_geral.pdf"
    },
    1: {
        title: "Etapa 1: Arquitetura",
        desc: "Compreendendo a pilha tecnológica de 5 camadas e integração do pipeline.",
        slides: [
            "latex/aula0/1.jpg" 
            
        ],
        pdfFile: "latex/aula0/IoT_.pdf"
    },
    2: {
        title: "Etapa 2: Configuração",
        desc: "Preparando Hardware (Arduino) e Software para integração Python via Firmware Firmata.",
        slides: ["latex/aula0/1.jpg"],
        pdfFile: "latex/aula0/IoT2_.pdf"
    },
    3: {
        title: "Etapa 3: Inteligência",
        desc: "Uso do Scikit-Learn e do algoritmo Isolation Forest para detectar anomalias.",
        slides: ["latex/aula0/1.jpg"],
        pdfFile: "latex/aula0/IoT3.pdf"
    }
};

let currentSet = 0;
let currentSlide = 0;
let currentZoom = 1;
let mostrandoPdf = false; // Controle de exibição (Imagem x PDF)

function abrirApresentacao(id) {
    currentSet = id;
    currentSlide = 0;
    
    // Reseta visualização para mostrar a capa sempre que abrir
    mostrandoPdf = false;
    document.getElementById('slideImage').style.display = 'block';
    document.getElementById('pdfViewer').style.display = 'none';
    document.getElementById('presentationArea').classList.remove('hide-arrows');
    
    const btnToggle = document.getElementById('btnTogglePdf');
    if(btnToggle) btnToggle.classList.remove('active');
    
    // Limpa o iframe para não misturar PDFs ou consumir memória
    document.getElementById('pdfViewer').src = "";
    
    document.getElementById('modalTitle').innerText = courseData[id].title;
    document.getElementById('modalDesc').innerText = courseData[id].desc;

    // ----- LÓGICA DE ATUALIZAÇÃO DO LINK "PRATICAR AGORA" -----
    const btnPraticar = document.getElementById('btn-praticar');
    if (btnPraticar) {
        switch(id) {
            case 1:
                btnPraticar.href = 'iot-industria.html';
                btnPraticar.style.display = 'inline-block';
                break;
            case 2:
                btnPraticar.href = 'pyfirmata2.html';
                btnPraticar.style.display = 'inline-block';
                break;
            case 3:
                btnPraticar.href = 'industria-quizz.html';
                btnPraticar.style.display = 'inline-block';
                break;
            case 0:
            default:
                btnPraticar.href = '#'; 
                // btnPraticar.style.display = 'none'; // Descomente esta linha se não quiser botão na capa geral
                break;
        }
    }
    // -----------------------------------------------------------
    
    atualizarImagem();
    
    document.getElementById('slideModal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Trava o scroll da página ao fundo
}

function atualizarImagem() {
    const img = document.getElementById('slideImage');
    img.style.opacity = 0;
    
    resetarZoom();
    
    setTimeout(() => {
        img.src = courseData[currentSet].slides[currentSlide];
        img.style.opacity = 1;
    }, 200);
}

function mudarSlide(n) {
    const total = courseData[currentSet].slides.length;
    currentSlide = (currentSlide + n + total) % total;
    atualizarImagem();
}

/* --- FUNÇÕES DE ZOOM --- */
function alterarZoom(fator) {
    currentZoom += fator;
    
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 3) currentZoom = 3;
    
    aplicarZoom();
}

function resetarZoom() {
    currentZoom = 1;
    aplicarZoom();
}

function aplicarZoom() {
    const img = document.getElementById('slideImage');
    img.style.transform = `scale(${currentZoom})`;
    
    if(currentZoom > 1) {
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
    } else {
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
    }
}

/* --- FUNÇÃO PARA ALTERNAR CAPA / PDF --- */
function togglePdfView() {
    const img = document.getElementById('slideImage');
    const pdfViewer = document.getElementById('pdfViewer');
    const btnToggle = document.getElementById('btnTogglePdf');
    const modalBody = document.getElementById('presentationArea');
    const currentData = courseData[currentSet];
    
    mostrandoPdf = !mostrandoPdf;
    
    if (mostrandoPdf) {
        // Mostra o PDF
        img.style.display = 'none';
        pdfViewer.style.display = 'block';
        btnToggle.classList.add('active');
        modalBody.classList.add('hide-arrows'); // Esconde setas do slider de imagem
        
        // Carrega o PDF apenas na primeira vez, otimizando o carregamento
        if (pdfViewer.getAttribute('src') !== currentData.pdfFile + "#view=FitH") {
            pdfViewer.src = currentData.pdfFile + "#view=FitH"; 
        }
    } else {
        // Mostra a Capa (Imagem)
        img.style.display = 'block';
        pdfViewer.style.display = 'none';
        btnToggle.classList.remove('active');
        modalBody.classList.remove('hide-arrows');
    }
}

/* --- CONTROLE DE TELA CHEIA E FECHAR --- */
function toggleFullScreen() {
    const el = document.getElementById('presentationArea');
    if (!document.fullscreenElement) {
        if(el.requestFullscreen) el.requestFullscreen();
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
    }
}

function fecharApresentacao() {
    document.getElementById('slideModal').classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaura o scroll
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

// Fechar modal ao clicar no fundo escuro
document.getElementById('slideModal').addEventListener('click', function(event) {
    if (event.target === this) {
        fecharApresentacao();
    }
});

// Suporte a teclado
document.addEventListener('keydown', function(event) {
    if (document.getElementById('slideModal').classList.contains('active')) {
        if (event.key === "Escape") fecharApresentacao();
        else if (event.key === "ArrowRight" && !mostrandoPdf) mudarSlide(1);
        else if (event.key === "ArrowLeft" && !mostrandoPdf) mudarSlide(-1);
    }
});

/* ==========================================================================
   ANIMAÇÃO DE PARTÍCULAS (BOLAS DE LUZ TEMA TECH AZUL)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; 
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.8 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.drift = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y -= this.speedY;
            this.drift += 0.02;
            this.x += Math.sin(this.drift) * 0.4 + this.speedX;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
                this.y = height + 10;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(62, 142, 255, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(62, 142, 255, 0.8)';
            ctx.fill();
            ctx.shadowBlur = 0; 
        }
    }

    function initParticles() {
        particles = [];
        const maxParticles = width < 768 ? 20 : 45; 
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
});