/* ==========================================================================
   LÓGICA DA PÁGINA DE AULAS, MODAL DE SLIDES E PDF.JS (MOZILLA)
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
        slides: ["latex/aula0/1.jpg"],
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
let mostrandoPdf = false;
let pdfCarregadoAtual = null; 

// Torna a função acessível globalmente para os cliques do HTML
window.abrirApresentacao = function(id) {
    const slideImage = document.getElementById('slideImage');
    const pdfContainer = document.getElementById('pdfViewerContainer');
    const slideModal = document.getElementById('slideModal');
    
    // Trava de segurança para não quebrar o código se o HTML estiver desatualizado
    if (!slideImage || !pdfContainer || !slideModal) {
        console.error("Erro: Elementos do modal não encontrados no HTML.");
        return;
    }

    currentSet = id;
    currentSlide = 0;
    mostrandoPdf = false;
    
    // Reseta visualização para modo imagem
    slideImage.style.display = 'block';
    pdfContainer.style.display = 'none';
    
    const presentationArea = document.getElementById('presentationArea');
    if (presentationArea) presentationArea.classList.remove('hide-arrows');
    
    const btnToggle = document.getElementById('btnTogglePdf');
    if(btnToggle) btnToggle.classList.remove('active');
    
    document.getElementById('modalTitle').innerText = courseData[id].title;
    document.getElementById('modalDesc').innerText = courseData[id].desc;

    // Lógica do botão Praticar
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
                break;
        }
    }
    
    atualizarImagem();
    
    slideModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
};

function atualizarImagem() {
    const img = document.getElementById('slideImage');
    if (!img) return;
    
    img.style.opacity = 0;
    resetarZoom();
    
    setTimeout(() => {
        img.src = courseData[currentSet].slides[currentSlide];
        img.style.opacity = 1;
    }, 200);
}

window.mudarSlide = function(n) {
    const total = courseData[currentSet].slides.length;
    currentSlide = (currentSlide + n + total) % total;
    atualizarImagem();
};

/* --- FUNÇÕES DE ZOOM --- */
window.alterarZoom = function(fator) {
    currentZoom += fator;
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 3) currentZoom = 3;
    aplicarZoom();
};

window.resetarZoom = function() {
    currentZoom = 1;
    aplicarZoom();
};

function aplicarZoom() {
    if (mostrandoPdf) {
        const canvases = document.querySelectorAll('.pdf-page-canvas');
        canvases.forEach(canvas => {
            canvas.style.width = `${100 * currentZoom}%`;
        });
    } else {
        const img = document.getElementById('slideImage');
        if (!img) return;
        img.style.transform = `scale(${currentZoom})`;
        if(currentZoom > 1) {
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
        } else {
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
        }
    }
}

/* --- FUNÇÃO PARA RENDERIZAR O PDF VIA PDF.JS --- */
async function carregarE_RenderizarPdf(url) {
    const container = document.getElementById('pdfViewerContainer');
    
    if (pdfCarregadoAtual === url) return; 
    
    container.innerHTML = '<div style="color: white; padding: 40px; text-align: center;">Convertendo PDF... (Isso garantirá o funcionamento no celular)</div>';
    
    try {
        const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (!pdfjsLib) throw new Error("A biblioteca PDF.js não foi carregada no HTML.");

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        container.innerHTML = ''; 
        
        // Loop pelas páginas desenhando os Canvas
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.classList.add('pdf-page-canvas');
            
            container.appendChild(canvas);
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            await page.render(renderContext).promise;
        }
        
        pdfCarregadoAtual = url;
        aplicarZoom(); 
    } catch (error) {
        console.error("Erro ao renderizar PDF:", error);
        container.innerHTML = '<div style="color: #ff5e5e; padding: 40px; text-align: center;">Erro ao processar o PDF. Verifique se o caminho do arquivo está correto.</div>';
    }
}

window.togglePdfView = function() {
    const img = document.getElementById('slideImage');
    const pdfContainer = document.getElementById('pdfViewerContainer');
    const btnToggle = document.getElementById('btnTogglePdf');
    const modalBody = document.getElementById('presentationArea');
    const currentData = courseData[currentSet];
    
    mostrandoPdf = !mostrandoPdf;
    resetarZoom();
    
    if (mostrandoPdf) {
        img.style.display = 'none';
        pdfContainer.style.display = 'block';
        btnToggle.classList.add('active');
        if (modalBody) modalBody.classList.add('hide-arrows'); 
        
        carregarE_RenderizarPdf(currentData.pdfFile);
    } else {
        img.style.display = 'block';
        pdfContainer.style.display = 'none';
        btnToggle.classList.remove('active');
        if (modalBody) modalBody.classList.remove('hide-arrows');
    }
};

/* --- CONTROLES DA TELA E MODAL --- */
window.toggleFullScreen = function() {
    const el = document.getElementById('presentationArea');
    if (!el) return;
    if (!document.fullscreenElement) {
        if(el.requestFullscreen) el.requestFullscreen();
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
    }
};

window.fecharApresentacao = function() {
    const modal = document.getElementById('slideModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
    if (document.fullscreenElement) document.exitFullscreen();
};

// Eventos de Fechamento
document.getElementById('slideModal')?.addEventListener('click', function(event) {
    if (event.target === this) fecharApresentacao();
});

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('slideModal');
    if (modal && modal.classList.contains('active')) {
        if (event.key === "Escape") fecharApresentacao();
        else if (event.key === "ArrowRight" && !mostrandoPdf) mudarSlide(1);
        else if (event.key === "ArrowLeft" && !mostrandoPdf) mudarSlide(-1);
    }
});

/* ==========================================================================
   ANIMAÇÃO DE PARTÍCULAS
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
        constructor() { this.reset(); this.y = Math.random() * height; }
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
        for (let i = 0; i < maxParticles; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
});