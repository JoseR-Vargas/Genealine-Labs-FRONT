// ===== MAIN APPLICATION CLASS =====
class GenealinaLabsApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.navigation = new Navigation();
        this.techCarousel = new TechCarousel();
        this.contactForm = new ContactForm();
        this.scrollAnimations = new ScrollAnimations();
    }

    bindEvents() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        window.addEventListener('resize', () => {
            this.techCarousel.handleResize();
        });
    }
}

// ===== NAVIGATION CLASS =====
class Navigation {
    constructor() {
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.header = document.getElementById('header');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.closeMenu());
        }

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e);
                this.closeMenu();
            });
        });

        // Handle scroll for header background and active links
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('show-menu');
        this.navToggle.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('show-menu') ? 'hidden' : '';
    }

    closeMenu() {
        this.navMenu.classList.remove('show-menu');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleLinkClick(e) {
        const href = e.target.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = this.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    handleScroll() {
        if (window.scrollY >= 50) {
            this.header.classList.add('scroll-header');
        } else {
            this.header.classList.remove('scroll-header');
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active-link'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active-link');
                }
            }
        });
    }
}

// ===== TECH CAROUSEL CLASS =====
class TechCarousel {
    constructor() {
        this.track = document.getElementById('tech-track');
        this.technologies = [
            { name: 'HTML5', icon: 'img/html-5.png' },
            { name: 'React', icon: 'img/physics.png' },
            { name: 'Node.js', icon: 'img/node-js.png' },
            { name: 'NestJS', icon: 'img/nest js.jpg' },
            { name: 'TypeScript', icon: 'img/typescript.png' },
            { name: 'JavaScript', icon: 'img/js.png' },
            { name: 'CSS3', icon: 'img/css-3.png' },
            { name: 'MongoDB', icon: 'img/icons8-mongo-db-48.png' }
        ];
        
        this.init();
    }

    init() {
        this.createCarouselItems();
        this.handleResize();
    }

    createCarouselItems() {
        if (!this.track) return;

        // Clear existing items
        this.track.innerHTML = '';

        // Create multiple sets for seamless loop
        const itemsToCreate = [...this.technologies, ...this.technologies];
        
        itemsToCreate.forEach(tech => {
            const item = this.createTechItem(tech);
            this.track.appendChild(item);
        });
    }

    createTechItem(tech) {
        const item = document.createElement('div');
        item.className = 'tech-item';
        
        const icon = document.createElement('img');
        icon.src = tech.icon;
        icon.alt = tech.name;
        icon.className = 'tech-item__icon';
        icon.loading = 'lazy';
        
        const name = document.createElement('span');
        name.className = 'tech-item__name';
        name.textContent = tech.name;
        
        item.appendChild(icon);
        item.appendChild(name);
        
        return item;
    }

    handleResize() {
        // Recalculate carousel if needed
        if (this.track) {
            this.track.style.animationDuration = '20s';
        }
    }
}

// ===== CONTACT FORM CLASS =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        try {
            this.setSubmitState(submitBtn, true);
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);
            
            this.showSuccess();
            this.form.reset();
            
        } catch (error) {
            this.showError('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmitState(submitBtn, false);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing errors
        this.clearErrors(field);

        // Required field validation
        if (!value) {
            errorMessage = 'Este campo es obligatorio';
            isValid = false;
        } else {
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errorMessage = 'Por favor, ingresa un email válido';
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if (!this.isValidPhone(value)) {
                        errorMessage = 'Por favor, ingresa un número de teléfono válido';
                        isValid = false;
                    }
                    break;
                case 'name':
                case 'lastname':
                    if (value.length < 2) {
                        errorMessage = 'Debe tener al menos 2 caracteres';
                        isValid = false;
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                        isValid = false;
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearErrors(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }

    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 1000);
        });
    }

    setSubmitState(button, isSubmitting) {
        if (isSubmitting) {
            button.textContent = 'Enviando...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.textContent = 'Enviar Mensaje';
            button.disabled = false;
            button.style.opacity = '1';
        }
    }

    showSuccess() {
        this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            style.textContent += `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 5000);
    }
}

// ===== SCROLL ANIMATIONS CLASS =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll(
            '.section__title, .section__subtitle, .service__card, .about__text, .about__skills, .hero__content'
        );

        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            this.observer.observe(element);
        });

        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isMobile() {
        return window.innerWidth <= 768;
    }

    static isReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        const criticalImages = [
            'img/html-5.png',
            'img/physics.png',
            'img/node-js.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    new GenealinaLabsApp();
    new PerformanceOptimizer();
});

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}