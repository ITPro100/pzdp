/**
 * Payment Calculator Component
 * Калькулятор військових виплат як лід-магніт
 */
class PaymentCalculator {
    constructor(siteManager) {
        this.siteManager = siteManager;
        this.form = document.querySelector('.calculator__form');
        this.resultContainer = document.getElementById('calculatorResult');
        
        this.config = {
            baseSalaries: {
                officer: 12000,      // Базовий оклад офіцера
                sergeant: 8000,      // Базовий оклад сержанта
                soldier: 6000,       // Базовий оклад солдата/матроса
                contract: 10000      // Базовий оклад контрактника
            },
            
            combatMultipliers: {
                combat: 2.0,         // Участь у бойових діях
                support: 1.5,        // Забезпечення бойових дій
                'no-combat': 1.0     // Без участі у бойових діях
            },
            
            injuryBonus: {
                none: 0,
                light: 5000,         // Легкі поранення
                medium: 15000,       // Середні поранення
                severe: 30000        // Тяжкі поранення
            },
            
            additionalBenefits: {
                veteranStatus: 10000,      // Статус ветерана
                longService: 8000,         // Довга служба (24+ місяці)
                specialConditions: 12000   // Особливі умови служби
            }
        };
        
        this.calculationHistory = [];
        this.init();
    }

    /**
     * Ініціалізація калькулятора
     */
    init() {
        console.log('💰 Ініціалізація PaymentCalculator');
        
        if (!this.form) {
            console.warn('⚠️ Форма калькулятора не знайдена');
            return;
        }

        this.setupEventListeners();
        this.loadSavedData();
    }

