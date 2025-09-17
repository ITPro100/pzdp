/**
 * Live Notifications Module
 * Модуль живих уведомлень для створення соціального доказу
 */
class LiveNotifications {
    constructor(siteManager) {
        this.siteManager = siteManager;
        this.container = document.getElementById('notification-container');
        this.config = {
            interval: 45000, // 45 секунд між уведомленнями
            displayDuration: 8000, // 8 секунд показу
            maxNotifications: 3,
            pauseOnHover: true
        };
        
        this.notifications = [
            {
                type: 'success',
                icon: '🎉',
                messages: [
                    'Олександр з Києва отримав звільнення за станом здоров\'я',
                    'Марина успішно оскаржила рішення ВЛК у Дніпрі',
                    'Андрій виграв справу про військові виплати',
                    'Сергій отримав статус ветерана за 2 тижні',
                    'Наталія завершила процес демобілізації',
                    'Володимир отримав компенсацію за поранення',
                    'Ігор успішно перевівся в тил',
                    'Оксана отримала всі належні виплати'
                ]
            },
            {
                type: 'consultation',
                icon: '📞',
                messages: [
                    'Марина замовила консультацію щодо ВЛК',
                    'Дмитро отримав безкоштовну консультацію',
                    'Анна записалася на судмедекспертизу',
                    'Віктор замовив розрахунок виплат',
                    'Тетяна отримала правову допомогу',
                    'Максим записався на консультацію юриста'
                ]
            },
            {
                type: 'activity',
                icon: '👥',
                messages: [
                    'На сайті зараз 23 військових',
                    'Сьогодні +12 позитивних рішень',
                    'Цього тижня допомогли 47 військовим',
                    'Загалом виграли 1000+ справ'
                ]
            }
        ];
        
        this.activeNotifications = [];
        this.isPaused = false;
        this.intervalId = null;
        
        this.init();
    }

    /**
     * Ініціалізація модуля
     */
    init() {
        console.log('🔔 Ініціалізація LiveNotifications');
        
        if (!this.container) {
            console.warn('⚠️ Контейнер для уведомлень не знайдено');
            return;
        }

        this.setupEventListeners();
        this.startNotifications();
        
        // Показуємо перше уведомлення через 10 секунд
        setTimeout(() => {
            this.showRandomNotification();
        }, 10000);
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        // Пауза при наведенні на контейнер
        if (this.config.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => {
                this.pauseNotifications();
            });

            this.container.addEventListener('mouseleave', () => {
                this.resumeNotifications();
            });
        }

