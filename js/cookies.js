document.addEventListener('DOMContentLoaded', function() {

  fetch('cookies.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('content').innerHTML = data;
      })
      .catch(error => console.error('Erro ao carregar o fragmento HTML:', error));

  function cookies(functions) {
    const container = document.querySelector('.cookies-container');
    const save = document.querySelector('.cookies-save');
    if (!container || !save) return null;

    const localPref = JSON.parse(window.localStorage.getItem('cookies-pref'));
    if (localPref) activateFunctions(localPref);

    function getFormPref() {
      return [...document.querySelectorAll('[data-function]')]
          .filter((el) => el.checked)
          .map((el) => el.getAttribute('data-function'));
    }

    function activateFunctions(pref) {
      pref.forEach((f) => functions[f]());
      container.style.display = 'none';
      window.localStorage.setItem('cookies-pref', JSON.stringify(pref));
    }

    function handleSave() {
      const pref = getFormPref();
      activateFunctions(pref);
    }

    save.addEventListener('click', handleSave);
  }

  function loadGTM() {
  if (window.gtmLoaded) return; // evita carregar duas vezes
  window.gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PQ9QX9CM';
  document.head.appendChild(script);
}


  function marketing() {
    console.log('Função de marketing');
  }

  function analytics() {
    console.log('Função de analytics');
    loadGTM();
  }

  cookies({
    marketing,
    analytics,
  });

}); 