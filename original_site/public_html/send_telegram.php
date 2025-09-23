<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Логирование для отладки
function logMessage($message) {
    $log = date('Y-m-d H:i:s') . " - " . $message . "\n";
    file_put_contents('/tmp/telegram_log.txt', $log, FILE_APPEND | LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    logMessage("ERROR: Method not allowed - " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
logMessage("Received input: " . $input);

$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    logMessage("ERROR: Invalid JSON - " . json_last_error_msg());
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$token = '7980366385:AAEHsomQxeZQ_sM-OBOK-NrVPgUAhhkABno';

// Используем рабочий Chat ID + дополнительные если нужно
$chat_ids = [
    '5849303048', // Рабочий Chat ID
    '6418581124' // Добавьте дополнительные Chat ID здесь, если нужно
];

$message = "🔔 <b>Новая заявка с сайта pz.dp.ua</b>\n\n";
$message .= "👤 <b>Имя:</b> " . htmlspecialchars($data['name'] ?? 'Не указано') . "\n";
$message .= "📱 <b>Телефон:</b> " . htmlspecialchars($data['phone'] ?? 'Не указан') . "\n";
$message .= "📧 <b>Email:</b> " . htmlspecialchars($data['email'] ?? 'Не указан') . "\n";
$message .= "💬 <b>Сообщение:</b>\n" . htmlspecialchars($data['message'] ?? 'Не указано') . "\n\n";
$message .= "🕐 <b>Время:</b> " . date('Y-m-d H:i:s');

logMessage("Prepared message: " . $message);

$success_count = 0;
$total_chats = count($chat_ids);
$errors = [];

foreach ($chat_ids as $chat_id) {
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $post_data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    logMessage("Chat ID: $chat_id, HTTP Code: $http_code, Response: $response");

    if ($curl_error) {
        $errors[] = "Chat ID $chat_id: CURL Error - $curl_error";
        logMessage("CURL Error for chat $chat_id: $curl_error");
        continue;
    }

    if ($http_code === 200) {
        $telegram_response = json_decode($response, true);
        if ($telegram_response && $telegram_response['ok']) {
            $success_count++;
            logMessage("SUCCESS: Message sent to chat $chat_id, Message ID: " . $telegram_response['result']['message_id']);
        } else {
            $error_desc = $telegram_response['description'] ?? 'Unknown error';
            $errors[] = "Chat ID $chat_id: $error_desc";
            logMessage("Telegram API Error for chat $chat_id: $error_desc");
        }
    } else {
        $errors[] = "Chat ID $chat_id: HTTP $http_code";
        logMessage("HTTP Error for chat $chat_id: $http_code");
    }
}

if ($success_count > 0) {
    logMessage("SUCCESS: $success_count/$total_chats messages sent successfully");
    echo json_encode([
        'success' => true, 
        'message' => "Сообщение отправлено в $success_count из $total_chats чатов",
        'details' => [
            'sent' => $success_count,
            'total' => $total_chats,
            'errors' => $errors
        ]
    ]);
} else {
    http_response_code(500);
    logMessage("FAILURE: No messages sent. Errors: " . implode('; ', $errors));
    echo json_encode([
        'error' => 'Ошибка отправки сообщения',
        'details' => $errors
    ]);
}
?>
