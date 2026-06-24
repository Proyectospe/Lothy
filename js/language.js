export function initLanguage() {
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'es';
    
    // Cargar traducciones
    async function loadTranslations(lang) {
        try {
            const basePath = window.location.pathname.includes('/pages/') ? '../locales/' : './locales/';
            const response = await fetch(`${basePath}${lang}.json`);
            const translations = await response.json();
            applyTranslations(translations);
            currentLang = lang;
            document.documentElement.lang = lang;
            
            // Actualizar botones activos
            langBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
            
            localStorage.setItem('preferredLang', lang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    
    function applyTranslations(translations) {
        // Traducir todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        // Traducir placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
        
        // Traducir valores de botones/inputs si es necesario
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            if (translations[key]) {
                element.value = translations[key];
            }
        });
    }
    
    // Event listeners para botones de idioma
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                loadTranslations(lang);
            }
        });
    });
    
    // Cargar idioma guardado o español por defecto
    const savedLang = localStorage.getItem('preferredLang') || 'es';
    loadTranslations(savedLang);
}