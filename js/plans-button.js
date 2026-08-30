class PlansFloatingButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="floating-plans">
            <div class="plans-message">
                Planes Premium
            </div>
            <button 
                id="plans-btn"
                class="plans-btn"
                title="Planes Premium">
                <i class="fas fa-crown"></i>
            </button>
        </div>
        `;

        this.initializeEvents();
    }

    initializeEvents() {
        const button = this.querySelector('#plans-btn');
        if (!button) return;

        button.addEventListener('click', () => {
            window.open(
                "https://forms.gle/hk3uTzKhZikx6GXy8",
                "_blank"
            );
        });
    }
}

customElements.define(
    'plans-floating-button',
    PlansFloatingButton
);
