<?php
/**
 * API для обробки лідів
 * Простий PHP скрипт для прийому та обробки заявок з форм
 */

// Налаштування CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Обробка preflight запитів
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Дозволяємо тільки POST запити
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Дозволений тільки POST метод'
    ]);
    exit();
}

// Конфігурація
$config = [
    // База даних
    'db_host' => 'localhost',
    'db_name' => 'pz_dp_ua',
    'db_user' => 'your_db_user',
    'db_pass' => 'your_db_pass',
    
    // Email налаштування
    'admin_email' => 'info@pz.dp.ua',
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'your_email@gmail.com',
    'smtp_pass' => 'your_app_password',
    
    // Telegram
    'telegram_bot_token' => 'YOUR_BOT_TOKEN',
    'telegram_chat_id' => 'YOUR_CHAT_ID',
    
    // Валідація
    'required_fields' => ['name', 'phone'],
    'max_requests_per_hour' => 20
];

try {
    // Читаємо JSON дані
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        throw new Exception('Некоректні дані JSON');
    }
    
    // Валідація даних
    $validation = validateLeadData($data, $config);
    if (!$validation['valid']) {
        throw new Exception('Помилка валідації: ' . implode(', ', $validation['errors']));
    }
    
    // Перевірка rate limit
    if (!checkRateLimit($data, $config)) {
        throw new Exception('Перевищено ліміт запитів. Спробуйте пізніше.');
    }
    
    // Очищення та підготовка даних
    $lead = prepareLead($data);
    
    // Збереження в базу даних
    $leadId = saveLead($lead, $config);
    
    // Відправка уведомлень
    sendNotifications($lead, $config);
    
    // Логування
    logLead($lead);
    
    // Відповідь клієнту
    echo json_encode([
        'success' => true,
        'message' => 'Заявку успішно відправлено! Наш юрист зв\'яжеться з вами найближчим часом.',
        'lead_id' => $leadId,
        'estimated_callback_time' => '3 хвилини'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
    // Логування помилок
    error_log("Lead API Error: " . $e->getMessage() . " | Data: " . json_encode($data ?? []));
}

/**
 * Валідація даних ліда
 */
function validateLeadData($data, $config) {
    $errors = [];
    
    // Перевірка обов'язкових полів
    foreach ($config['required_fields'] as $field) {
        if (empty($data[$field])) {
            $errors[] = "Поле '{$field}' є обов'язковим";
        }
    }
    
    // Валідація імені
    if (!empty($data['name'])) {
        if (!preg_match('/^[a-zA-Zа-яА-ЯіІїЇєЄ\s\'-]{2,50}$/u', $data['name'])) {
            $errors[] = 'Некоректне ім\'я';
        }
    }
    
    // Валідація телефону
    if (!empty($data['phone'])) {
        $phone = preg_replace('/\D/', '', $data['phone']);
        if (!preg_match('/^380\d{9}$/', $phone)) {
            $errors[] = 'Некоректний номер телефону';
        }
    }
    
    // Валідація email (якщо присутній)
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Некоректний email';
    }
    
    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Перевірка ліміту запитів
 */
function checkRateLimit($data, $config) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $rateLimitFile = sys_get_temp_dir() . '/rate_limit_' . md5($ip) . '.json';
    
    $now = time();
    $requests = [];
    
    // Читаємо існуючі запити
    if (file_exists($rateLimitFile)) {
        $requests = json_decode(file_get_contents($rateLimitFile), true) ?: [];
    }
    
    // Видаляємо застарілі запити (старше 1 години)
    $requests = array_filter($requests, function($timestamp) use ($now) {
        return ($now - $timestamp) < 3600;
    });
    
    // Перевіряємо ліміт
    if (count($requests) >= $config['max_requests_per_hour']) {
        return false;
    }
    
    // Додаємо поточний запит
    $requests[] = $now;
    
    // Зберігаємо
    file_put_contents($rateLimitFile, json_encode($requests));
    
    return true;
}

