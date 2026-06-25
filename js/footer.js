class LothyFooter extends HTMLElement {
    connectedCallback() {
        const isInsidePages = window.location.pathname.includes('/pages/');
        const indexLink = isInsidePages ? '../' : './';
        const pagesPrefix = isInsidePages ? '' : 'pages/';

        this.innerHTML = `
            <footer id="main-footer">
    <div class="container">
        <div class="footer-content">

            <div class="footer-brand">
                <h3>Lothy</h3>
                <p>Tu amiga incondicional.</p>

                <div class="social-links">
                    <a href="https://www.tiktok.com/@lottie.bear.com?is_from_webapp=1&sender_device=pc" title="TikTok"><i class="fab fa-tiktok"></i></a>
                    <a href="https://www.instagram.com/lothy_bear/" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://wa.me/51963281281" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>

            <nav class="footer-links">
                <a href="${indexLink}">Inicio</a>
                <a href="${pagesPrefix}nosotros.html">Nosotros</a>
                <a href="${pagesPrefix}que-es.html">¿Qué es?</a>
                <a href="${pagesPrefix}noticias.html">Noticias</a>
                <a href="${pagesPrefix}recursos.html">Comunidad</a>
            </nav>

        </div>
    </div>

    <div class="footer-bottom">
        <p>© 2026 Lothy | Derechos reservados</p>
    </div>
</footer>
        `;
    }
}

customElements.define('lothy-footer', LothyFooter);
