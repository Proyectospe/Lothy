class LothyFloatingButton extends HTMLElement {
    connectedCallback() {
        const isInsidePages = window.location.pathname.includes('/pages/');
        const prefix = isInsidePages ? '../' : '';

        this.innerHTML = `
            <div id="floating-doctor">
                <div class="floating-message">Agenda tu cita</div>
                <button id="doctor-btn" class="doctor-btn" title="Contactame">
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
                            <input type="text" id="appointment-name" placeholder="Ej: Ana Pérez" required>
                        </div>
                        <div class="form-group">
                            <label for="appointment-date">Fecha de la cita:</label>
                            <input type="date" id="appointment-date" required>
                        </div>
                        <div class="form-group">
                            <label for="appointment-time">Hora de la cita:</label>
                            <input type="time" id="appointment-time" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Enviar cita por WhatsApp</button>
                    </form>
                    <p class="modal-info">* Recibirás un mensaje de confirmación en WhatsApp.</p>
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
        const dateInput = this.querySelector('#appointment-date');
        const timeInput = this.querySelector('#appointment-time');

        if (!doctorBtn || !modal || !closeModal || !form || !dateInput || !timeInput) return;

        // Helper: fecha/hora local en formato yyyy-mm-dd y HH:MM (evita problemas de UTC)
        const getLocalDateString = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const getLocalTimeString = (d) => {
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        // No permitir seleccionar una fecha anterior a hoy
        const todayStr = getLocalDateString(new Date());
        dateInput.setAttribute('min', todayStr);

        // Si la fecha elegida es hoy, no permitir horas anteriores a la actual
        const updateMinTime = () => {
            const now = new Date();
            if (dateInput.value === getLocalDateString(now)) {
                timeInput.setAttribute('min', getLocalTimeString(now));
            } else {
                timeInput.removeAttribute('min');
            }
        };

        dateInput.addEventListener('change', updateMinTime);
        dateInput.addEventListener('focus', updateMinTime);

        const openModal = () => {
            // Refrescar el mínimo de fecha cada vez que se abre el modal
            const freshTodayStr = getLocalDateString(new Date());
            dateInput.setAttribute('min', freshTodayStr);
            updateMinTime();

            modal.style.display = 'flex';
            modal.classList.add('is-open');
        };

        const closeAppointmentModal = () => {
            modal.classList.remove('is-open');
            modal.style.display = 'none';
        };

        doctorBtn.addEventListener('click', openModal);
        closeModal.addEventListener('click', closeAppointmentModal);

        document.addEventListener('click', (event) => {
            if (event.target === modal) closeAppointmentModal();
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = this.querySelector('#appointment-name').value.trim();
            const date = this.querySelector('#appointment-date').value;
            const time = this.querySelector('#appointment-time').value;

            if (!name || !date || !time) return;

            const selectedDateTime = new Date(`${date}T${time}`);
            const now = new Date();

            if (selectedDateTime < now) {
                alert('Por favor selecciona una fecha y hora futuras. No se pueden agendar citas en el pasado.');
                return;
            }

            const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const encodedText =
                encodeURIComponent('¡Hola Lothy!') +
                encodeURIComponent('\n\nQuiero agendar una cita con el psicólogo.') +
                encodeURIComponent(`\n\n*Nombre:* ${name}`) +
                encodeURIComponent(`\n*Fecha:* ${formattedDate}`) +
                encodeURIComponent(`\n*Hora:* ${formattedTime}`) +
                encodeURIComponent('\n\n¡Quedo atento a la confirmación!');

            const phoneNumber = '51963281281';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
            closeAppointmentModal();
            form.reset();
        });
    }
}

customElements.define('lothy-floating-button', LothyFloatingButton);