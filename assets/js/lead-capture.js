/**
 * Lead Capture Module
 * Модуль для захоплення та обробки лідів
 */
class LeadCapture {
    constructor(siteManager) {
        this.siteManager = siteManager;
        this.config = {
            apiEndpoint: '/api/leads',
            telegram: {
                botToken: 'YOUR_BOT_TOKEN',
                chatId: 'YOUR_CHAT_ID'
            },
            leadSources: {
                '/': 'Головна сторінка',
                '/services/vlk-appeal/': 'Оскарження ВЛК',
                '/tools/payment-calculator/': 'Калькулятор виплат'
            }
        };
        
        this.leadCounter = this.getLeadCounter();
        this.init();
    }

    /**
     * Ініціалізація модуля
     */
    init() {
        console.log('📝 Ініціалізація LeadCapture');
        this.setupEventListeners();
        this.trackPageView();
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        // Відстеження взаємодії з формами
        this.trackFormInteractions();
        
        // Відстеження кликів
        this.trackClicks();
        
        // Відстеження часу на сторінці
        this.trackTimeOnPage();
    }

    /**
     * Основний обробник подання форми
     */
    async handleSubmit(form) {
        console.log('📨 Обробка подання форми:', form);

        // Показуємо індикатор завантаження
        const submitButton = form.querySelector('button[type="submit"]');
        this.setButtonLoading(submitButton, true);

        try {
            // Збираємо дані форми
            const formData = new FormData(form);
            const leadData = this.collectLeadData(formData, form);

            // Валідуємо дані
            const validation = this.validateLeadData(leadData);
            if (!validation.isValid) {
                this.showValidationErrors(form, validation.errors);
                return;
            }

            // Відправляємо ліда
            const response = await this.submitLead(leadData);
            
            if (response.success) {
                this.handleSuccessfulSubmission(form, leadData);
            } else {
                this.handleFailedSubmission(form, response.error);
            }

        } catch (error) {
            console.error('❌ Помилка при обробці форми:', error);
            this.handleFailedSubmission(form, 'Технічна помилка. Спробуйте пізніше або зателефонуйте нам.');
        } finally {
            this.setButtonLoading(submitButton, false);
        }
    }

    /**
     * Збір даних ліда
     */
    collectLeadData(formData, form) {
        const data = {
            name: formData.get('name')?.trim(),
            phone: formData.get('phone')?.trim(),
            email: formData.get('email')?.trim(),
            message: formData.get('message')?.trim(),
            service: formData.get('service') || form.dataset.service || 'general',
            
            // Мета-дані
            source: this.getLeadSource(),
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            
            // UTM мітки
            utm_source: this.getUTMParam('utm_source'),
            utm_medium: this.getUTMParam('utm_medium'),
            utm_campaign: this.getUTMParam('utm_campaign'),
            utm_content: this.getUTMParam('utm_content'),
            utm_term: this.getUTMParam('utm_term'),
            
            // Час та дата
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // Номер ліда
            lead_number: this.generateLeadNumber()
        };

        return data;
    }

