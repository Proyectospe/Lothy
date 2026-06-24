class LothyHeader extends HTMLElement {
    connectedCallback() {
        // Detectar si estamos dentro de /pages/
        const isInsidePages = window.location.pathname.includes('/pages/');
        const indexLink = isInsidePages ? '../index.html' : './index.html';
        const pagesPrefix = isInsidePages ? '' : 'pages/';

        this.innerHTML = `
            <div class="container header-container">
                <div class="logo">
                    <a href="${indexLink}">
                        <span class="logo-icon"><i class="fas fa-heart"></i></span>
                        <span class="logo-text">Lothy</span>
                        <small>tu amiga incondicional</small>
                    </a>
                </div>
                <nav id="main-nav">
                    <ul>
                        <li><a href="${indexLink}">Inicio</a></li>
                        <li><a href="${pagesPrefix}nosotros.html">Nosotros</a></li>
                        <li><a href="${pagesPrefix}que-es.html">¿Qué es?</a></li>
                        <li><a href="${pagesPrefix}noticias.html">Noticias</a></li>
                        <li><a href="${pagesPrefix}caja-anonima.html">Caja Anónima</a></li>
                        <li><a href="${pagesPrefix}recursos.html">Comunidad</a></li>

                    </ul>
                </nav>
                <div class="header-actions">
                    <button id="menu-toggle" class="menu-toggle">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        `;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const menuToggle = this.querySelector('#menu-toggle');
        const nav = this.querySelector('#main-nav');
        const header = this;

        if (!menuToggle || !nav) return;

        let lastScroll = window.pageYOffset;

        function updateHeader() {
            const currentScroll = window.pageYOffset;
            header.classList.toggle('scrolled', currentScroll > 12);

            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-72px)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = Math.max(currentScroll, 0);
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();

        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active', nav.classList.contains('open'));
        });

        // Cerrar menú al hacer clic en un enlace
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('open');
                menuToggle.classList.remove('active');
            }
        });
    }
}

customElements.define('lothy-header', LothyHeader);
