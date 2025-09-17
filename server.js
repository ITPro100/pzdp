/**
 * Node.js Server for PZ.DP.UA
 * Альтернативний сервер для обробки лідів та статичних файлів
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 година
    max: 20, // максимум 20 запитів на годину з одного IP
    message: {
        success: false,
        error: 'Перевищено ліміт запитів. Спробуйте пізніше.'
    }
});

app.use('/api/leads', limiter);

// Конфігурація
const config = {
    // База даних SQLite
    dbPath: './leads.db',
    
    // Telegram
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID',
    
    // Email (через SendGrid або інший сервіс)
    adminEmail: 'info@pz.dp.ua',
    
    // Валідація
    requiredFields: ['name', 'phone'],
    
    // Опції
    enableTelegram: true,
    enableEmail: false, // Налаштувати за потреби
    logRequests: true
};

// Ініціалізація бази даних
async function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(config.dbPath, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Створення таблиці лідів
            db.run(`
                CREATE TABLE IF NOT EXISTS leads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    phone_formatted TEXT,
                    email TEXT,
                    message TEXT,
                    service TEXT,
                    
                    source TEXT,
                    page_url TEXT,
                    page_title TEXT,
                    referrer TEXT,
                    user_agent TEXT,
                    
                    utm_source TEXT,
                    utm_medium TEXT,
                    utm_campaign TEXT,
                    utm_content TEXT,
                    utm_term TEXT,
                    
                    ip_address TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    lead_number TEXT,
                    status TEXT DEFAULT 'new'
                )
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ База даних ініціалізована');
                    resolve(db);
                }
            });
        });
    });
}

// Валідація даних ліда
function validateLead(data) {
    const errors = [];
    
    // Перевірка обов'язкових полів
    for (const field of config.requiredFields) {
        if (!data[field] || typeof data[field] !== 'string' || !data[field].trim()) {
            errors.push(`Поле '${field}' є обов'язковим`);
        }
    }
    
    // Валідація імені
    if (data.name) {
        const name = data.name.trim();
        if (name.length < 2 || name.length > 50) {
            errors.push('Ім\'я повинно містити від 2 до 50 символів');
        }
        if (!/^[a-zA-Zа-яА-ЯіІїЇєЄ\s\'-]+$/u.test(name)) {
            errors.push('Ім\'я містить недопустимі символи');
        }
    }
    
    // Валідація телефону
    if (data.phone) {
        const phone = data.phone.replace(/\D/g, '');
        if (!/^380\d{9}$/.test(phone)) {
            errors.push('Некоректний номер телефону');
        }
    }
    
    // Валідація email (якщо присутній)
    if (data.email && !validator.isEmail(data.email)) {
        errors.push('Некоректний email');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Підготовка даних ліда
function prepareLead(data, req) {
    const phone = data.phone.replace(/\D/g, '');
    
    return {
        name: data.name.trim(),
        phone: phone,
        phone_formatted: '+' + phone,
        email: data.email ? data.email.trim() : null,
        message: data.message ? data.message.trim() : null,
        service: data.service || 'general',
        
        source: data.source || 'website',
        page_url: data.page_url || '',
        page_title: data.page_title || '',
        referrer: data.referrer || '',
        user_agent: req.get('User-Agent') || '',
        
        utm_source: data.utm_source || '',
        utm_medium: data.utm_medium || '',
        utm_campaign: data.utm_campaign || '',
        utm_content: data.utm_content || '',
        utm_term: data.utm_term || '',
        
        ip_address: req.ip || req.connection.remoteAddress,
        lead_number: data.lead_number || generateLeadNumber(),
        status: 'new'
    };
}

// Генерація номера ліда
function generateLeadNumber() {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `LD${date}${random}`;
}

// Збереження ліда в базу
function saveLead(lead, db) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO leads (
                name, phone, phone_formatted, email, message, service,
                source, page_url, page_title, referrer, user_agent,
                utm_source, utm_medium, utm_campaign, utm_content, utm_term,
                ip_address, lead_number, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            lead.name, lead.phone, lead.phone_formatted, lead.email, lead.message, lead.service,
            lead.source, lead.page_url, lead.page_title, lead.referrer, lead.user_agent,
            lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, lead.utm_term,
            lead.ip_address, lead.lead_number, lead.status
        ];
        
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Відправка в Telegram
async function sendTelegramNotification(lead) {
    if (!config.enableTelegram || !config.telegramBotToken || !config.telegramChatId) {
        return false;
    }
    
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
    
    const serviceName = serviceNames[lead.service] || lead.service;
    
    let message = `🚨 <b>НОВИЙ ЛІД!</b>\n\n`;
    message += `👤 <b>Ім'я:</b> ${lead.name}\n`;
    message += `📞 <b>Телефон:</b> ${lead.phone_formatted}\n`;
    
    if (lead.email) {
        message += `📧 <b>Email:</b> ${lead.email}\n`;
    }
    
    message += `\n🎯 <b>Послуга:</b> ${serviceName}\n`;
    
    if (lead.message) {
        message += `💬 <b>Повідомлення:</b> ${lead.message}\n`;
    }
    
    message += `\n📊 <b>Джерело:</b> ${lead.source}\n`;
    message += `🌐 <b>Сторінка:</b> ${lead.page_url}\n`;
    
    if (lead.utm_source) {
        message += `📈 <b>UTM Source:</b> ${lead.utm_source}\n`;
    }
    
    message += `\n🕐 <b>Час:</b> ${new Date().toLocaleString('uk-UA')}\n`;
    message += `🆔 <b>№ Заявки:</b> ${lead.lead_number}\n`;
    message += `\n<b>⏰ ДЗВОНИТИ ПРОТЯГОМ 3 ХВИЛИН!</b>`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
            chat_id: config.telegramChatId,
            text: message,
            parse_mode: 'HTML'
        });
        return true;
    } catch (error) {
        console.error('❌ Помилка відправки в Telegram:', error.message);
        return false;
    }
}

// Логування
async function logLead(lead) {
    if (!config.logRequests) return;
    
    const logEntry = `${new Date().toISOString()} | ${lead.lead_number} | ${lead.name} | ${lead.phone_formatted} | ${lead.service}\n`;
    
    try {
        await fs.appendFile(`leads_log_${new Date().toISOString().split('T')[0]}.txt`, logEntry);
    } catch (error) {
        console.error('❌ Помилка логування:', error.message);
    }
}

// API Routes

// Обробка лідів
app.post('/api/leads', async (req, res) => {
    try {
        // Валідація
        const validation = validateLead(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: validation.errors.join(', ')
            });
        }
        
        // Підготовка даних
        const lead = prepareLead(req.body, req);
        
        // Збереження в базу
        const leadId = await saveLead(lead, db);
        
        // Відправка уведомлень
        const telegramSent = await sendTelegramNotification(lead);
        
        // Логування
        await logLead(lead);
        
        console.log(`✅ Новий ліда збережено: ${lead.lead_number} | ${lead.name} | ${lead.phone_formatted}`);
        
        // Відповідь
        res.json({
            success: true,
            message: 'Заявку успішно відправлено! Наш юрист зв\'яжеться з вами найближчим часом.',
            lead_id: leadId,
            lead_number: lead.lead_number,
            estimated_callback_time: '3 хвилини',
            notifications: {
                telegram: telegramSent
            }
        });
        
    } catch (error) {
        console.error('❌ Помилка обробки ліда:', error);
        
        // Резервне збереження у файл
        try {
            const backupData = {
                timestamp: new Date().toISOString(),
                data: req.body,
                error: error.message
            };
            await fs.appendFile('leads_backup.json', JSON.stringify(backupData) + '\n');
        } catch (backupError) {
            console.error('❌ Помилка резервного збереження:', backupError);
        }
        
        res.status(500).json({
            success: false,
            error: 'Технічна помилка сервера. Спробуйте пізніше або зателефонуйте: +380 (67) 123-45-67'
        });
    }
});

// Отримання статистики (для адміністратора)
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    COUNT(*) as total_leads,
                    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
                    COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today_leads,
                    COUNT(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 END) as week_leads
                FROM leads
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Помилка отримання статистики'
        });
    }
});

// Аналітика
app.post('/api/analytics', (req, res) => {
    // Простий ендпоінт для збору аналітики
    const { events, session } = req.body;
    
    // Тут можна зберігати события аналітики
    console.log('📊 Analytics events:', events?.length || 0);
    
    res.json({ success: true });
});

// Статичні файли
app.use(express.static('.', {
    maxAge: '1d', // Кешування на 1 день
    etag: true,
    lastModified: true
}));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обробка помилок
app.use((error, req, res, next) => {
    console.error('❌ Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Внутрішня помилка сервера'
    });
});

// Ініціалізація сервера
let db;

async function startServer() {
    try {
        // Ініціалізація бази даних
        db = await initDatabase();
        
        // Запуск сервера
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущено на порті ${PORT}`);
            console.log(`📱 Telegram уведомлення: ${config.enableTelegram ? '✅' : '❌'}`);
            console.log(`📧 Email уведомлення: ${config.enableEmail ? '✅' : '❌'}`);
            console.log(`📝 Логування: ${config.logRequests ? '✅' : '❌'}`);
            console.log(`🌐 Відкрийте: http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Помилка запуску сервера:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Зупинка сервера...');
    if (db) {
        db.close();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔄 Зупинка сервера...');
    if (db) {
        db.close();
    }
    process.exit(0);
});

// Запуск
startServer();

module.exports = app;