// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Header background change on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
    if (!header) return;
    if (window.scrollY > 50) {
        header.style.background = 'linear-gradient(to right, var(--primary), var(--secondary))';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'linear-gradient(to right, var(--primary), var(--secondary))';
        header.style.boxShadow = 'none';
    }
});

// Intersection animations for feature cards
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#primary-navigation');
const navOverlay = document.querySelector('.nav-overlay');

const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    if (navOverlay) navOverlay.classList.remove('show');
};

const openMenu = () => {
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    navToggle.innerHTML = '<i class="fas fa-times"></i>';
    if (navOverlay) navOverlay.classList.add('show');
};

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });
}

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll progress bar
const progressBar = document.getElementById('progressBar');
if (progressBar) {
    const updateProgress = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

// Global reveal animations
const revealItems = document.querySelectorAll('[data-reveal]');
const sectionTitles = document.querySelectorAll('.section-title h2');

if (revealItems.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: window.innerWidth <= 768 ? 0.1 : 0.15,
        rootMargin: window.innerWidth <= 768 ? '50px' : '0px'
    });
    revealItems.forEach(el => revealObserver.observe(el));
    sectionTitles.forEach(el => revealObserver.observe(el));
}

// Mobile touch improvements
if ('ontouchstart' in window) {
    // Add touch feedback for interactive elements
    document.querySelectorAll('.feature-card, .event-card, .app-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    // Prevent zoom on double tap for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        let lastTouchEnd = 0;
        btn.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        });
    });
}

// Mobile performance optimizations
if (window.innerWidth <= 768) {
    // Reduce animation intensity on mobile
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');

    // Optimize scroll performance
    let ticking = false;
    const updateScrollEffects = () => {
        // Update progress bar and header effects
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });
}

// Parallax drift on hero orbs
const hero = document.querySelector('.hero');
if (hero && !prefersReducedMotion) {
    const orbs = hero.querySelectorAll('.orb');
    window.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 10;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        orbs.forEach((orb, i) => {
            const depth = (i + 1) * 2;
            orb.style.transform = `translate(${x / depth}px, ${y / depth}px)`;
        });
    });
}

// WhatsApp Widget
const whatsappWidget = document.getElementById('whatsappWidget');
if (whatsappWidget) {
    whatsappWidget.addEventListener('click', () => {
        // Replace with actual WhatsApp number
        const phoneNumber = '52551234567'; // Example number
        const message = 'Hola, me gustaría obtener más información sobre Moodmatch.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Chatbot functionality
const chatbotToggle = document.getElementById('openChatbot');
const chatbotContainer = document.getElementById('chatbot');
const closeChatbot = document.getElementById('closeChatbot');
const chatbotInput = document.getElementById('chatbotInput');
const sendMessage = document.getElementById('sendMessage');
const chatbotMessages = document.getElementById('chatbotMessages');
const quickQuestions = document.querySelectorAll('.quick-question');

// Chatbot responses
const chatbotResponses = {
    '¿Cómo funciona Moodmatch?': 'Moodmatch es una plataforma que conecta a artistas y fans a través de la música y la personalidad. Usamos IA para encontrar matches perfectos basados en gustos musicales y traits de personalidad.',
    '¿Es gratis registrarse?': '¡Sí! El registro es completamente gratuito. Puedes crear tu perfil, explorar matches y conectar con otros usuarios sin costo inicial.',
    '¿Cómo contacto a un artista?': 'Una vez que hagas match con un artista, podrás enviarle mensajes directos y compartir música. También puedes asistir a sus eventos exclusivos.',
    '¿Qué eventos hay disponibles?': 'Tenemos Live Parties, lanzamientos exclusivos, meet & greets virtuales y eventos presenciales. Los artistas pueden programar sus propios eventos directamente en la plataforma.',
    'hola': '¡Hola! ¿En qué puedo ayudarte con Moodmatch?',
    'gracias': '¡De nada! ¿Tienes alguna otra pregunta?',
    'ayuda': 'Estoy aquí para ayudarte. Puedo responder preguntas sobre cómo funciona Moodmatch, registro, eventos y más.',
    'precio': 'El registro básico es gratuito. Tenemos planes premium con features adicionales para artistas.',
    'artistas': 'En Moodmatch puedes conectar directamente con artistas independientes y establecidos. ¡Es una gran forma de descubrir nueva música!',
    'música': 'La música es el corazón de Moodmatch. Puedes compartir playlists, asistir a eventos y conectar con personas que aman la misma música que tú.',
    'default': 'Lo siento, no entendí tu pregunta. ¿Puedes reformularla? Puedo ayudarte con información sobre Moodmatch, registro, eventos y más.'
};

const addMessage = (content, isUser = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<i class="fas fa-${isUser ? 'user' : 'robot'}"></i>`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [question, response] of Object.entries(chatbotResponses)) {
        if (lowerMessage.includes(question.toLowerCase()) || question.toLowerCase().includes(lowerMessage)) {
            return response;
        }
    }
    return chatbotResponses.default;
};

const sendUserMessage = (message) => {
    addMessage(message, true);
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, false);
    }, 1000);
};

if (chatbotToggle && chatbotContainer) {
    // Open chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('show');
        chatbotToggle.style.display = 'none';
    });

    // Close chatbot
    const closeChat = () => {
        chatbotContainer.classList.remove('show');
        chatbotToggle.style.display = 'flex';
    };

    if (closeChatbot) {
        closeChatbot.addEventListener('click', closeChat);
    }

    // Quick questions
    quickQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.getAttribute('data-question');
            sendUserMessage(question);
        });
    });

    // Send message on button click
    if (sendMessage) {
        sendMessage.addEventListener('click', () => {
            const message = chatbotInput.value.trim();
            if (message) {
                sendUserMessage(message);
                chatbotInput.value = '';
            }
        });
    }

    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = chatbotInput.value.trim();
                if (message) {
                    sendUserMessage(message);
                    chatbotInput.value = '';
                }
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbotContainer.classList.contains('show')) {
            closeChat();
        }
    });
}


