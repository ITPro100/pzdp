# 🚀 DEEP AGENT CHECKLIST - "Правовий Захист Дніпро"
## Комплексний чеклист для створення сучасного SaaS сайту українського юридичного агентства

### 🎯 ЗАГАЛЬНІ ВИМОГИ
- [ ] **Тематика:** Українське військове право та незалежна судмедекспертиза
- [ ] **Рівень дизайну:** Premium SaaS 2025 (Stripe/Linear/Vercel standards)
- [ ] **Технології:** Next.js 14 App Router + TypeScript + Tailwind CSS
- [ ] **Деплойм:** Cloudflare Pages через Wrangler CLI
- [ ] **Мова:** Українська (основна), підтримка RTL layouts

---

## 🎨 ДИЗАЙН СИСТЕМА (ОБОВ'ЯЗКОВО)

### Кольорова палітра (СТРОГО додержуватись!)
- [ ] **Primary Blue:** #1e3a8a (Navy blue - основний)
- [ ] **Secondary Blue:** #3b82f6 (Світліший синій)
- [ ] **Accent Gold:** #f59e0b (Золотистий для акцентів)
- [ ] **Success Green:** #10b981 (Для позитивних елементів)
- [ ] **Text Dark:** #1f2937 (Темний текст)
- [ ] **Text Gray:** #6b7280 (Сірий текст)
- [ ] **Background Light:** #f8fafc (Світлий фон)
- [ ] **White:** #ffffff (Білий)

### Типографія 2025
- [ ] **Основний шрифт:** Inter (Google Fonts)
- [ ] **Font weights:** 300, 400, 500, 600, 700
- [ ] **Responsive typography:** clamp() для адаптивності
- [ ] **Line height:** 1.6 для читабельності

### Сучасні ефекти
- [ ] **Glass morphism:** backdrop-blur з transparency
- [ ] **Subtle shadows:** --shadow та --shadow-lg змінні
- [ ] **Smooth transitions:** 0.3s ease для всіх анімацій
- [ ] **Gradient backgrounds:** Linear gradients для hero секцій
- [ ] **Hover effects:** translateY та scale трансформації

---

## 📱 МОБІЛЬНЕ МЕНЮ (КЛЮЧОВА ВИМОГА)

### Burger Menu Функціональність
- [ ] **Слайд-ін меню:** Повноекранне меню з боку
- [ ] **Приховування логотипу:** Логотип + назва зникають при відкритті
- [ ] **Красива кнопка телефону:** Велика кнопка з іконкою та номером
- [ ] **4 круглі іконки мессенджерів:**
  - [ ] WhatsApp (зелена)
  - [ ] Viber (фіолетова)  
  - [ ] Telegram (синя)
  - [ ] Signal (синя)
- [ ] **Smooth анімації:** slideIn/slideOut з ease transitions
- [ ] **Backdrop blur:** Фон меню з розмиттям

### Мобільна адаптивність
- [ ] **Breakpoints:** 768px, 1024px, 1280px
- [ ] **Touch-friendly:** 44px мінімум для touch targets
- [ ] **iOS/Android compatibility:** -webkit prefixes
- [ ] **Viewport handling:** Правильні meta tags

---

## 🔗 КРИТИЧНІ ІНТЕГРАЦІЇ (НЕ ЗАБУТИ!)

### Facebook Pixel (ОБОВ'ЯЗКОВО)
- [ ] **Pixel ID:** 1240931484418829 та 1219168716318102
- [ ] **Base tracking:** PageView при завантаженні
- [ ] **Lead tracking:** При відправці форм
- [ ] **Contact tracking:** При кліках по телефону
- [ ] **ViewContent tracking:** При перегляді послуг
- [ ] **InitiateCheckout:** При кліках по головній CTA

### Google Analytics 4
- [ ] **GA4 ID:** G-YT4KG6SBQJ
- [ ] **Form submissions tracking:** Success/failed events
- [ ] **Scroll depth tracking:** 25%, 50%, 75%, 90%
- [ ] **Time on page tracking:** 30s, 60s, 120s, 300s
- [ ] **Contact interactions:** Phone, WhatsApp, Viber, Telegram

### Telegram Integration (КРИТИЧНО!)
- [ ] **PHP Handler:** send_telegram.php
- [ ] **Telegram Bot API:** Відправка повідомлень у чат
- [ ] **Form data processing:** JSON format
- [ ] **Error handling:** Fallback на номер телефону
- [ ] **Success notifications:** Toast повідомлення

---

## 📋 POPUP СИСТЕМИ (ВАЖЛИВО!)

