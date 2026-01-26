/**
 * cookies.js - Versão Integrada (GTM + GA4)
 * Contexto: Consent Mode v2
 */

// 1. Definição Global (Configuração de base)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

if (!localStorage.getItem('cookies-pref')) {
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.cookies-container');
    const saveBtn = document.querySelector('.cookies-save');
    const checkboxes = document.querySelectorAll('.cookies-pref input[data-function]');

    if (!container || !saveBtn) return;

    const savedPrefs = JSON.parse(localStorage.getItem('cookies-pref'));

    if (savedPrefs) {
        container.style.display = 'none';
        applyConsent(savedPrefs);
    } else {
        container.style.display = 'flex';
    }

    saveBtn.addEventListener('click', function() {
        const choices = Array.from(checkboxes)
            .filter(input => input.checked)
            .map(input => input.getAttribute('data-function'));

        localStorage.setItem('cookies-pref', JSON.stringify(choices));
        applyConsent(choices);
        container.style.display = 'none';
    });

    function applyConsent(prefs) {
        const hasAnalytics = prefs.includes('analytics');
        const hasMarketing = prefs.includes('marketing');

        gtag('consent', 'update', {
            'analytics_storage': hasAnalytics ? 'granted' : 'denied',
            'ad_storage': hasMarketing ? 'granted' : 'denied',
            'ad_user_data': hasMarketing ? 'granted' : 'denied',
            'ad_personalization': hasMarketing ? 'granted' : 'denied'
        });

        // Só inicializa os scripts se houver permissão de Analytics ou Marketing
        if (hasAnalytics || hasMarketing) {
            initGoogleScripts();
        }
    }

    /**
     * Inicializa GTM e Google Analytics simultaneamente
     */
    function initGoogleScripts() {
        if (window.googleScriptsLoaded) return;
        window.googleScriptsLoaded = true;

        // --- CARGA DO GOOGLE ANALYTICS (GA4) ---
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-GSR7WHHMPV";
        document.head.appendChild(gaScript);

        gtag('js', new Date());
        gtag('config', 'G-GSR7WHHMPV');

        // --- CARGA DO GOOGLE TAG MANAGER (GTM) ---
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PQ9QX9CM');
    }
});