        // Пауза коли вкладка не активна
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNotifications();
            } else {
                this.resumeNotifications();
            }
        });

        // Пауза при скролі (щоб не відвертати увагу)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.pauseNotifications();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.resumeNotifications();
            }, 2000);
        });
    }

    /**
     * Запуск системи уведомлень
     */
    startNotifications() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.showRandomNotification();
            }
        }, this.config.interval);

        console.log('▶️ Живі уведомлення запущені');
    }

    /**
     * Зупинка уведомлень
     */
    stopNotifications() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('⏸️ Живі уведомлення зупинені');
    }

    /**
     * Пауза уведомлень
     */
    pauseNotifications() {
        this.isPaused = true;
    }

    /**
     * Відновлення уведомлень
     */
    resumeNotifications() {
        this.isPaused = false;
    }

    /**
     * Показати випадкове уведомлення
     */
    showRandomNotification() {
        // Перевіряємо ліміт активних уведомлень
        if (this.activeNotifications.length >= this.config.maxNotifications) {
            return;
        }

        // Вибираємо випадковий тип уведомлення
        const randomType = this.notifications[Math.floor(Math.random() * this.notifications.length)];
        
        // Вибираємо випадкове повідомлення з типу
        const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
        
        // Створюємо уведомлення
        this.showNotification({
            type: randomType.type,
            icon: randomType.icon,
            message: randomMessage,
            duration: this.config.displayDuration
        });
    }

    /**
     * Показати конкретне уведомлення
     */
    showNotification({ type, icon, message, duration = 5000, persistent = false }) {
        const notification = this.createNotificationElement({
            type,
            icon,
            message,
            persistent
        });

        // Додаємо в контейнер з анімацією
        this.container.appendChild(notification);
        this.activeNotifications.push(notification);

        // Анімація появи
        requestAnimationFrame(() => {
            notification.classList.add('notification--visible');
        });

        // Автоматичне видалення (якщо не persistent)
        if (!persistent) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }

        // Трекінг показу уведомлення
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('notification_shown', {
                type,
                message: message.substring(0, 50)
            });
        }

        return notification;
    }

    /**
     * Створення елемента уведомлення
     */
    createNotificationElement({ type, icon, message, persistent }) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Додаємо клас для persistent уведомлень
        if (persistent) {
            notification.classList.add('notification--persistent');
        }

        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${icon}</span>
                <span class="notification__text">${message}</span>
                ${persistent ? '<button class="notification__close" aria-label="Закрити">×</button>' : ''}
            </div>
            <div class="notification__progress"></div>
        `;

        // Додаємо стилі
        this.styleNotification(notification, type);

        // Обробник закриття для persistent уведомлень
        if (persistent) {
            const closeBtn = notification.querySelector('.notification__close');
            closeBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }

        // Обробник кліка на уведомлення
        notification.addEventListener('click', (e) => {
            if (e.target.classList.contains('notification__close')) return;
            
            this.handleNotificationClick(notification, type, message);
        });

        return notification;
    }

    /**
     * Стилізація уведомлення
     */
    styleNotification(notification, type) {
        const baseStyles = `
            position: relative;
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--spacing-4);
            margin-bottom: var(--spacing-3);
            cursor: pointer;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 350px;
            border-left: 4px solid;
        `;

        const typeStyles = {
            success: 'border-left-color: var(--success-green);',
            consultation: 'border-left-color: var(--primary-blue);',
            activity: 'border-left-color: var(--warning-orange);',
            error: 'border-left-color: var(--primary-red);'
        };

        notification.style.cssText = baseStyles + (typeStyles[type] || typeStyles.activity);

        // Стилі для контенту
        const content = notification.querySelector('.notification__content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
        `;

        const icon = notification.querySelector('.notification__icon');
        icon.style.cssText = `
            font-size: var(--font-size-lg);
            flex-shrink: 0;
        `;

        const text = notification.querySelector('.notification__text');
        text.style.cssText = `
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            color: var(--dark-gray);
        `;

        // Прогрес-бар
        const progress = notification.querySelector('.notification__progress');
        progress.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${this.getProgressColor(type)};
            width: 0%;
            transition: width linear;
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        `;

        // Кнопка закриття (для persistent)
        const closeBtn = notification.querySelector('.notification__close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                color: var(--neutral-gray);
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            `;
        }
    }

    /**
     * Отримати колір прогрес-бару
     */
    getProgressColor(type) {
        const colors = {
            success: 'var(--success-green)',
            consultation: 'var(--primary-blue)',
            activity: 'var(--warning-orange)',
            error: 'var(--primary-red)'
        };
        
        return colors[type] || colors.activity;
    }

    /**
     * Показати уведомлення (додати клас для анімації)
     */
    showNotificationAnimation(notification) {
        // Клас для показу
        const visibleClass = 'notification--visible';
        
        // CSS для анімації (додається динамічно)
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification--visible {
                    transform: translateX(0) !important;
                    opacity: 1 !important;
                }
                
                .notification--hiding {
                    transform: translateX(100%) !important;
                    opacity: 0 !important;
                }
            `;
            document.head.appendChild(style);
        }

        notification.classList.add(visibleClass);
    }

    /**
     * Приховати уведомлення
     */
    hideNotification(notification) {
        if (!notification || !notification.parentNode) return;

        // Анімація зникнення
        notification.classList.add('notification--hiding');
        
        // Зупиняємо прогрес-бар
        const progress = notification.querySelector('.notification__progress');
        if (progress) {
            progress.style.animationPlayState = 'paused';
        }

        // Видаляємо після анімації
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            
            // Видаляємо з активних
            const index = this.activeNotifications.indexOf(notification);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Обробка кліка на уведомлення
     */
    handleNotificationClick(notification, type, message) {
        // Трекінг кліка
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('notification_clicked', {
                type,
                message: message.substring(0, 50)
            });
        }

        // Дії залежно від типу
        switch (type) {
            case 'consultation':
                // Відкриваємо форму консультації
                this.siteManager.openModal('consultation');
                break;
                
            case 'success':
                // Показуємо більше відгуків або відкриваємо форму
                this.siteManager.openModal('consultation');
                break;
                
            case 'activity':
                // Скролимо до форми
                this.scrollToForm();
                break;
        }

        // Приховуємо уведомлення після кліка
        this.hideNotification(notification);
    }

    /**
     * Скрол до найближчої форми
     */
    scrollToForm() {
        const form = document.querySelector('.lead-form, .contact-form');
        if (form) {
            form.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Підсвічуємо форму
            form.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.3)';
            setTimeout(() => {
                form.style.boxShadow = '';
            }, 2000);
        }
    }

    /**
     * Додати власне уведомлення ззовні
     */
    addCustomNotification(notification) {
        return this.showNotification({
            type: notification.type || 'activity',
            icon: notification.icon || '📢',
            message: notification.message,
            duration: notification.duration || this.config.displayDuration,
            persistent: notification.persistent || false
        });
    }

    /**
     * Показати уведомлення про новий ліда
     */
    showLeadNotification(leadData) {
        const messages = [
            `${leadData.name} замовив консультацію`,
            `Нова заявка від ${leadData.name}`,
            `${leadData.name} записався на консультацію`
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        return this.showNotification({
            type: 'consultation',
            icon: '📞',
            message,
            duration: 10000
        });
    }

    /**
     * Показати уведомлення про успішну справу
     */
    showSuccessNotification(clientName, service) {
        const serviceMessages = {
            'vlk-appeal': 'успішно оскаржив рішення ВЛК',
            'demobilization': 'отримав демобілізацію',
            'military-payments': 'отримав військові виплати',
            'medical-expertise': 'пройшов судмедекспертизу'
        };

        const action = serviceMessages[service] || 'отримав правову допомогу';
        const message = `${clientName} ${action}`;

        return this.showNotification({
            type: 'success',
            icon: '🎉',
            message,
            duration: this.config.displayDuration
        });
    }

    /**
     * Очистити всі уведомлення
     */
    clearAllNotifications() {
        this.activeNotifications.forEach(notification => {
            this.hideNotification(notification);
        });
    }

    /**
     * Отримати статистику уведомлень
     */
    getStats() {
        return {
            active: this.activeNotifications.length,
            isPaused: this.isPaused,
            interval: this.config.interval
        };
    }

    /**
     * Оновити конфігурацію
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Перезапускаємо з новими налаштуваннями
        this.stopNotifications();
        this.startNotifications();
    }

    /**
     * Знищення модуля
     */
    destroy() {
        this.stopNotifications();
        this.clearAllNotifications();
        
        // Видаляємо обробники подій
        if (this.container) {
            this.container.removeEventListener('mouseenter', this.pauseNotifications);
            this.container.removeEventListener('mouseleave', this.resumeNotifications);
        }
        
        document.removeEventListener('visibilitychange', this.pauseNotifications);
        
        console.log('💀 LiveNotifications знищено');
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiveNotifications;
}