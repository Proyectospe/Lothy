import { initLanguage } from './language.js';

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
    initLanguage();
    initNavigation();
    initAnonymousBox();
    initEmotionGames();
    initWeeklyChallenge();
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
            const targetId = link.getAttribute('data-section');
            if (!targetId) return;

            e.preventDefault();
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
    if (!form || !messagesContainer) return;

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('anonymousMessages')) || [];
        messagesContainer.innerHTML = '';

        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p class="empty-state">Comparte el primer mensaje y verás aparecer las voces de la comunidad aquí.</p>';
            return;
        }

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

function initEmotionGames() {
    const buttons = document.querySelectorAll('.game-card button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const promptText = button.dataset.prompt;
            const response = window.prompt(promptText, '');
            if (!response) return;

            const resultNode = button.closest('.game-card').querySelector('.game-result');
            resultNode.textContent = `Gracias por compartir: "${response}"`;
            resultNode.classList.add('active');
        });
    });
}

function initWeeklyChallenge() {
    const challengeForm = document.getElementById('challenge-form');
    const feedbackContainer = document.getElementById('challenge-feedback-container');
    if (!challengeForm || !feedbackContainer) return;

    function loadFeedback() {
        const feedback = JSON.parse(localStorage.getItem('challengeFeedback')) || [];
        feedbackContainer.innerHTML = '';

        if (feedback.length === 0) {
            feedbackContainer.innerHTML = '<p class="empty-state">Aún no hay experiencias del reto. Sé el primero en compartir.</p>';
            return;
        }

        feedback.slice(-5).reverse().forEach((item) => {
            const card = document.createElement('div');
            card.className = 'challenge-feedback-card';
            card.innerHTML = `
                <p>"${item.text}"</p>
                <span class="message-date">${item.date}</span>
            `;
            feedbackContainer.appendChild(card);
        });
    }

    function saveFeedback(text) {
        const feedback = JSON.parse(localStorage.getItem('challengeFeedback')) || [];
        const newFeedback = {
            text,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        feedback.push(newFeedback);
        localStorage.setItem('challengeFeedback', JSON.stringify(feedback));
        loadFeedback();
    }

    challengeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = challengeForm.querySelector('textarea');
        const text = textarea.value.trim();

        if (text) {
            saveFeedback(text);
            textarea.value = '';
            alert('✨ ¡Gracias por compartir tu experiencia del reto!');
        }
    });

    loadFeedback();
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

