/**
 * Analytics Module
 * Модуль для відстеження аналітики та поведінки користувачів
 */
class Analytics {
    constructor(siteManager) {
        this.siteManager = siteManager;
        this.config = {
            // Google Analytics
            gaTrackingId: 'GA_MEASUREMENT_ID', // Замінити на реальний ID
            
            // Facebook Pixel
            fbPixelId: 'FB_PIXEL_ID', // Замінити на реальний ID
            
            // Власна аналітика
            apiEndpoint: '/api/analytics',
            
            // Налаштування відстеження
            trackScrollDepth: true,
            trackClicks: true,
            trackFormInteractions: true,
            trackTimeOnPage: true,
            trackUserSession: true
        };
        
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: [],
            events: [],
            scrollDepth: 0,
            maxScrollDepth: 0
        };
        
        this.scrollDepthMarkers = [25, 50, 75, 90];
        this.scrollDepthTracked = {};
        
        this.init();
    }

    /**
     * Ініціалізація модуля аналітики
     */
    init() {
        console.log('📊 Ініціалізація Analytics');
        
        this.setupGoogleAnalytics();
        this.setupFacebookPixel();
        this.setupCustomAnalytics();
        this.setupEventListeners();
        this.trackPageLoad();
        
        // Збереження сесії при закритті
        this.setupSessionPersistence();
    }

    /**
     * Налаштування Google Analytics
     */
    setupGoogleAnalytics() {
        if (typeof gtag === 'undefined') {
            console.warn('⚠️ Google Analytics не завантажено');
            return;
        }

        // Базова конфігурація
        gtag('config', this.config.gaTrackingId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                custom_dimension_1: 'user_type',
                custom_dimension_2: 'lead_source',
                custom_dimension_3: 'ab_test_variant'
            }
        });

        console.log('✅ Google Analytics налаштовано');
    }

    /**
     * Налаштування Facebook Pixel
     */
    setupFacebookPixel() {
        if (typeof fbq === 'undefined') {
            console.warn('⚠️ Facebook Pixel не завантажено');
            return;
        }

        // Відстеження перегляду сторінки
        fbq('track', 'PageView');
        
        console.log('✅ Facebook Pixel налаштовано');
    }

    /**
     * Налаштування власної аналітики
     */
    setupCustomAnalytics() {
        // Ідентифікація користувача
        this.userId = this.getUserId();
        
        // Збір даних про пристрій
        this.deviceData = this.collectDeviceData();
        
        // Збір UTM міток
        this.utmData = this.collectUTMData();
        
        console.log('✅ Власна аналітика налаштована');
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        // Відстеження скролу
        if (this.config.trackScrollDepth) {
            this.setupScrollTracking();
        }

        // Відстеження кликів
        if (this.config.trackClicks) {
            this.setupClickTracking();
        }

        // Відстеження форм
        if (this.config.trackFormInteractions) {
            this.setupFormTracking();
        }

        // Відстеження часу на сторінці
        if (this.config.trackTimeOnPage) {
            this.setupTimeTracking();
        }

        // Відстеження видимості сторінки
        this.setupVisibilityTracking();
    }

    /**
     * Відстеження скролу
     */
    setupScrollTracking() {
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
     * Обробка скролу
     */
    handleScroll() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        this.sessionData.scrollDepth = scrollPercent;
        this.sessionData.maxScrollDepth = Math.max(this.sessionData.maxScrollDepth, scrollPercent);

        // Відстеження проходження маркерів
        this.scrollDepthMarkers.forEach(marker => {
            if (scrollPercent >= marker && !this.scrollDepthTracked[marker]) {
                this.scrollDepthTracked[marker] = true;
                this.trackEvent('scroll_depth', {
                    depth: marker,
                    page: window.location.pathname
                });
            }
        });
    }

    /**
     * Відстеження кликів
     */
    setupClickTracking() {
        document.addEventListener('click', (e) => {
            const element = e.target.closest('a, button, [data-track]');
            if (!element) return;

            this.trackClickEvent(element, e);
        });
    }

    /**
     * Відстеження конкретного кліка
     */
    trackClickEvent(element, event) {
        const data = {
            element_type: element.tagName.toLowerCase(),
            element_text: element.textContent?.trim().substring(0, 100),
            element_id: element.id || null,
            element_class: element.className || null,
            position_x: event.clientX,
            position_y: event.clientY
        };

        // Специфічні типи елементів
        if (element.href) {
            data.link_url = element.href;
            
            if (element.href.startsWith('tel:')) {
                data.phone = element.href.replace('tel:', '');
                this.trackEvent('phone_click', data);
            } else if (element.href.startsWith('mailto:')) {
                data.email = element.href.replace('mailto:', '');
                this.trackEvent('email_click', data);
            } else if (element.href.startsWith('http')) {
                data.is_external = !element.href.includes(window.location.hostname);
                this.trackEvent('link_click', data);
            }
        } else if (element.type === 'submit') {
            data.form_id = element.closest('form')?.id || 'unnamed';
            this.trackEvent('form_submit_click', data);
        } else if (element.dataset.track) {
            this.trackEvent(element.dataset.track, data);
        } else {
            this.trackEvent('element_click', data);
        }
    }

    /**
     * Відстеження форм
     */
    setupFormTracking() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            const formId = form.id || `form_${index}`;
            
            // Початок взаємодії з формою
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.trackEvent('form_interaction_start', {
                        form_id: formId,
                        field_name: e.target.name || e.target.type,
                        field_type: e.target.type || e.target.tagName.toLowerCase()
                    });
                }
            }, { once: true });

            // Відстеження полів
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                // Фокус на поле
                field.addEventListener('focus', () => {
                    this.trackEvent('form_field_focus', {
                        form_id: formId,
                        field_name: field.name || field.type,
                        field_type: field.type || field.tagName.toLowerCase()
                    });
                });

                // Помилки валідації
                field.addEventListener('invalid', () => {
                    this.trackEvent('form_validation_error', {
                        form_id: formId,
                        field_name: field.name || field.type,
                        validation_message: field.validationMessage
                    });
                });
            });

            // Відправка форми
            form.addEventListener('submit', () => {
                this.trackEvent('form_submit', {
                    form_id: formId,
                    fields_count: fields.length,
                    service: form.dataset.service || 'unknown'
                });
            });
        });
    }

    /**
     * Відстеження часу на сторінці
     */
    setupTimeTracking() {
        // Відправляємо час кожні 30 секунд
        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
            
            this.trackEvent('time_on_page_interval', {
                seconds: timeOnPage,
                page: window.location.pathname,
                is_active: !document.hidden
            });
        }, 30000);

        // Відстеження при закритті
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
            
            this.trackEvent('page_unload', {
                time_on_page: timeOnPage,
                max_scroll_depth: this.sessionData.maxScrollDepth
            });
        });
    }

    /**
     * Відстеження видимості сторінки
     */
    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            const eventType = document.hidden ? 'page_hidden' : 'page_visible';
            
            this.trackEvent(eventType, {
                timestamp: Date.now(),
                page: window.location.pathname
            });
        });
    }

    /**
     * Відстеження завантаження сторінки
     */
    trackPageLoad() {
        const pageData = {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            load_time: Date.now() - this.sessionData.startTime,
            ...this.utmData,
            ...this.deviceData
        };

        this.sessionData.pageViews.push(pageData);
        this.trackEvent('page_view', pageData);

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: pageData.title,
                page_location: window.location.href,
                page_referrer: pageData.referrer
            });
        }

        console.log('📄 Перегляд сторінки відстежено:', pageData);
    }

    /**
     * Основна функція відстеження події
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            session_id: this.sessionData.sessionId,
            user_id: this.userId,
            page: window.location.pathname,
            ...eventData
        };

        // Додаємо в сесію
        this.sessionData.events.push(event);

        // Відправляємо в Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: event.category || 'User Interaction',
                event_label: event.label || eventName,
                value: event.value || 1,
                custom_parameter_1: event.custom_1,
                custom_parameter_2: event.custom_2
            });
        }

        // Відправляємо у Facebook
        this.trackFacebookEvent(eventName, eventData);

        // Відправляємо у власну аналітику
        this.sendToCustomAnalytics(event);

        console.log('📊 Подія відстежена:', eventName, eventData);
    }

    /**
     * Відстеження подій Facebook
     */
    trackFacebookEvent(eventName, eventData) {
        if (typeof fbq === 'undefined') return;

        const fbEvents = {
            'lead_conversion': 'Lead',
            'phone_click': 'Contact',
            'form_submit': 'SubmitApplication',
            'calculator_calculation': 'CustomizeProduct',
            'page_view': 'ViewContent'
        };

        const fbEventName = fbEvents[eventName];
        if (fbEventName) {
            fbq('track', fbEventName, {
                content_name: eventData.service || eventData.page || eventName,
                content_category: 'Legal Services',
                value: eventData.value || eventData.total_amount || 1,
                currency: 'UAH'
            });
        }
    }

    /**
     * Відправка у власну аналітику
     */
    async sendToCustomAnalytics(event) {
        try {
            // Збираємо події в пакети для ефективності
            if (!this.eventQueue) {
                this.eventQueue = [];
            }

            this.eventQueue.push(event);

            // Відправляємо пакет кожні 10 подій або кожні 30 секунд
            if (this.eventQueue.length >= 10) {
                await this.flushEventQueue();
            } else if (!this.flushTimer) {
                this.flushTimer = setTimeout(() => {
                    this.flushEventQueue();
                }, 30000);
            }

        } catch (error) {
            console.warn('⚠️ Не вдалося відправити аналітику:', error);
        }
    }

    /**
     * Відправка накопичених подій
     */
    async flushEventQueue() {
        if (!this.eventQueue || this.eventQueue.length === 0) return;

        try {
            const events = [...this.eventQueue];
            this.eventQueue = [];
            
            if (this.flushTimer) {
                clearTimeout(this.flushTimer);
                this.flushTimer = null;
            }

            await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events,
                    session: this.sessionData
                })
            });

            console.log('📤 Відправлено подій в аналітику:', events.length);

        } catch (error) {
            console.warn('⚠️ Помилка відправки аналітики:', error);
            // Повертаємо події в чергу для повторної спроби
            this.eventQueue = [...events, ...this.eventQueue];
        }
    }

    /**
     * Встановлення користувацького виміру
     */
    setCustomDimension(name, value) {
        if (typeof gtag !== 'undefined') {
            gtag('config', this.config.gaTrackingId, {
                custom_map: { [name]: value }
            });
        }

        // Зберігаємо в сесії
        if (!this.sessionData.customDimensions) {
            this.sessionData.customDimensions = {};
        }
        this.sessionData.customDimensions[name] = value;
    }

    /**
     * Відстеження конверсії
     */
    trackConversion(conversionData) {
        this.trackEvent('conversion', {
            conversion_type: conversionData.type || 'lead',
            conversion_value: conversionData.value || 1,
            conversion_currency: 'UAH',
            ...conversionData
        });

        // Google Ads конверсія
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Замінити на реальні значення
                value: conversionData.value || 1,
                currency: 'UAH'
            });
        }

        // Facebook конверсія
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: conversionData.value || 1,
                currency: 'UAH'
            });
        }
    }

    /**
     * Збір даних про пристрій
     */
    collectDeviceData() {
        return {
            user_agent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            color_depth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine,
            cookies_enabled: navigator.cookieEnabled,
            device_type: this.getDeviceType(),
            browser: this.getBrowserName(),
            os: this.getOperatingSystem()
        };
    }

    /**
     * Визначення типу пристрою
     */
    getDeviceType() {
        const ua = navigator.userAgent;
        
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            return 'tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    }

    /**
     * Визначення браузера
     */
    getBrowserName() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera')) return 'Opera';
        
        return 'Unknown';
    }

    /**
     * Визначення операційної системи
     */
    getOperatingSystem() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'MacOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        
        return 'Unknown';
    }

    /**
     * Збір UTM міток
     */
    collectUTMData() {
        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_content: urlParams.get('utm_content') || '',
            utm_term: urlParams.get('utm_term') || '',
            gclid: urlParams.get('gclid') || '', // Google Ads
            fbclid: urlParams.get('fbclid') || '' // Facebook Ads
        };
    }

    /**
     * Генерація ID сесії
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Отримання ID користувача
     */
    getUserId() {
        let userId = localStorage.getItem('user_id');
        
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        
        return userId;
    }

    /**
     * Налаштування збереження сесії
     */
    setupSessionPersistence() {
        // Збереження при закритті
        window.addEventListener('beforeunload', () => {
            this.saveSession();
            this.flushEventQueue();
        });

        // Збереження кожні 30 секунд
        setInterval(() => {
            this.saveSession();
        }, 30000);
    }

    /**
     * Збереження сесії
     */
    saveSession() {
        try {
            sessionStorage.setItem('analytics_session', JSON.stringify(this.sessionData));
        } catch (error) {
            console.warn('⚠️ Не вдалося зберегти сесію:', error);
        }
    }

    /**
     * Завантаження сесії
     */
    loadSession() {
        try {
            const savedSession = sessionStorage.getItem('analytics_session');
            if (savedSession) {
                const sessionData = JSON.parse(savedSession);
                
                // Продовжуємо сесію, якщо вона не застара (менше 30 хвилин)
                if (Date.now() - sessionData.startTime < 30 * 60 * 1000) {
                    this.sessionData = { ...this.sessionData, ...sessionData };
                }
            }
        } catch (error) {
            console.warn('⚠️ Не вдалося завантажити сесію:', error);
        }
    }

    /**
     * Отримання статистики сесії
     */
    getSessionStats() {
        return {
            sessionId: this.sessionData.sessionId,
            duration: Date.now() - this.sessionData.startTime,
            pageViews: this.sessionData.pageViews.length,
            events: this.sessionData.events.length,
            maxScrollDepth: this.sessionData.maxScrollDepth,
            device: this.deviceData.device_type,
            browser: this.deviceData.browser
        };
    }

    /**
     * Знищення модуля
     */
    destroy() {
        // Зберігаємо дані
        this.saveSession();
        this.flushEventQueue();
        
        // Очищуємо таймери
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
        }
        
        console.log('💀 Analytics модуль знищено');
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}