    /**
     * Налаштування обробників подій
     */
    setupEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculate();
            });
        }

        // Автоматичний перерахунок при зміні значень
        const inputs = this.form.querySelectorAll('select, input');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveInputData();
                
                // Показуємо попередження про необхідність перерахунку
                this.showRecalculateHint();
            });
        });

        // Трекінг взаємодії з калькулятором
        this.trackCalculatorInteraction();
    }

    /**
     * Основна функція розрахунку
     */
    calculate() {
        try {
            // Збираємо дані з форми
            const inputData = this.collectInputData();
            
            // Валідуємо дані
            const validation = this.validateInputData(inputData);
            if (!validation.isValid) {
                this.showValidationErrors(validation.errors);
                return;
            }

            // Виконуємо розрахунок
            const result = this.performCalculation(inputData);
            
            // Показуємо результат
            this.displayResult(result);
            
            // Зберігаємо в історію
            this.saveToHistory(inputData, result);
            
            // Трекінг використання калькулятора
            this.trackCalculation(inputData, result);

            console.log('✅ Розрахунок завершено:', result);

        } catch (error) {
            console.error('❌ Помилка при розрахунку:', error);
            this.showCalculationError();
        }
    }

    /**
     * Збір даних з форми
     */
    collectInputData() {
        return {
            category: document.getElementById('category')?.value || 'soldier',
            serviceTime: parseInt(document.getElementById('serviceTime')?.value) || 12,
            combatStatus: document.getElementById('combatStatus')?.value || 'no-combat',
            injury: document.getElementById('injury')?.value || 'none'
        };
    }

    /**
     * Валідація вхідних даних
     */
    validateInputData(data) {
        const errors = [];

        if (!data.category) {
            errors.push('Оберіть категорію військовослужбовця');
        }

        if (!data.serviceTime || data.serviceTime < 1 || data.serviceTime > 300) {
            errors.push('Термін служби повинен бути від 1 до 300 місяців');
        }

        if (!data.combatStatus) {
            errors.push('Оберіть статус участі у бойових діях');
        }

        if (!data.injury) {
            errors.push('Оберіть статус поранень/контузій');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Виконання розрахунку
     */
    performCalculation(data) {
        // Базова заробітна плата
        const baseSalary = this.config.baseSalaries[data.category];
        
        // Загальна сума за весь період служби
        const totalBaseSalary = baseSalary * data.serviceTime;
        
        // Коефіцієнт за участь у бойових діях
        const combatMultiplier = this.config.combatMultipliers[data.combatStatus];
        
        // Доплата за поранення
        const injuryBonus = this.config.injuryBonus[data.injury];
        
        // Додаткові виплати
        let additionalBenefits = 0;
        
        // Статус ветерана (якщо служба більше 18 місяців)
        if (data.serviceTime >= 18) {
            additionalBenefits += this.config.additionalBenefits.veteranStatus;
        }
        
        // Довга служба (якщо більше 24 місяців)
        if (data.serviceTime >= 24) {
            additionalBenefits += this.config.additionalBenefits.longService;
        }
        
        // Особливі умови (якщо участь у бойових діях)
        if (data.combatStatus === 'combat') {
            additionalBenefits += this.config.additionalBenefits.specialConditions;
        }

        // Розрахунок загальної суми
        const combatPayment = totalBaseSalary * (combatMultiplier - 1);
        const totalAmount = totalBaseSalary + combatPayment + injuryBonus + additionalBenefits;

        // Детальна розшифровка
        const breakdown = {
            baseSalary: {
                amount: totalBaseSalary,
                description: `Базова заробітна плата (${baseSalary} грн × ${data.serviceTime} міс.)`
            },
            combatPayment: {
                amount: combatPayment,
                description: `Доплата за бойові дії (×${combatMultiplier.toFixed(1)})`
            },
            injuryBonus: {
                amount: injuryBonus,
                description: this.getInjuryDescription(data.injury)
            },
            additionalBenefits: {
                amount: additionalBenefits,
                description: 'Додаткові виплати та пільги'
            }
        };

        return {
            totalAmount,
            breakdown,
            inputData: data,
            calculatedAt: new Date().toISOString(),
            recommendations: this.getRecommendations(data, totalAmount)
        };
    }

    /**
     * Отримати опис поранень
     */
    getInjuryDescription(injuryType) {
        const descriptions = {
            none: 'Без поранень',
            light: 'Компенсація за легкі поранення',
            medium: 'Компенсація за середні поранення', 
            severe: 'Компенсація за тяжкі поранення'
        };
        
        return descriptions[injuryType] || descriptions.none;
    }

    /**
     * Отримати рекомендації
     */
    getRecommendations(data, totalAmount) {
        const recommendations = [];

        if (totalAmount > 50000) {
            recommendations.push({
                type: 'high-amount',
                text: 'У вас значна сума до виплати. Рекомендуємо негайно звернутися до юриста.',
                priority: 'high'
            });
        }

        if (data.combatStatus === 'combat') {
            recommendations.push({
                type: 'combat-veteran',
                text: 'Як учасник бойових дій, ви маєте право на додаткові пільги та виплати.',
                priority: 'medium'
            });
        }

        if (data.injury !== 'none') {
            recommendations.push({
                type: 'medical-examination',
                text: 'Рекомендуємо пройти додаткову судмедекспертизу для підтвердження всіх травм.',
                priority: 'high'
            });
        }

        if (data.serviceTime >= 24) {
            recommendations.push({
                type: 'long-service',
                text: 'За тривалу службу ви можете претендувати на статус ветерана та додаткові виплати.',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    /**
     * Відображення результату
     */
    displayResult(result) {
        if (!this.resultContainer) return;

        // Показуємо контейнер результату
        this.resultContainer.style.display = 'block';
        
        // Оновлюємо загальну суму
        const amountElement = document.getElementById('resultAmount');
        if (amountElement) {
            amountElement.textContent = this.formatCurrency(result.totalAmount);
            
            // Анімація числа
            this.animateNumber(amountElement, 0, result.totalAmount, 1000);
        }

        // Оновлюємо розшифровку
        const breakdownElement = document.getElementById('resultBreakdown');
        if (breakdownElement) {
            breakdownElement.innerHTML = this.renderBreakdown(result.breakdown);
        }

        // Показуємо рекомендації
        this.showRecommendations(result.recommendations);

        // Анімація появи результату
        this.animateResultAppearance();

        // Скролимо до результату
        setTimeout(() => {
            this.resultContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }

    /**
     * Рендеринг розшифровки
     */
    renderBreakdown(breakdown) {
        let html = '<div class="breakdown-list">';
        
        Object.entries(breakdown).forEach(([key, item]) => {
            if (item.amount > 0) {
                html += `
                    <div class="breakdown-item">
                        <span class="breakdown-description">${item.description}</span>
                        <span class="breakdown-amount">${this.formatCurrency(item.amount)}</span>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        
        // Додаємо стилі для розшифровки
        const styles = `
            <style>
                .breakdown-list {
                    margin: var(--spacing-4) 0;
                }
                .breakdown-item {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-2) 0;
                    border-bottom: 1px solid var(--border-color);
                }
                .breakdown-item:last-child {
                    border-bottom: none;
                    font-weight: var(--font-weight-semibold);
                    color: var(--primary-red);
                }
                .breakdown-description {
                    color: var(--neutral-gray);
                }
                .breakdown-amount {
                    font-weight: var(--font-weight-semibold);
                    color: var(--success-green);
                }
            </style>
        `;
        
        return styles + html;
    }

    /**
     * Показати рекомендації
     */
    showRecommendations(recommendations) {
        if (!recommendations.length) return;

        const container = this.resultContainer.querySelector('.result__cta');
        if (!container) return;

        const recommendationsHtml = `
            <div class="recommendations">
                <h4>💡 Рекомендації:</h4>
                ${recommendations.map(rec => `
                    <div class="recommendation recommendation--${rec.priority}">
                        <i class="fas fa-lightbulb"></i>
                        ${rec.text}
                    </div>
                `).join('')}
            </div>
        `;

        // Додаємо рекомендації перед CTA кнопкою
        container.insertAdjacentHTML('afterbegin', recommendationsHtml);

        // Додаємо стилі
        if (!document.getElementById('recommendations-styles')) {
            const style = document.createElement('style');
            style.id = 'recommendations-styles';
            style.textContent = `
                .recommendations {
                    margin-bottom: var(--spacing-6);
                    padding: var(--spacing-4);
                    background: var(--light-gray);
                    border-radius: var(--radius-lg);
                }
                .recommendations h4 {
                    margin-bottom: var(--spacing-3);
                    color: var(--black);
                }
                .recommendation {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-2);
                    margin-bottom: var(--spacing-3);
                    padding: var(--spacing-3);
                    border-radius: var(--radius-md);
                    font-size: var(--font-size-sm);
                }
                .recommendation:last-child {
                    margin-bottom: 0;
                }
                .recommendation--high {
                    background: #FEF2F2;
                    border-left: 3px solid var(--primary-red);
                }
                .recommendation--medium {
                    background: #FFFBEB;
                    border-left: 3px solid var(--warning-orange);
                }
                .recommendation i {
                    margin-top: 2px;
                    color: var(--warning-orange);
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Анімація числа
     */
    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60 FPS
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = this.formatCurrency(Math.floor(current));
        }, 16);
    }

    /**
     * Анімація появи результату
     */
    animateResultAppearance() {
        this.resultContainer.style.opacity = '0';
        this.resultContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.resultContainer.style.transition = 'all 0.5s ease';
            this.resultContainer.style.opacity = '1';
            this.resultContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Показати помилки валідації
     */
    showValidationErrors(errors) {
        // Створюємо контейнер для помилок
        let errorContainer = this.form.querySelector('.validation-errors');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'validation-errors';
            this.form.insertBefore(errorContainer, this.form.firstChild);
        }

        errorContainer.innerHTML = `
            <div class="alert alert--error">
                <i class="fas fa-exclamation-triangle"></i>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;

        // Автоматичне приховування через 5 секунд
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 5000);
    }

    /**
     * Показати помилку розрахунку
     */
    showCalculationError() {
        this.siteManager.showNotification(
            'Помилка при розрахунку. Спробуйте ще раз або зверніться до нашого юриста.',
            'error'
        );
    }

    /**
     * Показати підказку про перерахунок
     */
    showRecalculateHint() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn && !calculateBtn.dataset.highlighted) {
            calculateBtn.style.background = 'var(--warning-orange)';
            calculateBtn.textContent = 'ПЕРЕРАХУВАТИ ВИПЛАТИ';
            calculateBtn.dataset.highlighted = 'true';
            
            setTimeout(() => {
                calculateBtn.style.background = '';
                calculateBtn.textContent = 'РОЗРАХУВАТИ ВИПЛАТИ';
                calculateBtn.dataset.highlighted = 'false';
            }, 3000);
        }
    }

    /**
     * Відстеження взаємодії з калькулятором
     */
    trackCalculatorInteraction() {
        const inputs = this.form.querySelectorAll('select, input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (this.siteManager.modules.analytics) {
                    this.siteManager.modules.analytics.trackEvent('calculator_field_focus', {
                        field_name: input.id || input.name,
                        field_type: input.tagName.toLowerCase()
                    });
                }
            });
        });
    }

    /**
     * Трекінг розрахунку
     */
    trackCalculation(inputData, result) {
        if (this.siteManager.modules.analytics) {
            this.siteManager.modules.analytics.trackEvent('calculator_calculation', {
                category: inputData.category,
                service_time: inputData.serviceTime,
                combat_status: inputData.combatStatus,
                injury: inputData.injury,
                total_amount: result.totalAmount,
                amount_range: this.getAmountRange(result.totalAmount)
            });
        }

        // Показуємо уведомлення про розрахунок
        if (this.siteManager.modules.notifications) {
            this.siteManager.modules.notifications.showNotification({
                type: 'success',
                icon: '💰',
                message: `Розрахунок завершено: ${this.formatCurrency(result.totalAmount)}`,
                duration: 8000
            });
        }
    }

    /**
     * Отримати діапазон суми для аналітики
     */
    getAmountRange(amount) {
        if (amount < 20000) return 'low';
        if (amount < 50000) return 'medium';
        if (amount < 100000) return 'high';
        return 'very-high';
    }

    /**
     * Збереження даних введення
     */
    saveInputData() {
        const data = this.collectInputData();
        localStorage.setItem('calculator_data', JSON.stringify(data));
    }

    /**
     * Завантаження збережених даних
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('calculator_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.populateForm(data);
            }
        } catch (error) {
            console.warn('Не вдалося завантажити збережені дані калькулятора:', error);
        }
    }

    /**
     * Заповнення форми даними
     */
    populateForm(data) {
        Object.entries(data).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
            }
        });
    }

    /**
     * Збереження в історію
     */
    saveToHistory(inputData, result) {
        this.calculationHistory.push({
            inputData,
            result,
            timestamp: new Date().toISOString()
        });

        // Зберігаємо тільки останні 10 розрахунків
        if (this.calculationHistory.length > 10) {
            this.calculationHistory = this.calculationHistory.slice(-10);
        }

        localStorage.setItem('calculator_history', JSON.stringify(this.calculationHistory));
    }

    /**
     * Форматування валюти
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Експорт результату
     */
    exportResult(format = 'text') {
        const lastCalculation = this.calculationHistory[this.calculationHistory.length - 1];
        if (!lastCalculation) return;

        switch (format) {
            case 'text':
                return this.exportAsText(lastCalculation);
            case 'json':
                return JSON.stringify(lastCalculation, null, 2);
            default:
                return this.exportAsText(lastCalculation);
        }
    }

    /**
     * Експорт як текст
     */
    exportAsText(calculation) {
        const { inputData, result } = calculation;
        
        return `
РОЗРАХУНОК ВІЙСЬКОВИХ ВИПЛАТ
============================

Дата розрахунку: ${new Date(calculation.timestamp).toLocaleString('uk-UA')}

ВХІДНІ ДАНІ:
- Категорія: ${inputData.category}
- Термін служби: ${inputData.serviceTime} міс.
- Участь у бойових діях: ${inputData.combatStatus}
- Поранення: ${inputData.injury}

РЕЗУЛЬТАТ:
Загальна сума до виплати: ${this.formatCurrency(result.totalAmount)}

РОЗШИФРОВКА:
${Object.entries(result.breakdown).map(([key, item]) => 
    item.amount > 0 ? `- ${item.description}: ${this.formatCurrency(item.amount)}` : ''
).filter(Boolean).join('\n')}

РЕКОМЕНДАЦІЇ:
${result.recommendations.map(rec => `- ${rec.text}`).join('\n')}

---
Розрахунок носить орієнтовний характер.
Для отримання точної суми зверніться до наших юристів.
        `.trim();
    }

    /**
     * Отримати статистику
     */
    getStats() {
        return {
            totalCalculations: this.calculationHistory.length,
            averageAmount: this.calculationHistory.length > 0 
                ? this.calculationHistory.reduce((sum, calc) => sum + calc.result.totalAmount, 0) / this.calculationHistory.length 
                : 0,
            lastCalculation: this.calculationHistory[this.calculationHistory.length - 1]?.timestamp
        };
    }
}

// Експорт для використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentCalculator;
}