/**
 * Testimonials Component
 * Компонент для відображення та керування відгуками клієнтів
 */
class Testimonials {
    constructor(siteManager) {
        this.siteManager = siteManager;
        this.container = document.querySelector('.testimonials');
        this.config = {
            autoRotate: true,
            rotationInterval: 8000,
            animationDuration: 500
        };
        
        this.testimonials = [
            {
                id: 1,
                name: 'Олександр К.',
                service: 'Оскарження ВЛК',
                location: 'Київ',
                rating: 5,
                text: 'Вражений швидкістю! 3 дні - і рішення ВЛК оскаржено. Професійний підхід та постійна підтримка. Рекомендую всім військовим!',
                date: '2024-01-15',
                verified: true,
                result: 'Рішення ВЛК оскаржено, отримано демобілізацію'
            },
            {
                id: 2,
                name: 'Марина С.',
                service: 'Судмедекспертиза',
                location: 'Дніпро',
                rating: 5,
                text: 'Власна судмедекспертиза - це дуже круто! Не треба бігати по різних установах. Все в одному місці, швидко та якісно.',
                date: '2024-01-10',
                verified: true,
                result: 'Отримано висновок експерта для суду'
            },
            {
                id: 3,
                name: 'Андрій М.',
                service: 'Військові виплати',
                location: 'Харків',
                rating: 5,
                text: 'Допомогли отримати 180 тисяч гривень заборгованості. Думав, що нічого не вийде, але юристи знайшли спосіб!',
                date: '2024-01-05',
                verified: true,
                result: 'Стягнено 180 000 грн заборгованості'
            },
            {
                id: 4,
                name: 'Сергій В.',
                service: 'Статус ветерана',
                location: 'Одеса',
                rating: 5,
                text: 'За 2 тижні оформили статус ветерана. Тепер маю всі пільги. Дякую за професійну роботу!',
                date: '2023-12-28',
                verified: true,
                result: 'Оформлено статус учасника бойових дій'
            },
            {
                id: 5,
                name: 'Наталія Г.',
                service: 'Демобілізація',
                location: 'Львів',
                rating: 5,
                text: 'Складна ситуація з демобілізацією за сімейними обставинами. Юристи знайшли вихід та все оформили правильно.',
                date: '2023-12-20',
                verified: true,
                result: 'Оформлена демобілізація за сімейними обставинами'
            },
            {
                id: 6,
                name: 'Володимир П.',
                service: 'Переведення в тил',
                location: 'Запоріжжя',
                rating: 5,
                text: 'Після поранення потрібно було переведення. Швидко та ефективно вирішили питання. Професіонали своєї справи!',
                date: '2023-12-15',
                verified: true,
                result: 'Переведення в тил за станом здоров\'я'
            }
        ];
        
        this.currentIndex = 0;
        this.rotationTimer = null;
        
        this.init();
    }

    /**
     * Ініціалізація компонента
     */
    init() {
        console.log('⭐ Ініціалізація Testimonials');
        
        if (!this.container) {
            console.warn('⚠️ Контейнер відгуків не знайдено');
            return;
        }

        this.render();
        this.setupEventListeners();
        
        if (this.config.autoRotate) {
            this.startAutoRotation();
        }
    }