/**
 * Підготовка даних ліда
 */
function prepareLead($data) {
    $lead = [
        'name' => trim($data['name'] ?? ''),
        'phone' => preg_replace('/\D/', '', $data['phone'] ?? ''),
        'email' => trim($data['email'] ?? ''),
        'message' => trim($data['message'] ?? ''),
        'service' => $data['service'] ?? 'general',
        
        // Мета-дані
        'source' => $data['source'] ?? 'website',
        'page_url' => $data['page_url'] ?? '',
        'page_title' => $data['page_title'] ?? '',
        'referrer' => $data['referrer'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        
        // UTM мітки
        'utm_source' => $data['utm_source'] ?? '',
        'utm_medium' => $data['utm_medium'] ?? '',
        'utm_campaign' => $data['utm_campaign'] ?? '',
        'utm_content' => $data['utm_content'] ?? '',
        'utm_term' => $data['utm_term'] ?? '',
        
        // Системні дані
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
        'created_at' => date('Y-m-d H:i:s'),
        'lead_number' => $data['lead_number'] ?? generateLeadNumber(),
        'status' => 'new'
    ];
    
    // Форматування телефону
    if ($lead['phone']) {
        $lead['phone_formatted'] = '+380' . substr($lead['phone'], 3);
    }
    
    return $lead;
}

/**
 * Генерація номера ліда
 */
function generateLeadNumber() {
    $date = date('ymd');
    $counter = (int)file_get_contents(sys_get_temp_dir() . '/lead_counter.txt') ?: 0;
    $counter++;
    file_put_contents(sys_get_temp_dir() . '/lead_counter.txt', $counter);
    
    return 'LD' . $date . str_pad($counter, 3, '0', STR_PAD_LEFT);
}

/**
 * Збереження ліда в базу даних
 */
function saveLead($lead, $config) {
    try {
        $pdo = new PDO(
            "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
            $config['db_user'],
            $config['db_pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        
        $sql = "INSERT INTO leads (
            name, phone, phone_formatted, email, message, service,
            source, page_url, page_title, referrer, user_agent,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term,
            ip_address, created_at, lead_number, status
        ) VALUES (
            :name, :phone, :phone_formatted, :email, :message, :service,
            :source, :page_url, :page_title, :referrer, :user_agent,
            :utm_source, :utm_medium, :utm_campaign, :utm_content, :utm_term,
            :ip_address, :created_at, :lead_number, :status
        )";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($lead);
        
        return $pdo->lastInsertId();
        
    } catch (PDOException $e) {
        // Зберігаємо у файл як резерв
        saveLeadToFile($lead);
        throw new Exception('Помилка збереження в базу даних');
    }
}

/**
 * Резервне збереження у файл
 */
function saveLeadToFile($lead) {
    $file = 'leads_backup_' . date('Y-m-d') . '.json';
    $leads = [];
    
    if (file_exists($file)) {
        $leads = json_decode(file_get_contents($file), true) ?: [];
    }
    
    $leads[] = $lead;
    file_put_contents($file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/**
 * Відправка уведомлень
 */
function sendNotifications($lead, $config) {
    // Telegram уведомлення
    sendTelegramNotification($lead, $config);
    
    // Email уведомлення
    sendEmailNotification($lead, $config);
}

/**
 * Відправка в Telegram
 */
function sendTelegramNotification($lead, $config) {
    if (empty($config['telegram_bot_token']) || empty($config['telegram_chat_id'])) {
        return false;
    }
    
    $serviceNames = [
        'vlk-appeal' => '⚖️ Оскарження ВЛК',
        'medical-expertise' => '🏥 Судмедекспертиза',
        'demobilization' => '🎖️ Демобілізація',
        'military-payments' => '💰 Військові виплати',
        'veteran-status' => '🏅 Статус ветерана',
        'rear-transfer' => '🔄 Переведення в тил',
        'general' => '📞 Загальна консультація'
    ];
    
    $serviceName = $serviceNames[$lead['service']] ?? $lead['service'];
    
    $message = "🚨 <b>НОВИЙ ЛІД!</b>\n\n";
    $message .= "👤 <b>Ім'я:</b> {$lead['name']}\n";
    $message .= "📞 <b>Телефон:</b> {$lead['phone_formatted']}\n";
    
    if ($lead['email']) {
        $message .= "📧 <b>Email:</b> {$lead['email']}\n";
    }
    
    $message .= "\n🎯 <b>Послуга:</b> {$serviceName}\n";
    
    if ($lead['message']) {
        $message .= "💬 <b>Повідомлення:</b> {$lead['message']}\n";
    }
    
    $message .= "\n📊 <b>Джерело:</b> {$lead['source']}\n";
    $message .= "🌐 <b>Сторінка:</b> {$lead['page_url']}\n";
    
    if ($lead['utm_source']) {
        $message .= "📈 <b>UTM Source:</b> {$lead['utm_source']}\n";
    }
    
    $message .= "\n🕐 <b>Час:</b> {$lead['created_at']}\n";
    $message .= "🆔 <b>№ Заявки:</b> {$lead['lead_number']}\n";
    $message .= "\n<b>⏰ ДЗВОНИТИ ПРОТЯГОМ 3 ХВИЛИН!</b>";
    
    $url = "https://api.telegram.org/bot{$config['telegram_bot_token']}/sendMessage";
    
    $data = [
        'chat_id' => $config['telegram_chat_id'],
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data)
        ]
    ]);
    
    return file_get_contents($url, false, $context);
}

/**
 * Відправка email уведомлення
 */
function sendEmailNotification($lead, $config) {
    $subject = "🚨 Нова заявка від {$lead['name']} - {$lead['lead_number']}";
    
    $message = "<h2>Нова заявка з сайту</h2>";
    $message .= "<p><strong>Ім'я:</strong> {$lead['name']}</p>";
    $message .= "<p><strong>Телефон:</strong> {$lead['phone_formatted']}</p>";
    
    if ($lead['email']) {
        $message .= "<p><strong>Email:</strong> {$lead['email']}</p>";
    }
    
    $message .= "<p><strong>Послуга:</strong> {$lead['service']}</p>";
    
    if ($lead['message']) {
        $message .= "<p><strong>Повідомлення:</strong> {$lead['message']}</p>";
    }
    
    $message .= "<hr>";
    $message .= "<p><strong>Джерело:</strong> {$lead['source']}</p>";
    $message .= "<p><strong>Сторінка:</strong> <a href=\"{$lead['page_url']}\">{$lead['page_url']}</a></p>";
    $message .= "<p><strong>Час:</strong> {$lead['created_at']}</p>";
    $message .= "<p><strong>№ Заявки:</strong> {$lead['lead_number']}</p>";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: Сайт pz.dp.ua <noreply@pz.dp.ua>',
        'X-Priority: 1',
        'X-MSMail-Priority: High'
    ];
    
    return mail($config['admin_email'], $subject, $message, implode("\r\n", $headers));
}

/**
 * Логування ліда
 */
function logLead($lead) {
    $logFile = 'leads_log_' . date('Y-m-d') . '.txt';
    $logEntry = date('Y-m-d H:i:s') . " | {$lead['lead_number']} | {$lead['name']} | {$lead['phone_formatted']} | {$lead['service']}\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// SQL для створення таблиці лідів
/*
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_formatted VARCHAR(20),
    email VARCHAR(255),
    message TEXT,
    service VARCHAR(50),
    
    source VARCHAR(100),
    page_url TEXT,
    page_title VARCHAR(255),
    referrer TEXT,
    user_agent TEXT,
    
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    
    ip_address VARCHAR(45),
    created_at DATETIME,
    lead_number VARCHAR(20),
    status ENUM('new', 'in_progress', 'contacted', 'converted', 'rejected') DEFAULT 'new',
    
    INDEX idx_created_at (created_at),
    INDEX idx_status (status),
    INDEX idx_lead_number (lead_number),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
?>