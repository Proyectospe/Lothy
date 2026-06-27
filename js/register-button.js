class RegisterFloatingButton extends HTMLElement {


    connectedCallback() {


        this.innerHTML = `

        <div id="floating-register">


            <div class="register-message">
                Únete ahora
            </div>


            <button 
                id="register-btn"
                class="register-btn"
                title="Registrarme">


                <i class="fas fa-heart"></i>


            </button>


        </div>

        `;


        this.initializeEvents();

    }




    initializeEvents(){


        const button = this.querySelector('#register-btn');


        if(!button) return;



        button.addEventListener('click',()=>{


            window.open(
                "https://forms.gle/61QTxYtwNq7ok8oj7",
                "_blank"
            );


        });


    }


}



customElements.define(
    'register-floating-button',
    RegisterFloatingButton
);