### Exit Intent Popup
- [ ] **Trigger:** mouseleave на верхню частину екрану
- [ ] **One-time показ:** localStorage flag
- [ ] **Форма в popup:** Ім'я, телефон, повідомлення
- [ ] **Telegram integration:** Відправка через send_telegram.php
- [ ] **Закриття:** X кнопка та клік поза popup

### Консультаційні попапи
- [ ] **Кнопки виклику:** "Безкоштовна консультація"
- [ ] **Мультистеп форма:** 3 кроки з прогрес-баром
- [ ] **Умовна логіка:** Різні питання залежно від відповіді
- [ ] **Валідація:** Required fields та телефон format
- [ ] **Loading states:** Spinner при відправці

---

## 🚀 СУЧАСНІ UX/UI КОМПОНЕНТИ

### Navigation & Header
- [ ] **Sticky header:** Position sticky з тінню при скролі
- [ ] **Логотип:** favicon-32x32.png + "Правовий Захист"
- [ ] **CTA кнопка:** "Безкоштовна консультація" з пульсацією
- [ ] **Телефон:** +38 063 309 44 80 з hover ефектом

### Hero Section
- [ ] **Gradient background:** Navy blue до light blue
- [ ] **Animated background:** Wave SVG animation
- [ ] **Main headline:** "Ваша Перемога завдяки незалежній судово-медичній експертизі"
- [ ] **CTA button:** "Дзвінок протягом 5 хвилин"
- [ ] **Responsive typography:** clamp() для всіх розмірів

### Content Sections
- [ ] **Проблеми клієнтів:** Grid з card компонентами
- [ ] **Методи роботи:** 3 варіанти (офіс, дистанційно, через родичів)
- [ ] **Timeline:** 6 кроків з вертикальною лінією
- [ ] **Послуги:** Grid з іконками та цінами
- [ ] **Відео відгуки:** YouTube embeds з описами кейсів

---

## 📞 КОНТАКТНІ ВИДЖЕТИ

### Floating Contact Widget
- [ ] **Position:** Fixed bottom-right
- [ ] **Toggle button:** Круглий з іконкою коментарів
- [ ] **Bounce animation:** 2s infinite
- [ ] **Випадаюче меню:** 5 опцій контакту
- [ ] **Tracking:** Google Analytics events

### Messenger Links
- [ ] **WhatsApp:** https://wa.me/380633094480
- [ ] **Viber:** viber://chat?number=380633094480  
- [ ] **Telegram:** https://t.me/+380633094480
- [ ] **Signal:** https://signal.me/#p/+380633094480
- [ ] **Phone:** tel:+380633094480

---

## 🗺️ КОНТАКТ ІНФОРМАЦІЯ

### Компанія Details
- [ ] **Назва:** ТОВ "ПРАВОВИЙ ЗАХИСТ ДНІПРО"
- [ ] **ЄДРПОУ:** 45678449
- [ ] **Додаткова компанія:** ТОВ "НЕЗАЛЕЖНЕ ЕКСПЕРТНО-КОНСУЛЬТАЦІЙНЕ БЮРО СУДОВО-МЕДИЧНИХ ЕКСПЕРТИЗ ТА ДОСЛІДЖЕНЬ"
- [ ] **ЄДРПОУ 2:** 45482054
- [ ] **Email:** info@pz.dp.ua
- [ ] **Статистика:** 1000+ справ, 87% виграних, досвід з 2016

### Географія та офіс
- [ ] **Google Maps embed:** Координати Дніпро офісу  
- [ ] **Маршрут:** Пряме посилання на Google Maps
- [ ] **Робота:** 24 області України, 80% дистанційно
- [ ] **Графік:** Пн-Пт 9-18, Сб 10-15, Нд вихідний

---

## 🔧 ТЕХНІЧНА РЕАЛІЗАЦІЯ

### Next.js конфігурація
- [ ] **output: 'export'** для статичного сайту
- [ ] **trailingSlash: true** для сумісності
- [ ] **images: { unoptimized: true }** для Cloudflare
- [ ] **distDir: 'out'** для деплойменту

### SEO оптимізація
- [ ] **Meta tags:** Title, description, keywords (українською)
- [ ] **Open Graph:** og:title, og:description, og:image
- [ ] **Twitter Card:** summary_large_image
- [ ] **Schema.org:** LegalService structured data
- [ ] **Canonical URL:** https://pz.dp.ua

### Performance оптимізації
- [ ] **Preload fonts:** Inter від Google
- [ ] **Lazy loading:** Images та videos
- [ ] **Minified CSS/JS:** Production build
- [ ] **Gzip compression:** Cloudflare автоматично

---

## 📊 АНАЛІТИКА ТА ТРЕКІНГ

### Event Tracking Setup
- [ ] **Form submissions:** Success/error states
- [ ] **Phone clicks:** Direct tel: links
- [ ] **Messenger clicks:** WhatsApp, Viber, Telegram
- [ ] **Video interactions:** Play button clicks
- [ ] **Scroll tracking:** Depth percentages
- [ ] **Time tracking:** Page engagement time

