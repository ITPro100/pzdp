/**
 * Main Site Manager
 * Модульна архітектура для керування функціоналом сайту
 */
class SiteManager {
    constructor() {
        this.modules = {};
        this.config = {
            phoneRegex: /^\+380\d{9}$/,
            nameRegex: /^[a-zA-Zа-яА-ЯіІїЇєЄ\s]{2,50}$/,
            animationDuration: 300,
            notificationDelay: 45000
        };
        
        this.init();
    }

    /**
     * Ініціалізація всіх модулів сайту
     */
    init() {
        console.log('🚀 Ініціалізація SiteManager');
        
        // Базові модулі (завантажуються завжди)
        this.initCoreModules();
        
        // Умовне завантаження модулів
        this.initConditionalModules();
        
        // Налаштування обробників подій
        this.setupEventListeners();
        
        // Запуск перевірок
        this.runInitialChecks();
        
        console.log('✅ SiteManager ініціалізовано успішно');
    }

    /**
     * Ініціалізація базових модулів
     */
    initCoreModules() {
        try {
            // Модуль захоплення лідів
            if (typeof LeadCapture !== 'undefined') {
                this.modules.leadCapture = new LeadCapture(this);
            }

            // Модуль аналітики
            if (typeof Analytics !== 'undefined') {
                this.modules.analytics = new Analytics(this);
            }

            // Модуль живих уведомлень
            if (typeof LiveNotifications !== 'undefined') {
                this.modules.notifications = new LiveNotifications(this);
            }

        } catch (error) {
            console.error('❌ Помилка ініціалізації базових модулів:', error);
        }
    }

    /**
     * Умовне завантаження модулів
     */
    initConditionalModules() {
        try {
            // Калькулятор виплат
            if (document.querySelector('.calculator') && typeof PaymentCalculator !== 'undefined') {
                this.modules.calculator = new PaymentCalculator(this);
                console.log('📊 Калькулятор виплат ініціалізовано');
            }

            // Система відгуків
            if (document.querySelector('.testimonials') && typeof Testimonials !== 'undefined') {
                this.modules.testimonials = new Testimonials(this);
                console.log('⭐ Система відгуків ініціалізована');
            }

            // Модуль модальних вікон
            if (document.querySelector('.modal')) {
                this.initModalSystem();
            }

        } catch (error) {
            console.error('❌ Помилка ініціалізації умовних модулів:', error);
        }
    }

    /**
     * Налаштування основних обробників подій
     */
    setupEventListeners() {
        // Обробка форм
        this.setupFormHandlers();
        
        // Обробка телефонних дзвінків
        this.setupPhoneTracking();
        
        // Обробка скролу
        this.setupScrollHandlers();
        
        // Обробка кликів по кнопках
        this.setupButtonHandlers();
    }