    /**
     * Рендеринг відгуків
     */
    render() {
        this.container.innerHTML = `
            <div class="testimonials__header">
                <h2 class="section__title">Що кажуть наші клієнти</h2>
                <div class="testimonials__stats">
                    <div class="stat">
                        <div class="stat__number">1000+</div>
                        <div class="stat__label">Задоволених клієнтів</div>
                    </div>
                    <div class="stat">
                        <div class="stat__number">4.9</div>
                        <div class="stat__label">Середня оцінка</div>
                    </div>
                    <div class="stat">
                        <div class="stat__number">87%</div>
                        <div class="stat__label">Виграних справ</div>
                    </div>
                </div>
            </div>
            
            <div class="testimonials__slider">
                <div class="testimonials__track" id="testimonialsTrack">
                    ${this.testimonials.map(testimonial => this.renderTestimonial(testimonial)).join('')}
                </div>
                
                <div class="testimonials__controls">
                    <button class="testimonials__arrow testimonials__arrow--prev" id="prevBtn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="testimonials__arrow testimonials__arrow--next" id="nextBtn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="testimonials__indicators">
                    ${this.testimonials.map((_, index) => 
                        `<button class="testimonials__indicator ${index === 0 ? 'testimonials__indicator--active' : ''}" 
                                data-index="${index}"></button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="testimonials__footer">
                <p class="testimonials__note">
                    * Всі відгуки перевірені та отримані від реальних клієнтів
                </p>
                <button class="btn btn--outline" id="showAllReviews">
                    Переглянути всі відгуки
                </button>
            </div>
        `;

        this.addStyles();
    }

    /**
     * Рендеринг одного відгуку
     */
    renderTestimonial(testimonial) {
        return `
            <div class="testimonial" data-id="${testimonial.id}">
                <div class="testimonial__header">
                    <div class="testimonial__avatar">
                        ${testimonial.name.charAt(0)}
                    </div>
                    <div class="testimonial__info">
                        <h4 class="testimonial__name">
                            ${testimonial.name}
                            ${testimonial.verified ? '<i class="fas fa-check-circle testimonial__verified"></i>' : ''}
                        </h4>
                        <p class="testimonial__meta">
                            ${testimonial.service} • ${testimonial.location}
                        </p>
                        <div class="testimonial__rating">
                            ${this.renderStars(testimonial.rating)}
                        </div>
                    </div>
                    <div class="testimonial__date">
                        ${this.formatDate(testimonial.date)}
                    </div>
                </div>
                
                <blockquote class="testimonial__text">
                    "${testimonial.text}"
                </blockquote>
                
                ${testimonial.result ? `
                    <div class="testimonial__result">
                        <i class="fas fa-trophy"></i>
                        <span>Результат: ${testimonial.result}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Рендеринг зірочок рейтингу
     */
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'star--filled' : 'star--empty'}"></i>`;
        }
        return stars;
    }

