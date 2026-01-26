/**
 * cookies.js - Versão para HTML Estático
 * Integração Karina Casola - Blog
 */

// 1. Definição Global do Google Tag (Consent Mode v2)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Estado inicial: Negado por padrão se não houver escolha salva
if (!localStorage.getItem('cookies-pref')) {
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Seletores baseados no seu HTML
    const container = document.querySelector('.cookies-container');
    const saveBtn = document.querySelector('.cookies-save');
    const checkboxes = document.querySelectorAll('.cookies-pref input[data-function]');

    if (!container || !saveBtn) {
        console.warn("Banner de cookies não encontrado nesta página.");
        return;
    }

    // 2. Verifica se o usuário já salvou preferências anteriormente
    const savedPrefs = JSON.parse(localStorage.getItem('cookies-pref'));

    if (savedPrefs) {
        // Se já salvou, esconde o banner e aplica as permissões
        container.style.display = 'none';
        applyConsent(savedPrefs);
    } else {
        // Se não salvou, garante que o banner esteja visível
        container.style.display = 'flex';
    }

    // 3. Método de Salvamento (O Coração da Lógica)
    saveBtn.addEventListener('click', function() {
        // Captura as opções marcadas no momento do clique
        const choices = Array.from(checkboxes)
            .filter(input => input.checked)
            .map(input => input.getAttribute('data-function'));

        // Salva a decisão no navegador
        localStorage.setItem('cookies-pref', JSON.stringify(choices));

        // Aplica o consentimento para o Google
        applyConsent(choices);

        // Esconde o banner com efeito visual (opcional)
        container.style.display = 'none';
        
        console.log("Consentimento atualizado:", choices);
    });

    /**
     * Atualiza o Google Consent Mode e inicia o GTM
     */
    function applyConsent(prefs) {
        const hasAnalytics = prefs.includes('analytics');
        const hasMarketing = prefs.includes('marketing');

        gtag('consent', 'update', {
            'analytics_storage': hasAnalytics ? 'granted' : 'denied',
            'ad_storage': hasMarketing ? 'granted' : 'denied',
            'ad_user_data': hasMarketing ? 'granted' : 'denied',
            'ad_personalization': hasMarketing ? 'granted' : 'denied'
        });

        // Carrega o Google Tag Manager se houver qualquer permissão
        if (hasAnalytics || hasMarketing) {
            initGTM();
        }
    }

    function initGTM() {
        if (window.gtmLoaded) return;
        window.gtmLoaded = true;

        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PQ9QX9CM');
    }
});