    /**
     * Налаштування обробників форм
     */
    setupFormHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (form.classList.contains('lead-form') || form.classList.contains('contact-form')) {
                    if (this.modules.leadCapture) {
                        this.modules.leadCapture.handleSubmit(form);
                    }
                }
            });

            // Валідація в реальному часі
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    /**
     * Налаштування відстеження телефонних дзвінків
     */
    setupPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                const phone = link.getAttribute('href').replace('tel:', '');
                
                // Трекінг в аналітиці
                if (this.modules.analytics) {
                    this.modules.analytics.trackEvent('phone_click', {
                        phone: phone,
                        source: link.dataset.track || 'unknown'
                    });
                }

                // Показати уведомлення
                this.showNotification('📞 Дзвінок протягом 3 хвилин!', 'success');
            });
        });
    }

    /**
     * Налаштування обробників скролу
     */
    setupScrollHandlers() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Обробка скролу сторінки
     */
    handleScroll() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Трекінг глибини скролу
        if (scrollPercent >= 25 && !this.scrollTracked?.['25%']) {
            this.trackScrollDepth('25%');
        } else if (scrollPercent >= 50 && !this.scrollTracked?.['50%']) {
            this.trackScrollDepth('50%');
        } else if (scrollPercent >= 75 && !this.scrollTracked?.['75%']) {
            this.trackScrollDepth('75%');
        } else if (scrollPercent >= 90 && !this.scrollTracked?.['90%']) {
            this.trackScrollDepth('90%');
        }

        // Показ/приховування sticky елементів
        this.handleStickyElements(scrollPercent);
    }

    /**
     * Відстеження глибини скролу
     */
    trackScrollDepth(depth) {
        if (!this.scrollTracked) this.scrollTracked = {};
        this.scrollTracked[depth] = true;

        if (this.modules.analytics) {
            this.modules.analytics.trackEvent('scroll_depth', { depth });
        }
    }

    /**
     * Обробка sticky елементів
     */
    handleStickyElements(scrollPercent) {
        // Можна додати логіку для показу/приховування плаваючих елементів
        if (scrollPercent > 30) {
            // Показати плаваючу кнопку дзвінка
            this.showFloatingButton();
        } else {
            this.hideFloatingButton();
        }
    }

    /**
     * Налаштування обробників кнопок
     */
    setupButtonHandlers() {
        // Кнопки модальних вікон
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal]')) {
                const modalType = e.target.dataset.modal;
                const service = e.target.dataset.service;
                this.openModal(modalType, service);
            }

            // Закриття модального вікна
            if (e.target.matches('.modal__close') || e.target.matches('.modal')) {
                this.closeModal();
            }
        });
    }

    /**
     * Валідація поля форми
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'text':
                if (field.name === 'name') {
                    isValid = this.config.nameRegex.test(value);
                    errorMessage = 'Будь ласка, введіть коректне ім\'я';
                }
                break;

            case 'tel':
                isValid = this.config.phoneRegex.test(value);
                errorMessage = 'Будь ласка, введіть номер у форматі +380XXXXXXXXX';
                break;

            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Будь ласка, введіть коректний email';
                break;
        }

        if (!isValid && value !== '') {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    /**
     * Показати помилку поля
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--primary-red)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--primary-red)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-1)';
        
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Очистити помилку поля
     */
    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Ініціалізація системи модальних вікон
     */
    initModalSystem() {
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modal-body');
        
        // Закриття по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    /**
     * Відкрити модальне вікно
     */
    openModal(type, service = '') {
        if (!this.modal) return;

        let content = '';

        switch (type) {
            case 'consultation':
                content = this.getConsultationModalContent(service);
                break;
            case 'callback':
                content = this.getCallbackModalContent();
                break;
            default:
                content = '<p>Контент модального вікна не знайдено</p>';
        }

        this.modalBody.innerHTML = content;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Налаштування форми в модальному вікні
        const modalForm = this.modalBody.querySelector('form');
        if (modalForm && this.modules.leadCapture) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.modules.leadCapture.handleSubmit(modalForm);
            });
        }
    }

    /**
     * Закрити модальне вікно
     */
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Контент модального вікна консультації
     */
    getConsultationModalContent(service) {
        const services = {
            'vlk-appeal': 'Оскарження рішень ВЛК',
            'medical-expertise': 'Судмедекспертиза',
            'demobilization': 'Демобілізація',
            'military-payments': 'Військові виплати',
            'veteran-status': 'Статус ветерана',
            'rear-transfer': 'Переведення в тил'
        };

        const serviceName = services[service] || 'Загальна консультація';

        return `
            <h3>Безкоштовна консультація</h3>
            <p><strong>Послуга:</strong> ${serviceName}</p>
            <form class="modal-form" data-service="${service}">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Ваше ім'я" required class="form__input">
                </div>
                <div class="form-group">
                    <input type="tel" name="phone" placeholder="+380 XX XXX XX XX" required class="form__input">
                </div>
                <div class="form-group">
                    <textarea name="message" placeholder="Опишіть вашу ситуацію (необов'язково)" class="form__textarea"></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
                    Отримати консультацію
                </button>
                <p style="font-size: var(--font-size-xs); color: var(--neutral-gray); text-align: center; margin-top: var(--spacing-4);">
                    Дзвінок юриста протягом 3 хвилин
                </p>
            </form>
        `;
    }

    /**
     * Контент модального вікна зворотного дзвінка
     */
    getCallbackModalContent() {
        return `
            <h3>Замовити дзвінок</h3>
            <p>Залишіть номер телефону, і наш юрист передзвонить вам протягом 3 хвилин</p>
            <form class="modal-form" data-service="callback">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Ваше ім'я" required class="form__input">
                </div>
                <div class="form-group">
                    <input type="tel" name="phone" placeholder="+380 XX XXX XX XX" required class="form__input">
                </div>
                <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
                    Замовити дзвінок
                </button>
            </form>
        `;
    }

    /**
     * Показати уведомлення
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${icons[type] || icons.info}</span>
                <span class="notification__text">${message}</span>
            </div>
        `;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Автоматичне видалення
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Показати плаваючу кнопку
     */
    showFloatingButton() {
        let floatingBtn = document.getElementById('floating-call-btn');
        
        if (!floatingBtn) {
            floatingBtn = document.createElement('div');
            floatingBtn.id = 'floating-call-btn';
            floatingBtn.innerHTML = `
                <a href="tel:+380671234567" class="floating-btn">
                    <i class="fas fa-phone"></i>
                    <span>Дзвінок</span>
                </a>
            `;
            floatingBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideUp 0.3s ease;
            `;
            
            document.body.appendChild(floatingBtn);
        }
        
        floatingBtn.style.display = 'block';
    }

    /**
     * Приховати плаваючу кнопку
     */
    hideFloatingButton() {
        const floatingBtn = document.getElementById('floating-call-btn');
        if (floatingBtn) {
            floatingBtn.style.display = 'none';
        }
    }

    /**
     * Початкові перевірки
     */
    runInitialChecks() {
        // Перевірка підтримки JavaScript
        document.body.classList.add('js-enabled');
        
        // Перевірка мобільного пристрою
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        }
        
        // Ініціалізація маски для телефонів
        this.initPhoneMask();
        
        // Запуск A/B тестування (якщо потрібно)
        this.initABTesting();
    }

    /**
     * Ініціалізація маски телефону
     */
    initPhoneMask() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value.charAt(0) !== '3') {
                        value = '380' + value;
                    }
                    
                    // Обмеження довжини
                    if (value.length > 12) {
                        value = value.substring(0, 12);
                    }
                    
                    // Форматування
                    let formatted = '+' + value;
                    if (value.length >= 3) {
                        formatted = '+380 ';
                        if (value.length > 3) {
                            const rest = value.substring(3);
                            if (rest.length >= 2) {
                                formatted += '(' + rest.substring(0, 2) + ') ';
                                if (rest.length > 2) {
                                    formatted += rest.substring(2, 5);
                                    if (rest.length > 5) {
                                        formatted += '-' + rest.substring(5, 7);
                                        if (rest.length > 7) {
                                            formatted += '-' + rest.substring(7, 9);
                                        }
                                    }
                                }
                            } else {
                                formatted += rest;
                            }
                        }
                    }
                    
                    e.target.value = formatted;
                }
            });
            
            // Встановлення початкового значення
            if (input.value === '') {
                input.placeholder = '+380 (XX) XXX-XX-XX';
            }
        });
    }

    /**
     * Ініціалізація A/B тестування
     */
    initABTesting() {
        // Простий A/B тест для заголовків
        const testVariant = Math.random() < 0.5 ? 'A' : 'B';
        
        if (testVariant === 'B') {
            // Варіант B - негативний заголовок
            const heroTitle = document.querySelector('.hero__title');
            if (heroTitle) {
                heroTitle.textContent = '❌ 5 критичних помилок, які знищують 90% справ ВЛК';
            }
        }
        
        // Збереження варіанту для аналітики
        if (this.modules.analytics) {
            this.modules.analytics.setCustomDimension('ab_test_variant', testVariant);
        }
    }

    /**
     * Утиліти
     */
    utils = {
        // Дебаунс функції
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Форматування числа
        formatNumber: (num) => {
            return new Intl.NumberFormat('uk-UA').format(num);
        },

        // Перевірка email
        isValidEmail: (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    };
}

// Ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', () => {
    window.siteManager = new SiteManager();
});

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteManager;
}