class LothyFloatingButton extends HTMLElement {
    connectedCallback() {
        const isInsidePages = window.location.pathname.includes('/pages/');
        const prefix = isInsidePages ? '../' : '';

        this.innerHTML = `
            <div id="floating-doctor">
                <div class="floating-message">Agenda tu cita</div>
                <button id="doctor-btn" class="doctor-btn" title="Contáctame">
                    <img src="${prefix}assets/images/personaFlotante.png" alt="Consultar doctor" class="floating-icon">
                </button>
            </div>

            <div id="appointment-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>

                    <h2>Agendar Cita con Psicólogo</h2>

                    <form id="appointment-form">
                        <div class="form-group">
                            <label for="appointment-name">Tu nombre:</label>
                            <input
                                type="text"
                                id="appointment-name"
                                placeholder="Ej: Ana Pérez"
                                required
                            >
                        </div>

                        <button type="submit" class="btn btn-primary">
                            Enviar cita por WhatsApp
                        </button>
                    </form>

                    <p class="modal-info">
                        * Recibirás un mensaje de confirmación en WhatsApp.
                    </p>
                </div>
            </div>
        `;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const doctorBtn = this.querySelector('#doctor-btn');
        const modal = this.querySelector('#appointment-modal');
        const closeModal = this.querySelector('.close-modal');
        const form = this.querySelector('#appointment-form');

        if (!doctorBtn || !modal || !closeModal || !form) return;

        const openModal = () => {
            modal.style.display = 'flex';
            modal.classList.add('is-open');
        };

        const closeAppointmentModal = () => {
            modal.classList.remove('is-open');
            modal.style.display = 'none';
        };

        doctorBtn.addEventListener('click', openModal);

        closeModal.addEventListener('click', closeAppointmentModal);

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeAppointmentModal();
            }
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = this.querySelector('#appointment-name').value.trim();

            if (!name) return;

            const message =
                `¡Hola, quiero agendar una cita.!\n\n` +
                `*Mi Nombre es:* ${name}\n\n` +
                `¡Quedo atento a la confirmación, gracias!`;

            const phoneNumber = '51963281281';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');

            closeAppointmentModal();
            form.reset();
        });
    }
}

customElements.define('lothy-floating-button', LothyFloatingButton);