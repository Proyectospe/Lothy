import { initHeader } from './header.js';
import { initLanguage } from './language.js';
import { initFloatingButton } from './floating-button.js';

// Inicializar AOS
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
    
    // Inicializar funcionalidades
    initHeader();
    initLanguage();
    initFloatingButton();
    initNavigation();
    initAnonymousBox();
    initStatsObserver();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('#main-nav a');
    const sections = document.querySelectorAll('.page-section');

    function setActiveSection(targetId) {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === targetId);
        });
    }

    function activateSectionFromHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setActiveSection(hash);
            const target = document.getElementById(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                setActiveSection(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', `#${targetId}`);
            }
        });
    });

    activateSectionFromHash();
}

function initAnonymousBox() {
    const form = document.getElementById('anonymous-form');
    const messagesContainer = document.getElementById('messages-container');

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('anonymousMessages')) || [];
        messagesContainer.innerHTML = '';
        messages.slice(-5).reverse().forEach((msg, index) => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.style.animation = `fadeIn 0.3s ease ${index * 0.1}s both`;
            messageCard.innerHTML = `
                <p>"${msg.text}"</p>
                <span class="message-date">${msg.date}</span>
            `;
            messagesContainer.appendChild(messageCard);
        });
    }

    function saveMessage(text) {
        const messages = JSON.parse(localStorage.getItem('anonymousMessages')) || [];
        const newMessage = {
            text: text,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        messages.push(newMessage);
        localStorage.setItem('anonymousMessages', JSON.stringify(messages));
        loadMessages();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = form.querySelector('textarea');
        const text = textarea.value.trim();

        if (text) {
            saveMessage(text);
            textarea.value = '';
            alert('💜 ¡Mensaje enviado anónimamente! Gracias por compartir.');
        }
    });

    loadMessages();
}

// Observer para animar stats al entrar
function initStatsObserver() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const track = document.querySelector('.stats-track');
                if (track) {
                    track.style.animationPlayState = 'running';
                }
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

