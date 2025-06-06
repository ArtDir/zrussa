<?php
/**
 * Скрипт обработки уведомлений от Робокассы (ResultURL)
 * Этот скрипт вызывается Робокассой после успешного платежа
 * и отправляет уведомление о платеже на вебхук
 */

// Функция для отправки логов на email
function send_log_email($subject, $data) {
    $to = 'effest@gmail.com';
    $headers = 'From: webmaster@zrussa.ru' . "\r\n" .
             'Reply-To: webmaster@zrussa.ru' . "\r\n" .
             'Content-Type: text/html; charset=UTF-8' . "\r\n" .
             'X-Mailer: PHP/' . phpversion();
    
    $message = '<html><body>';
    $message .= '<h2>' . $subject . '</h2>';
    $message .= '<p>Время: ' . date('Y-m-d H:i:s') . '</p>';
    $message .= '<p>IP: ' . $_SERVER['REMOTE_ADDR'] . '</p>';
    $message .= '<p>Метод запроса: ' . $_SERVER['REQUEST_METHOD'] . '</p>';
    
    if (is_array($data)) {
        $message .= '<h3>Данные запроса:</h3>';
        $message .= '<table border="1" cellpadding="5">';
        foreach ($data as $key => $value) {
            $message .= '<tr><td><strong>' . htmlspecialchars($key) . '</strong></td><td>' . htmlspecialchars($value) . '</td></tr>';
        }
        $message .= '</table>';
    } else {
        $message .= '<p>' . $data . '</p>';
    }
    
    $message .= '</body></html>';
    
    return mail($to, $subject, $message, $headers);
}

// Отправляем лог о входящем запросе
send_log_email('Робокасса: Входящий запрос', $_REQUEST);

// Параметры Робокассы
$mrh_login = "zrussa";
$mrh_pass2 = "B66SZ5ZWBkTN2mYFuPn9"; // Пароль #2 для проверки уведомлений

// Получаем параметры от Робокассы (используем $_REQUEST для поддержки как GET, так и POST)
$out_summ = $_REQUEST["OutSum"] ?? '';
$inv_id = $_REQUEST["InvId"] ?? ""; // В простом магазине может отсутствовать
$signature = $_REQUEST["SignatureValue"] ?? '';

// Пытаемся логировать в файл, но игнорируем ошибки, если запись невозможна
$debug_log_file = __DIR__ . '/robokassa_debug.txt';
$debug_data = date('Y-m-d H:i:s') . " | Входящие параметры: " . json_encode($_REQUEST, JSON_UNESCAPED_UNICODE) . "\n";
@file_put_contents($debug_log_file, $debug_data, FILE_APPEND);

// Собираем все Shp_* параметры для подписи
$shp_params = [];
foreach ($_REQUEST as $key => $value) {
    if (strpos($key, 'Shp_') === 0) {
        $shp_params[$key] = $value;
    }
}

// Сортируем параметры по имени
ksort($shp_params);

// Формируем строку для проверки подписи
$crc_string = "$out_summ:$inv_id:$mrh_pass2";
foreach ($shp_params as $key => $value) {
    $crc_string .= ":$key=$value";
}

$crc = strtoupper(md5($crc_string));

// Проверяем подпись
if (strtoupper($signature) !== $crc) {
    $error_msg = "Неверная подпись. Получено: " . strtoupper($signature) . ", Вычислено: " . $crc;
    send_log_email('Робокасса: Ошибка подписи', $error_msg);
    echo "bad sign";
    exit;
}

// Отправляем лог об успешной проверке подписи
send_log_email('Робокасса: Подпись верифицирована', 'Подпись успешно проверена. Сумма: ' . $out_summ . ', ID: ' . $inv_id);

// Получаем дополнительные параметры, если они были переданы
$description = $_GET["Description"] ?? "Заказ без описания";

// Извлекаем данные из описания заказа
// Формат описания: "Заказ_дата_email"
preg_match('/Заказ_([^_]+)_([^_]+)/', $description, $matches);
$orderDate = $matches[1] ?? date('d.m.Y');
$email = $matches[2] ?? 'не указан';

// Пытаемся получить имя и телефон из описания, если они есть
$name = '';
if (preg_match('/Имя: ([^,]+)/', $description, $nameMatches)) {
    $name = $nameMatches[1];
}

$phone = '';
if (preg_match('/Телефон: ([^,]+)/', $description, $phoneMatches)) {
    $phone = $phoneMatches[1];
}

// Формируем данные для отправки на вебхук в том же формате, что и в JS
$webhook_data = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'address' => '',
    'comment' => '',
    'paymentMethod' => 'robokassa',
    'deliveryMethod' => '',
    'totalSum' => $out_summ,
    'products' => [],
    'payment_status' => 'paid',
    'payment_date' => date('Y-m-d H:i:s')
];

// URL вебхука для уведомления об оплаченных заказах
$webhook_url = 'https://hook.eu2.make.com/mjab95ygp4snnrhm17wx1thexcjfcunm';

// Отправляем данные на вебхук с улучшенными настройками CURL
$ch = curl_init($webhook_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Увеличиваем таймаут до 30 секунд
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Проверка SSL
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Следовать за редиректами
$response = curl_exec($ch);
$curl_error = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Получаем HTTP код ответа
curl_close($ch);

// Отправляем лог о результате отправки на вебхук
send_log_email('Робокасса: Результат отправки на вебхук', [
    'HTTP код' => $http_code,
    'Ответ' => $response,
    'Ошибка CURL' => $curl_error ?: 'Нет',
    'Отправленные данные' => json_encode($webhook_data, JSON_UNESCAPED_UNICODE)
]);

// Пытаемся записать информацию о платеже в лог-файл, но игнорируем ошибки, если запись невозможна
$log_file = __DIR__ . '/payment_log.txt';
$log_data = date('Y-m-d H:i:s') . " | Сумма: $out_summ | Email: $email | Описание: $description | HTTP код: $http_code | Webhook ответ: $response\n";
if ($curl_error) {
    $log_data .= " | cURL ошибка: $curl_error\n";
}
@file_put_contents($log_file, $log_data, FILE_APPEND);

// Возвращаем ответ Робокассе
echo "OK$inv_id";