### Conversion Tracking
- [ ] **Facebook Pixel conversions:** Lead events
- [ ] **Google Analytics goals:** Contact form completions
- [ ] **Custom events:** Service page views
- [ ] **Error tracking:** Failed form submissions

---

## 🛡️ БЕЗПЕКА ТА НАДІЙНІСТЬ

### Form Security
- [ ] **Input validation:** Client + server side
- [ ] **CSRF protection:** Tokens для форм
- [ ] **Rate limiting:** Захист від спаму
- [ ] **Data sanitization:** XSS prevention

### Error Handling
- [ ] **Fallback телефон:** При помилці форми
- [ ] **User feedback:** Toast notifications
- [ ] **Console logging:** Debug інформація
- [ ] **Graceful degradation:** Функціональність без JS

---

## 🚀 ДЕПЛОЙМЕНТ ПРОЦЕС

### Cloudflare Pages Setup
- [ ] **Wrangler CLI:** npx wrangler pages deploy ./out
- [ ] **Custom domain:** pz.dp.ua
- [ ] **HTTPS redirect:** Автоматично
- [ ] **CDN caching:** Cloudflare optimization

### Post-Deploy Verification
- [ ] **All pages load:** Перевірка всіх сторінок
- [ ] **Forms work:** Тестування відправки
- [ ] **Analytics track:** Google та Facebook events
- [ ] **Mobile responsive:** Тестування на різних пристроях
- [ ] **Loading speed:** PageSpeed Insights

---

## ✅ FINAL CHECKLIST

### Перед submitting до користувача:
- [ ] **Всі форми працюють** з Telegram integration
- [ ] **Facebook Pixel налаштований** з правильними ID
- [ ] **Мобільне меню** з правильними анімаціями
- [ ] **Кольорова палітра** точно відповідає navy blue/gold
- [ ] **Відео відгуки** з правильними YouTube links
- [ ] **Exit intent popup** працює коректно  
- [ ] **Contact widget** з всіма messenger links
- [ ] **Google Maps** з правильними координатами
- [ ] **SEO meta tags** українською мовою
- [ ] **Analytics events** тестовані та працюють

### Performance Standards
- [ ] **Lighthouse Score:** 90+ Performance
- [ ] **Mobile Friendly:** Google test passed
- [ ] **Loading Time:** <3 seconds First Contentful Paint
- [ ] **Accessibility:** WCAG 2.1 compliance
- [ ] **Cross-browser:** Chrome, Firefox, Safari, Edge

---

## 🎯 ПРІОРИТИЗАЦІЯ ДЛЯ AI АГЕНТА

### КРИТИЧНИЙ ПРІОРИТЕТ (Робити першим!)
1. **Кольорова палітра** - navy blue замість яскравих кольорів
2. **Telegram integration** - send_telegram.php функціональність
3. **Мобільне меню** - слайд-ін з кнопками мессенджерів
4. **Facebook Pixel** - правильний tracking

### ВИСОКИЙ ПРІОРИТЕТ (Робити другим)
1. **Exit intent popup** - форма консультації
2. **Contact widget** - floating кнопка з меню
3. **Form validation** - proper error handling
4. **Analytics setup** - Google GA4 events

### СЕРЕДНІЙ ПРІОРИТЕТ (Після основного)
1. **SEO optimization** - meta tags та структура
2. **Performance** - lazy loading та minification  
3. **Accessibility** - ARIA labels та keyboard navigation
4. **Cross-browser** - compatibility testing

### НИЗЬКИЙ ПРІОРИТЕТ (Finalization)
1. **Advanced animations** - додаткові ефекти
2. **A/B testing** - варіанти copy
3. **Additional integrations** - додаткові сервіси
4. **Documentation** - технічна документація

---

## 📝 НОТАТКИ ДЛЯ AI АГЕНТА

> **ВАЖЛИВО:** Це не просто веб-сайт, а conversion-орієнтована система для генерації лідів в українському військовому праві. Кожен елемент має бути спрямований на конверсію відвідувача у клієнта.

> **КРИТИЧНО:** Ніколи не забувайте про Telegram integration - це основний канал зв'язку з клієнтами!

> **ДИЗАЙН:** SaaS рівень 2025 означає мінімалізм + функціональність, не перевантажувати декораціями.

> **МОБІЛЬНЕ:** 70%+ трафік з мобільних, mobile-first approach обов'язковий!

---

*Цей чеклист має бути повністю виконаний перед тим, як вважати проект завершеним. Кожен пункт - це критично важливий елемент для успіху юридичного агентства в онлайн просторі.*