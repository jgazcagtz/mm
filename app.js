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
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        if (navOverlay) navOverlay.classList.toggle('show', isOpen);
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                if (navOverlay) navOverlay.classList.remove('show');
            }
        });
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


