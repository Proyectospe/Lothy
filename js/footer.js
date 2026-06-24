class LothyFooter extends HTMLElement {
    connectedCallback() {
        const isInsidePages = window.location.pathname.includes('/pages/');
        const prefix = isInsidePages ? '../' : '';

        this.innerHTML = `
            <footer id="main-footer">
    <div class="container">
        <div class="footer-content">

            <div class="footer-brand">
                <h3>Lothy</h3>
                <p>Tu amiga incondicional.</p>

                <div class="social-links">
                    <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>

            <nav class="footer-links">
                <a href="${prefix}index.html">Inicio</a>
                <a href="${prefix}pages/nosotros.html">Nosotros</a>
                <a href="${prefix}pages/que-es.html">¿Qué es?</a>
                <a href="${prefix}pages/noticias.html">Noticias</a>
                <a href="${prefix}pages/recursos.html">Comunidad</a>
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
