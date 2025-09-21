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
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotOptions = document.querySelectorAll('.chatbot-option');
const toggleOptionsBtn = document.getElementById('toggleOptions');
const chatbotInputContainer = document.querySelector('.chatbot-input-container');
const chatbotNotification = document.getElementById('chatbotNotification');
console.log('Found chatbot options:', chatbotOptions.length); // Debug log

// Notification system
let notificationCount = 0;

const showNotification = (count = 1) => {
    if (chatbotNotification) {
        notificationCount = Math.min(count, 99);
        chatbotNotification.textContent = notificationCount > 9 ? '9+' : notificationCount;
        chatbotNotification.classList.add('show');
    }
};

const hideNotification = () => {
    if (chatbotNotification) {
        chatbotNotification.classList.remove('show');
        notificationCount = 0;
    }
};

// Chatbot responses
const chatbotResponses = {
    '¿Cuáles son los precios?': 'Tenemos diferentes planes diseñados para cubrir todas las necesidades:\n\n🎵 **BÁSICO (Gratis)**:\n• Perfil ilimitado\n• Matches básicos\n• Eventos públicos\n• Chat con matches\n\n💎 **PREMIUM ($9.99/mes)**:\n• Todo lo del Básico\n• Matches ilimitados\n• Eventos VIP exclusivos\n• Filtros avanzados\n• Chat prioritario\n• Estadísticas detalladas\n\n🎤 **PRO ARTIST ($19.99/mes)**:\n• Todo lo del Premium\n• Herramientas de promoción\n• Eventos ilimitados\n• Análisis de audiencia\n• Soporte prioritario\n• Distribución de música\n\n🎪 **ENTERPRISE (Personalizado)**:\n• Para sellos discográficos\n• Grandes artistas\n• Soluciones personalizadas\n\n¿Te gustaría saber más sobre algún plan específico?',
    // Basic functionality
    '¿Cómo funciona Moodmatch?': 'Moodmatch es una plataforma revolucionaria que conecta a artistas y fans a través de la música y la personalidad. Usamos inteligencia artificial avanzada para analizar tus gustos musicales, personalidad y hasta tu estado de ánimo para encontrar matches perfectos. ¡Es como tener un mejor amigo que sabe exactamente qué música te va a encantar!',

    '¿Es gratis registrarse?': '¡Absolutamente sí! El registro en Moodmatch es completamente gratuito. Puedes crear tu perfil, explorar la comunidad, hacer matches iniciales y comenzar a conectar con otros usuarios sin pagar nada. Solo si quieres acceder a features premium como eventos exclusivos o contacto directo con artistas famosos, entonces considerarías nuestros planes pagos.',

    '¿Cómo contacto a un artista?': '¡Es muy fácil! Una vez que hagas match con un artista (basado en compatibilidad musical y de personalidad), podrás:\n\n• Enviarle mensajes directos\n• Compartir playlists y canciones\n• Recibir notificaciones de sus eventos\n• Asistir a sus Live Parties exclusivas\n• Comprar su música directamente desde la plataforma',

    '¿Qué eventos hay disponibles?': '¡Moodmatch está lleno de eventos emocionantes!\n\n• **Live Parties**: Sesiones en vivo donde artistas comparten su proceso creativo\n• **Lanzamientos exclusivos**: Escucha nueva música antes que nadie\n• **Meet & Greets virtuales**: Conoce a tus artistas favoritos\n• **Conciertos presenciales**: Eventos reales organizados por la comunidad\n• **Workshops**: Aprende sobre producción musical, composición, etc.\n\nLos artistas pueden crear sus propios eventos directamente en la plataforma.',

    // New comprehensive questions
    '¿Cómo puedo crear mi perfil?': 'Crear tu perfil en Moodmatch es súper fácil:\n\n1. **Regístrate** con tu email o redes sociales\n2. **Completa tu perfil musical** - selecciona tus géneros favoritos, artistas preferidos\n3. **Responde el test de personalidad** - esto nos ayuda a encontrar tus matches perfectos\n4. **Sube tu foto** (opcional, pero recomendado para mejor matching)\n5. **Verifica tu identidad** - por seguridad, usamos verificación facial\n\n¡En menos de 5 minutos estás listo para conectar!',

    '¿Qué necesito para registrarme?': 'Solo necesitas:\n\n• **Email válido** o cuenta de redes sociales\n• **Ser mayor de 13 años**\n• **Tener interés real en la música** 🎵\n• **Completar verificación facial** (toma 30 segundos)\n\nNo necesitas:\n• Tarjeta de crédito\n• Experiencia musical previa\n• Equipo especial\n\n¡Cualquiera con pasión por la música es bienvenido!',

    '¿Puedo subir mi música?': '¡Por supuesto! Si eres artista o creador musical:\n\n• **Sube tus tracks originales** directamente\n• **Comparte tus playlists** curadas\n• **Transmite en vivo** tus sesiones\n• **Organiza eventos** para tu comunidad\n• **Conecta con fans** reales interesados en tu música\n• **Vende tu música** con enlaces directos a Spotify, Bandcamp, etc.\n\nPara usuarios regulares:\n• **Comparte playlists** con la comunidad\n• **Recomienda canciones** a tus matches\n• **Asiste a eventos** de artistas emergentes',

    '¿Cómo funciona el matching?': 'Nuestro sistema de matching es único y súper inteligente:\n\n🎯 **Análisis musical**: Analizamos tus gustos, playlists y artistas favoritos\n🧠 **Personalidad IA**: Usamos IA para entender tu personalidad basada en tus interacciones\n😊 **Estado de ánimo**: Hasta consideramos tu estado emocional actual\n🔥 **Compatibilidad**: Encontramos personas con gustos similares y energía complementaria\n\nResultado: **Matches auténticos** que van más allá de la música superficial',

    '¿Es seguro usar Moodmatch?': '¡La seguridad es nuestra prioridad #1!\n\n🔐 **Verificación facial**: Todos los usuarios pasan por verificación facial\n🚫 **Sin datos personales**: Nunca compartimos emails o números de teléfono\n💬 **Chat seguro**: Toda comunicación sucede dentro de la app\n👥 **Comunidad moderada**: Monitoreamos la plataforma 24/7\n🎵 **Enfoque musical**: Nos centramos en conexiones auténticas a través de la música\n\nMiles de usuarios ya confían en nosotros para encontrar conexiones reales.',

    '¿Hay versión premium?': '¡Sí! Tenemos planes premium diseñados para diferentes necesidades:\n\n**Para fans**:\n• Acceso prioritario a eventos exclusivos\n• Más matches diarios\n• Filtros avanzados\n• Chat con artistas famosos\n\n**Para artistas**:\n• Estadísticas detalladas de tu audiencia\n• Herramientas de promoción avanzadas\n• Eventos ilimitados\n• Análisis de engagement\n• Soporte prioritario\n\n**Planes**:\n• **Básico**: Gratis para siempre\n• **Premium**: $9.99/mes\n• **Pro Artist**: $19.99/mes\n• **Enterprise**: Para sellos y grandes artistas',

    // Conversational responses
    'hola': '¡Hola! Soy el asistente de Moodmatch. ¿En qué puedo ayudarte hoy? 😊',
    'buenos días': '¡Buenos días! ¿Qué tal tu día? ¿En qué puedo ayudarte con Moodmatch?',
    'buenas tardes': '¡Buenas tardes! ¿Cómo va tu día? Dime, ¿qué quieres saber sobre Moodmatch?',
    'buenas noches': '¡Buenas noches! ¿Buscando música para relajarte? Cuéntame qué necesitas.',
    'gracias': '¡De nada! ¿Tienes alguna otra pregunta sobre Moodmatch?',
    'ayuda': 'Estoy aquí para ayudarte. Puedo responder preguntas sobre:\n• Cómo funciona la plataforma\n• Registro y perfil\n• Sistema de matching\n• Eventos y actividades\n• Seguridad y privacidad\n• Planes y precios\n\n¿Qué te gustaría saber?',
    'precio': 'Tenemos diferentes planes:\n\n🎵 **Gratis**: Registro, matches básicos, eventos públicos\n💎 **Premium $9.99/mes**: Más matches, eventos exclusivos, filtros avanzados\n🎤 **Pro Artist $19.99/mes**: Herramientas profesionales, estadísticas, promoción\n\n¿Te interesa algún plan específico?',
    'artistas': '¡Moodmatch es perfecto para conectar con artistas! Puedes:\n\n🎤 Descubrir artistas emergentes antes que nadie\n💬 Hablar directamente con tus artistas favoritos\n🎵 Asistir a sus eventos exclusivos\n📱 Recibir notificaciones de sus lanzamientos\n🤝 Colaborar en proyectos musicales\n\n¡Es como tener backstage pass con todos los artistas!',
    'música': '¡La música es el corazón de Moodmatch! ❤️\n\n🎵 **Descubre nueva música** basada en tu personalidad\n📱 **Comparte playlists** con matches perfectos\n🎤 **Conecta con artistas** que crean tu música favorita\n🎶 **Asiste a eventos** musicales exclusivos\n📀 **Compra música** directamente de los artistas\n\n¿Buscas algún género específico o artista?',
    'registro': 'El registro es rapidísimo:\n\n1️⃣ Email o redes sociales\n2️⃣ Gustos musicales (elige tus géneros favoritos)\n3️⃣ Test de personalidad (divertido y revelador)\n4️⃣ Foto opcional (mejor matching con foto)\n5️⃣ Verificación facial (30 segundos)\n\n¡Listo en menos de 5 minutos!',
    'perfil': 'Tu perfil en Moodmatch es tu carta de presentación musical:\n\n🎵 **Géneros favoritos** - Lo que realmente te apasiona\n🧠 **Personalidad** - Cómo te define la música\n📸 **Fotos/videos** - Muestra tu estilo musical\n🎤 **Artistas preferidos** - Tus influencias\n📱 **Estado actual** - ¿Qué estás escuchando ahora?\n\nCompleta tu perfil para mejores matches!',
    'eventos': '¡Los eventos son increíbles en Moodmatch!\n\n🎉 **Live Parties**: Artistas creando en tiempo real\n🎵 **Lanzamientos exclusivos**: Nueva música antes que nadie\n🤝 **Meet & Greets**: Conoce a tus artistas favoritos\n🎪 **Festivales virtuales**: Experiencias inmersivas\n📚 **Workshops**: Aprende sobre música\n🎭 **Conciertos presenciales**: Eventos reales de la comunidad',
    'matching': 'Nuestro algoritmo es único:\n\n🎯 **IA avanzada** analiza tu personalidad musical\n🧠 **Machine learning** entiende tus patrones de gusto\n😊 **Estado emocional** considera cómo te sientes\n🔥 **Compatibilidad profunda** más allá de géneros superficiales\n📊 **Aprendizaje continuo** mejora con cada interacción\n\nResultado: **Matches que realmente conectan contigo**',
    'seguridad': 'Tu seguridad es nuestra misión:\n\n🔐 **Verificación facial obligatoria** para todos\n🚫 **Cero datos personales compartidos** (ni emails ni teléfonos)\n💬 **Comunicación 100% interna** en la plataforma\n👥 **Moderación 24/7** por humanos\n🛡️ **Reportes y bloqueos** instantáneos\n🎵 **Enfoque en música auténtica** reduce riesgos\n\n¡Conecta con confianza!',
    'premium': 'Premium desbloquea el siguiente nivel:\n\n⭐ **Matches ilimitados** diarios\n🎫 **Acceso VIP** a eventos exclusivos\n🔍 **Filtros avanzados** de búsqueda\n💬 **Contacto directo** con artistas famosos\n📊 **Estadísticas detalladas** de tu actividad\n🎵 **Playlists premium** curadas por expertos\n🎤 **Herramientas de promoción** si eres artista\n\n¿Te gustaría saber más sobre algún beneficio?',
    'default': 'Interesante pregunta. Déjame ayudarte con eso. Moodmatch es una plataforma musical única que conecta personas a través de la música y la personalidad. \n\nPuedo ayudarte con:\n• Funcionamiento de la plataforma\n• Registro y creación de perfil\n• Sistema de matching con IA\n• Eventos y actividades\n• Seguridad y privacidad\n• Planes y precios\n\n¿Puedes ser más específico con tu pregunta? ¡Estoy aquí para ayudarte! 😊'
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

const showThinkingIndicator = () => {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'chatbot-message bot-message';
    thinkingDiv.id = 'thinking-indicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-brain"></i>';

    const thinkingIndicatorDiv = document.createElement('div');
    thinkingIndicatorDiv.className = 'thinking-indicator';

    const thinkingSteps = ['Analizando tu consulta...', 'Procesando información...', 'Generando respuesta...'];
    thinkingSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'thinking-step';
        stepDiv.style.opacity = '0';
        stepDiv.style.transform = 'translateY(10px)';
        stepDiv.textContent = step;

        // Animate each step
        setTimeout(() => {
            stepDiv.style.transition = 'all 0.5s ease';
            stepDiv.style.opacity = '1';
            stepDiv.style.transform = 'translateY(0)';
        }, index * 800);

        thinkingIndicatorDiv.appendChild(stepDiv);
    });

    thinkingDiv.appendChild(avatarDiv);
    thinkingDiv.appendChild(thinkingIndicatorDiv);
    chatbotMessages.appendChild(thinkingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return thinkingDiv;
};

const showTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.id = 'typing-indicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';

    const typingIndicatorDiv = document.createElement('div');
    typingIndicatorDiv.className = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingIndicatorDiv.appendChild(dot);
    }

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(typingIndicatorDiv);
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return typingDiv;
};

const hideTypingIndicator = (typingDiv) => {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
};

const hideThinkingIndicator = (thinkingDiv) => {
    if (thinkingDiv && thinkingDiv.parentNode) {
        thinkingDiv.parentNode.removeChild(thinkingDiv);
    }
};

const sendUserMessage = (message) => {
    addMessage(message, true);

    // Show thinking process first
    const thinkingDiv = showThinkingIndicator();

    // Simulate thinking time
    const response = getBotResponse(message);
    const thinkingTime = 2000; // 2 seconds of thinking
    const typingTime = Math.min(500 + (response.length * 25), 2000);

    setTimeout(() => {
        hideThinkingIndicator(thinkingDiv);
        const typingDiv = showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator(typingDiv);
            addMessage(response, false);

            // Show notification for new message if chatbot is closed
            if (!chatbotContainer.classList.contains('show')) {
                notificationCount++;
                showNotification(notificationCount);
            }
        }, typingTime);
    }, thinkingTime);
};

if (chatbotToggle && chatbotContainer) {
    // Auto-open chatbot after page load
    const autoOpenChatbot = () => {
        setTimeout(() => {
            // Show chatbot
            chatbotContainer.style.display = 'grid';
            chatbotContainer.classList.add('show');
            chatbotToggle.style.display = 'none';

            // Handle mobile responsiveness
            if (window.innerWidth <= 768) {
                chatbotContainer.style.position = 'fixed';
                chatbotContainer.style.bottom = '0';
                chatbotContainer.style.left = '0';
                chatbotContainer.style.right = '0';
                chatbotContainer.style.width = '100%';
                chatbotContainer.style.height = '85vh';
                chatbotContainer.style.maxHeight = '700px';
                chatbotContainer.style.borderRadius = '20px 20px 0 0';
                chatbotContainer.style.zIndex = '1001';
            }

            // Add welcome message after opening (without triggering notifications)
            setTimeout(() => {
                const welcomeResponse = getBotResponse('hola');
                addMessage(welcomeResponse, false);
            }, 1000);
        }, 3000); // Open after 3 seconds
    };

    // Start auto-open timer
    autoOpenChatbot();

    // Options toggle functionality
    if (toggleOptionsBtn && chatbotInputContainer) {
        let optionsCollapsed = false;

        toggleOptionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            optionsCollapsed = !optionsCollapsed;

            if (optionsCollapsed) {
                // Collapse options
                chatbotInputContainer.classList.add('collapsed');
                toggleOptionsBtn.classList.add('collapsed');
                chatbotContainer.classList.add('options-collapsed');
                toggleOptionsBtn.setAttribute('aria-label', 'Mostrar opciones');
                toggleOptionsBtn.querySelector('span').textContent = 'Opciones Rápidas';
            } else {
                // Expand options
                chatbotInputContainer.classList.remove('collapsed');
                toggleOptionsBtn.classList.remove('collapsed');
                chatbotContainer.classList.remove('options-collapsed');
                toggleOptionsBtn.setAttribute('aria-label', 'Ocultar opciones');
                toggleOptionsBtn.querySelector('span').textContent = 'Opciones Rápidas';
            }
        });
    }

    // Open chatbot
    chatbotToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Show chatbot
        chatbotContainer.style.display = 'grid';
        chatbotContainer.classList.add('show');
        chatbotToggle.style.display = 'none';

        // Handle mobile responsiveness
        if (window.innerWidth <= 768) {
            // Mobile: make it full screen
            chatbotContainer.style.position = 'fixed';
            chatbotContainer.style.bottom = '0';
            chatbotContainer.style.left = '0';
            chatbotContainer.style.right = '0';
            chatbotContainer.style.width = '100%';
            chatbotContainer.style.height = '85vh';
            chatbotContainer.style.maxHeight = '700px';
            chatbotContainer.style.borderRadius = '20px 20px 0 0';
            chatbotContainer.style.zIndex = '1001';
        }

        // Hide notification when opening chatbot
        hideNotification();
    });

    // Close chatbot
    const closeChat = () => {
        chatbotContainer.classList.remove('show');
        chatbotToggle.style.display = 'flex';

        // Reset options state
        if (toggleOptionsBtn && chatbotInputContainer) {
            chatbotInputContainer.classList.remove('collapsed');
            toggleOptionsBtn.classList.remove('collapsed');
            chatbotContainer.classList.remove('options-collapsed');
            toggleOptionsBtn.setAttribute('aria-label', 'Mostrar opciones');
            toggleOptionsBtn.querySelector('span').textContent = 'Opciones Rápidas';
        }

        // Reset mobile styles
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                chatbotContainer.style.position = '';
                chatbotContainer.style.bottom = '';
                chatbotContainer.style.left = '';
                chatbotContainer.style.right = '';
                chatbotContainer.style.width = '';
                chatbotContainer.style.height = '';
                chatbotContainer.style.maxHeight = '';
                chatbotContainer.style.borderRadius = '';
                chatbotContainer.style.zIndex = '';
            }
            chatbotContainer.style.display = 'none';
        }, 300); // Match transition duration
    };

    if (closeChatbot) {
        closeChatbot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeChat();
        });
    }

    // Chatbot options
    chatbotOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const question = button.getAttribute('data-question');
            if (question && chatbotResponses[question]) {
                sendUserMessage(question);

                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            }
        });
    });

    // Close when clicking outside (desktop only)
    document.addEventListener('click', (e) => {
        if (chatbotContainer.classList.contains('show') &&
            !chatbotContainer.contains(e.target) &&
            !chatbotToggle.contains(e.target) &&
            window.innerWidth > 768) {
            closeChat();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbotContainer.classList.contains('show')) {
            closeChat();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (chatbotContainer.classList.contains('show')) {
            if (window.innerWidth <= 768) {
                // Mobile view
                chatbotContainer.style.position = 'fixed';
                chatbotContainer.style.bottom = '0';
                chatbotContainer.style.left = '0';
                chatbotContainer.style.right = '0';
                chatbotContainer.style.width = '100%';
                chatbotContainer.style.height = '85vh';
                chatbotContainer.style.maxHeight = '700px';
                chatbotContainer.style.borderRadius = '20px 20px 0 0';
            } else {
                // Desktop view
                chatbotContainer.style.position = 'fixed';
                chatbotContainer.style.bottom = '100px';
                chatbotContainer.style.left = 'auto';
                chatbotContainer.style.right = '20px';
                chatbotContainer.style.width = 'min(400px, 90vw)';
                chatbotContainer.style.height = 'min(600px, 80vh)';
                chatbotContainer.style.borderRadius = '20px';
            }
        }
    });

    // Initialize options as collapsed on mobile
    const initializeOptionsState = () => {
        if (window.innerWidth <= 768 && toggleOptionsBtn && chatbotInputContainer) {
            // Start collapsed on mobile for better UX
            chatbotInputContainer.classList.add('collapsed');
            toggleOptionsBtn.classList.add('collapsed');
            chatbotContainer.classList.add('options-collapsed');
            toggleOptionsBtn.setAttribute('aria-label', 'Mostrar opciones');
            toggleOptionsBtn.querySelector('span').textContent = 'Opciones Rápidas';
        }
    };

    // Initialize on load
    initializeOptionsState();
}

// Professional chatbot enhancements - now options-based interface

// Add message timestamps (optional professional feature)
const addMessageWithTimestamp = (content, isUser = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<i class="fas fa-${isUser ? 'user' : 'robot'}"></i>`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Handle line breaks in responses
    if (typeof content === 'string') {
        contentDiv.innerHTML = content.replace(/\n/g, '<br>');
    } else {
        contentDiv.textContent = content;
    }

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return messageDiv;
};

// Chatbot now uses options-based interface only

// Initialize app functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Moodmatch app loaded successfully!');

    // Test chatbot functionality
    if (chatbotToggle && chatbotContainer) {
        console.log('✅ Chatbot elements found and ready');
    }

    // Test navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        console.log(`✅ Navigation link ${index + 1}: ${link.textContent}`);
    });
});