    /**
     * Валідація даних ліда
     */
    validateLeadData(data) {
        const errors = {};

        // Перевірка імені
        if (!data.name || data.name.length < 2) {
            errors.name = 'Будь ласка, введіть коректне ім\'я';
        }

        // Перевірка телефону
        if (!data.phone || !/^\+380\d{9}$/.test(data.phone.replace(/\D/g, '').replace(/^380/, '+380'))) {
            errors.phone = 'Будь ласка, введіть коректний номер телефону';
        }

        // Перевірка email (якщо вказано)
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Будь ласка, введіть коректний email';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Відправка ліда на сервер
     */
    async submitLead(leadData) {
        console.log('🚀 Відправка ліда:', leadData);

        try {
            // Відправка на власний API
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(leadData)
            });

            let result;
            
            if (response.ok) {
                result = await response.json();
            } else {
                // Якщо API не працює, зберігаємо локально
                result = await this.handleOfflineSubmission(leadData);
            }

            // Відправляємо в Telegram (паралельно)
            this.sendToTelegram(leadData).catch(error => {
                console.warn('⚠️ Не вдалося відправити в Telegram:', error);
            });

            // Трекінг конверсії
            this.trackConversion(leadData);

            return result;

        } catch (error) {
            console.error('❌ Помилка відправки ліда:', error);
            
            // Резервний метод - збереження в localStorage
            return await this.handleOfflineSubmission(leadData);
        }
    }

    /**
     * Обробка офлайн подання
     */
    async handleOfflineSubmission(leadData) {
        try {
            // Зберігаємо в localStorage для відправки пізніше
            const offlineLeads = JSON.parse(localStorage.getItem('offline_leads') || '[]');
            offlineLeads.push(leadData);
            localStorage.setItem('offline_leads', JSON.stringify(offlineLeads));

            // Відправляємо хоча б в Telegram
            await this.sendToTelegram(leadData);

            return {
                success: true,
                message: 'Заявку отримано! Зв\'яжемося з вами найближчим часом.',
                offline: true
            };
        } catch (error) {
            return {
                success: false,
                error: 'Помилка відправки. Будь ласка, зателефонуйте нам: +380 (67) 123-45-67'
            };
        }
    }

    /**
     * Відправка в Telegram
     */
    async sendToTelegram(leadData) {
        if (!this.config.telegram.botToken || !this.config.telegram.chatId) {
            console.warn('⚠️ Telegram конфігурація не налаштована');
            return;
        }

        const message = this.formatTelegramMessage(leadData);
        
        const telegramAPI = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
        
        await fetch(telegramAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: this.config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    }

    /**
     * Форматування повідомлення для Telegram
     */
    formatTelegramMessage(leadData) {
        const serviceNames = {
            'vlk-appeal': '⚖️ Оскарження ВЛК',
            'medical-expertise': '🏥 Судмедекспертиза',
            'demobilization': '🎖️ Демобілізація',
            'military-payments': '💰 Військові виплати',
            'veteran-status': '🏅 Статус ветерана',
            'rear-transfer': '🔄 Переведення в тил',
            'general': '📞 Загальна консультація',
            'callback': '☎️ Зворотний дзвінок'
        };

        return `
🚨 <b>НОВИЙ ЛІД!</b>

👤 <b>Ім'я:</b> ${leadData.name}
📞 <b>Телефон:</b> ${leadData.phone}
${leadData.email ? `📧 <b>Email:</b> ${leadData.email}` : ''}

🎯 <b>Послуга:</b> ${serviceNames[leadData.service] || leadData.service}
${leadData.message ? `💬 <b>Повідомлення:</b> ${leadData.message}` : ''}

📊 <b>Джерело:</b> ${leadData.source}
🌐 <b>Сторінка:</b> ${leadData.page_url}
${leadData.utm_source ? `📈 <b>UTM Source:</b> ${leadData.utm_source}` : ''}

🕐 <b>Час:</b> ${new Date(leadData.timestamp).toLocaleString('uk-UA')}
🆔 <b>№ Заявки:</b> ${leadData.lead_number}

<b>⏰ ДЗВОНИТИ ПРОТЯГОМ 3 ХВИЛИН!</b>
        `.trim();
    }

    /**
     * Обробка успішного подання
     */
    handleSuccessfulSubmission(form, leadData) {
        console.log('✅ Ліда успішно відправлено:', leadData);

        // Збільшуємо лічильник
        this.incrementLeadCounter();

        // Показуємо повідомлення про успіх
        this.showSuccessMessage(form);

        // Очищуємо форму
        form.reset();

        // Закриваємо модальне вікно (якщо форма в модальному вікні)
        if (this.siteManager.modal && this.siteManager.modal.style.display === 'block') {
            setTimeout(() => {
                this.siteManager.closeModal();
            }, 3000);
        }

        // Показуємо уведомлення
        this.siteManager.showNotification(
            '🎉 Заявку відправлено! Дзвінок протягом 3 хвилин.',
            'success',
            10000
        );

        // Оновлюємо статистику на сторінці
        this.updatePageStats();
    }

    /**
     * Обробка неуспішного подання
     */
    handleFailedSubmission(form, errorMessage) {
        console.error('❌ Помилка відправки ліда:', errorMessage);

        // Показуємо повідомлення про помилку
        this.showErrorMessage(form, errorMessage);

        // Показуємо уведомлення
        this.siteManager.showNotification(
            '❌ ' + errorMessage,
            'error'
        );
    }

    /**
     * Показати повідомлення про успіх
     */
    showSuccessMessage(form) {
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const message = document.createElement('div');
        message.className = 'form-message form-message--success';
        message.innerHTML = `
            <div style="
                background: #F0FDF4;
                border: 1px solid #BBF7D0;
                color: var(--success-green);
                padding: var(--spacing-4);
                border-radius: var(--radius-lg);
                margin-top: var(--spacing-4);
                text-align: center;
            ">
                <i class="fas fa-check-circle" style="margin-right: var(--spacing-2);"></i>
                <strong>Заявку відправлено!</strong><br>
                Наш юрист передзвонить вам протягом 3 хвилин.
            </div>
        `;

        form.appendChild(message);
    }

    /**
     * Показати повідомлення про помилку
     */
    showErrorMessage(form, errorText) {
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const message = document.createElement('div');
        message.className = 'form-message form-message--error';
        message.innerHTML = `
            <div style="
                background: #FEF2F2;
                border: 1px solid #FECACA;
                color: var(--primary-red);
                padding: var(--spacing-4);
                border-radius: var(--radius-lg);
                margin-top: var(--spacing-4);
                text-align: center;
            ">
                <i class="fas fa-exclamation-circle" style="margin-right: var(--spacing-2);"></i>
                <strong>Помилка:</strong> ${errorText}<br>
                <small>Або зателефонуйте: <a href="tel:+380671234567" style="color: inherit;">+380 (67) 123-45-67</a></small>
            </div>
        `;

        form.appendChild(message);
    }

    /**
     * Показати помилки валідації
     */
    showValidationErrors(form, errors) {
        // Очищуємо попередні помилки
        form.querySelectorAll('.field-error').forEach(error => error.remove());

        // Показуємо нові помилки
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.siteManager.showFieldError(field, errors[fieldName]);
            }
        });
    }

    /**
     * Встановити стан завантаження кнопки
     */
    setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.classList.add('btn--loading');
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Відправляємо...';
        } else {
            button.classList.remove('btn--loading');
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    /**
     * Трекінг конверсії
     */
    trackConversion(leadData) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                event_category: 'Lead',
                event_label: leadData.service,
                value: 1
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: leadData.service,
                content_category: 'Legal Services'
            });
        }

        // Власна аналітика
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('lead_conversion', {
                service: leadData.service,
                source: leadData.source,
                lead_number: leadData.lead_number
            });
        }
    }

    /**
     * Відстеження взаємодії з формами
     */
    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Фокус на полі
                input.addEventListener('focus', () => {
                    if (this.siteManager.modules.analytics) {
                        this.siteManager.modules.analytics.trackEvent('form_field_focus', {
                            field_name: input.name || input.type,
                            form_id: form.id || 'unnamed'
                        });
                    }
                });

                // Початок введення
                let hasStartedTyping = false;
                input.addEventListener('input', () => {
                    if (!hasStartedTyping) {
                        hasStartedTyping = true;
                        if (this.siteManager.modules.analytics) {
                            this.siteManager.modules.analytics.trackEvent('form_field_interaction', {
                                field_name: input.name || input.type,
                                form_id: form.id || 'unnamed'
                            });
                        }
                    }
                });
            });
        });
    }

    /**
     * Відстеження кликів
     */
    trackClicks() {
        document.addEventListener('click', (e) => {
            const element = e.target.closest('a, button, [data-track]');
            if (!element) return;

            let eventName = 'click';
            let eventData = {
                element_type: element.tagName.toLowerCase(),
                element_text: element.textContent.trim().substring(0, 100)
            };

            // Специфічні типи кликів
            if (element.href && element.href.startsWith('tel:')) {
                eventName = 'phone_click';
                eventData.phone = element.href.replace('tel:', '');
            } else if (element.href && element.href.startsWith('mailto:')) {
                eventName = 'email_click';
                eventData.email = element.href.replace('mailto:', '');
            } else if (element.dataset.track) {
                eventName = element.dataset.track;
            }

            if (this.siteManager.modules.analytics) {
                this.siteManager.modules.analytics.trackEvent(eventName, eventData);
            }
        });
    }

    /**
     * Відстеження часу на сторінці
     */
    trackTimeOnPage() {
        this.pageStartTime = Date.now();
        
        // Відправляємо час кожні 30 секунд
        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
            
            if (this.siteManager.modules.analytics) {
                this.siteManager.modules.analytics.trackEvent('time_on_page', {
                    seconds: timeOnPage,
                    page: window.location.pathname
                });
            }
        }, 30000);
    }

    /**
     * Відстеження перегляду сторінки
     */
    trackPageView() {
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('page_view', {
                page: window.location.pathname,
                title: document.title,
                referrer: document.referrer
            });
        }
    }

    /**
     * Утилітарні методи
     */
    getUTMParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }

    getLeadSource() {
        const path = window.location.pathname;
        return this.config.leadSources[path] || 'Інша сторінка';
    }

    generateLeadNumber() {
        const today = new Date();
        const dateStr = today.getFullYear().toString().substr(-2) + 
                       String(today.getMonth() + 1).padStart(2, '0') + 
                       String(today.getDate()).padStart(2, '0');
        
        const counter = String(this.leadCounter + 1).padStart(3, '0');
        return `LD${dateStr}${counter}`;
    }

    getLeadCounter() {
        return parseInt(localStorage.getItem('lead_counter') || '0');
    }

    incrementLeadCounter() {
        this.leadCounter++;
        localStorage.setItem('lead_counter', this.leadCounter.toString());
    }

    updatePageStats() {
        // Оновлюємо лічильник онлайн користувачів
        const onlineCount = document.getElementById('online-count');
        if (onlineCount) {
            const current = parseInt(onlineCount.textContent);
            onlineCount.textContent = Math.min(current + 1, 99);
        }

        // Оновлюємо кількість місць
        const spotsLeft = document.getElementById('spots-left');
        if (spotsLeft) {
            const current = parseInt(spotsLeft.textContent);
            spotsLeft.textContent = Math.max(current - 1, 1);
        }
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeadCapture;
}