    /**
     * Форматування дати
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Додавання стилів
     */
    addStyles() {
        if (document.getElementById('testimonials-styles')) return;

        const style = document.createElement('style');
        style.id = 'testimonials-styles';
        style.textContent = `
            .testimonials {
                padding: var(--spacing-20) 0;
                background: var(--light-gray);
            }
            
            .testimonials__header {
                text-align: center;
                margin-bottom: var(--spacing-16);
            }
            
            .testimonials__stats {
                display: flex;
                justify-content: center;
                gap: var(--spacing-12);
                margin-top: var(--spacing-8);
            }
            
            .testimonials__slider {
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                overflow: hidden;
                border-radius: var(--radius-2xl);
            }
            
            .testimonials__track {
                display: flex;
                transition: transform var(--transition-normal);
            }
            
            .testimonial {
                min-width: 100%;
                background: var(--white);
                padding: var(--spacing-8);
                box-shadow: var(--shadow-lg);
            }
            
            .testimonial__header {
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-4);
                margin-bottom: var(--spacing-6);
            }
            
            .testimonial__avatar {
                width: 60px;
                height: 60px;
                background: var(--primary-blue);
                color: var(--white);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-bold);
                flex-shrink: 0;
            }
            
            .testimonial__info {
                flex: 1;
            }
            
            .testimonial__name {
                margin: 0 0 var(--spacing-1) 0;
                font-size: var(--font-size-lg);
                display: flex;
                align-items: center;
                gap: var(--spacing-2);
            }
            
            .testimonial__verified {
                color: var(--success-green);
                font-size: var(--font-size-sm);
            }
            
            .testimonial__meta {
                margin: 0 0 var(--spacing-2) 0;
                color: var(--neutral-gray);
                font-size: var(--font-size-sm);
            }
            
            .testimonial__rating {
                display: flex;
                gap: var(--spacing-1);
            }
            
            .star--filled {
                color: #FFC107;
            }
            
            .star--empty {
                color: var(--border-color);
            }
            
            .testimonial__date {
                color: var(--neutral-gray);
                font-size: var(--font-size-sm);
                text-align: right;
            }
            
            .testimonial__text {
                font-size: var(--font-size-lg);
                line-height: 1.6;
                font-style: italic;
                color: var(--dark-gray);
                margin: 0 0 var(--spacing-6) 0;
                position: relative;
            }
            
            .testimonial__text::before {
                content: '"';
                font-size: var(--font-size-5xl);
                color: var(--primary-blue);
                position: absolute;
                left: -var(--spacing-6);
                top: -var(--spacing-4);
                font-family: serif;
            }
            
            .testimonial__result {
                display: flex;
                align-items: center;
                gap: var(--spacing-2);
                padding: var(--spacing-3);
                background: var(--light-gray);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--success-green);
                font-weight: var(--font-weight-medium);
                color: var(--dark-gray);
            }
            
            .testimonial__result i {
                color: var(--success-green);
            }
            
            .testimonials__controls {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 var(--spacing-4);
                pointer-events: none;
            }
            
            .testimonials__arrow {
                width: 50px;
                height: 50px;
                background: var(--white);
                border: 2px solid var(--border-color);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all var(--transition-fast);
                pointer-events: all;
                box-shadow: var(--shadow-md);
            }
            
            .testimonials__arrow:hover {
                border-color: var(--primary-red);
                color: var(--primary-red);
                transform: scale(1.1);
            }
            
            .testimonials__indicators {
                display: flex;
                justify-content: center;
                gap: var(--spacing-2);
                margin-top: var(--spacing-6);
            }
            
            .testimonials__indicator {
                width: 12px;
                height: 12px;
                border-radius: var(--radius-full);
                border: none;
                background: var(--border-color);
                cursor: pointer;
                transition: background-color var(--transition-fast);
            }
            
            .testimonials__indicator--active {
                background: var(--primary-red);
            }
            
            .testimonials__footer {
                text-align: center;
                margin-top: var(--spacing-12);
            }
            
            .testimonials__note {
                color: var(--neutral-gray);
                font-size: var(--font-size-sm);
                margin-bottom: var(--spacing-4);
            }
            
            @media (max-width: 768px) {
                .testimonials__stats {
                    flex-direction: column;
                    gap: var(--spacing-6);
                }
                
                .testimonial__header {
                    flex-direction: column;
                    text-align: center;
                }
                
                .testimonial__date {
                    text-align: center;
                }
                
                .testimonials__arrow {
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        // Кнопки навігації
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previous());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Індикатори
        const indicators = document.querySelectorAll('.testimonials__indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Показати всі відгуки
        const showAllBtn = document.getElementById('showAllReviews');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => this.showAllReviews());
        }

        // Пауза автообертання при hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoRotation());
        this.container.addEventListener('mouseleave', () => this.resumeAutoRotation());

        // Свайпи на мобільних
        this.setupTouchEvents();
    }

    /**
     * Налаштування touch подій
     */
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        const track = document.getElementById('testimonialsTrack');
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Запобігаємо скролу сторінки
        });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    /**
     * Обробка свайпу
     */
    handleSwipe(startX, endX) {
        const threshold = 50; // Мінімальна відстань свайпу
        
        if (startX - endX > threshold) {
            // Свайп вліво - наступний слайд
            this.next();
        } else if (endX - startX > threshold) {
            // Свайп вправо - попередній слайд
            this.previous();
        }
    }

    /**
     * Перехід до попереднього відгуку
     */
    previous() {
        this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.updateSlider();
        this.trackInteraction('previous');
    }

    /**
     * Перехід до наступного відгуку
     */
    next() {
        this.currentIndex = this.currentIndex === this.testimonials.length - 1 ? 0 : this.currentIndex + 1;
        this.updateSlider();
        this.trackInteraction('next');
    }

    /**
     * Перехід до конкретного слайду
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
        this.trackInteraction('indicator', index);
    }

    /**
     * Оновлення позиції слайдера
     */
    updateSlider() {
        const track = document.getElementById('testimonialsTrack');
        const indicators = document.querySelectorAll('.testimonials__indicator');
        
        if (track) {
            track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        // Оновлення індикаторів
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('testimonials__indicator--active', index === this.currentIndex);
        });
    }

    /**
     * Запуск автоматичного обертання
     */
    startAutoRotation() {
        if (!this.config.autoRotate) return;
        
        this.rotationTimer = setInterval(() => {
            this.next();
        }, this.config.rotationInterval);
    }

    /**
     * Пауза автоматичного обертання
     */
    pauseAutoRotation() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
    }

    /**
     * Відновлення автоматичного обертання
     */
    resumeAutoRotation() {
        if (this.config.autoRotate && !this.rotationTimer) {
            this.startAutoRotation();
        }
    }

    /**
     * Показати всі відгуки
     */
    showAllReviews() {
        // Відкриваємо модальне вікно з усіма відгуками
        if (this.siteManager.modal) {
            const content = this.generateAllReviewsModal();
            this.siteManager.modalBody.innerHTML = content;
            this.siteManager.modal.style.display = 'block';
        }

        this.trackInteraction('show_all');
    }

    /**
     * Генерація модального вікна з усіма відгуками
     */
    generateAllReviewsModal() {
        return `
            <div class="all-reviews-modal">
                <h3>Всі відгуки клієнтів</h3>
                <div class="reviews-grid">
                    ${this.testimonials.map(testimonial => `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-avatar">${testimonial.name.charAt(0)}</div>
                                <div>
                                    <h4>${testimonial.name} ${testimonial.verified ? '✅' : ''}</h4>
                                    <p>${testimonial.service} • ${testimonial.location}</p>
                                    <div class="review-rating">${this.renderStars(testimonial.rating)}</div>
                                </div>
                                <span class="review-date">${this.formatDate(testimonial.date)}</span>
                            </div>
                            <p class="review-text">"${testimonial.text}"</p>
                            ${testimonial.result ? `<div class="review-result">🏆 ${testimonial.result}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="reviews-cta">
                    <p><strong>Хочете стати наступним задоволеним клієнтом?</strong></p>
                    <button class="btn btn--primary" onclick="window.siteManager.closeModal(); window.siteManager.openModal('consultation')">
                        Отримати консультацію
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Додавання нового відгуку
     */
    addTestimonial(testimonial) {
        // Додаємо ID, якщо його немає
        if (!testimonial.id) {
            testimonial.id = Math.max(...this.testimonials.map(t => t.id)) + 1;
        }

        // Додаємо дату, якщо її немає
        if (!testimonial.date) {
            testimonial.date = new Date().toISOString().split('T')[0];
        }

        // Додаємо до початку масиву (найновіші спочатку)
        this.testimonials.unshift(testimonial);

        // Перерендеруємо компонент
        this.render();
        this.setupEventListeners();

        console.log('✅ Додано новий відгук:', testimonial);
    }

    /**
     * Відстеження взаємодії з відгуками
     */
    trackInteraction(action, data = {}) {
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('testimonials_interaction', {
                action,
                current_testimonial: this.currentIndex,
                testimonial_id: this.testimonials[this.currentIndex]?.id,
                ...data
            });
        }
    }

    /**
     * Отримання статистики
     */
    getStats() {
        return {
            total_testimonials: this.testimonials.length,
            average_rating: this.calculateAverageRating(),
            verified_count: this.testimonials.filter(t => t.verified).length,
            current_slide: this.currentIndex
        };
    }

    /**
     * Розрахунок середнього рейтингу
     */
    calculateAverageRating() {
        const total = this.testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
        return (total / this.testimonials.length).toFixed(1);
    }

    /**
     * Знищення компонента
     */
    destroy() {
        this.pauseAutoRotation();
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('💀 Testimonials компонент знищено');
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Testimonials;
}