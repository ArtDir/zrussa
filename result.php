<?php
/**
 * Скрипт обработки уведомлений от Робокассы (ResultURL)
 * Этот скрипт вызывается Робокассой после успешного платежа
 * и отправляет уведомление о платеже на вебхук
 */

// Параметры Робокассы
$mrh_login = "zrussa";
$mrh_pass2 = "B66SZ5ZWBkTN2mYFuPn9"; // Пароль #2 для проверки уведомлений

// Получаем параметры от Робокассы (явно используем $_GET, так как в настройках указан метод GET)
$out_summ = $_GET["OutSum"] ?? '';
$inv_id = $_GET["InvId"] ?? ""; // В простом магазине может отсутствовать
$signature = $_GET["SignatureValue"] ?? '';

// Логируем все входящие параметры для отладки
$debug_log_file = __DIR__ . '/robokassa_debug.txt';
$debug_data = date('Y-m-d H:i:s') . " | Входящие параметры: " . json_encode($_GET, JSON_UNESCAPED_UNICODE) . "\n";
file_put_contents($debug_log_file, $debug_data, FILE_APPEND);

// Формируем строку для проверки подписи
$crc = strtoupper(md5("$out_summ:$inv_id:$mrh_pass2"));

// Проверяем подпись
if (strtoupper($signature) !== $crc) {
    $error_msg = "Неверная подпись. Получено: " . strtoupper($signature) . ", Вычислено: " . $crc;
    file_put_contents($debug_log_file, date('Y-m-d H:i:s') . " | Ошибка: $error_msg\n", FILE_APPEND);
    echo "bad sign";
    exit;
}

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

// Отправляем данные на вебхук
$ch = curl_init($webhook_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$curl_error = curl_error($ch);
curl_close($ch);

// Записываем информацию о платеже в лог-файл
$log_file = __DIR__ . '/payment_log.txt';
$log_data = date('Y-m-d H:i:s') . " | Сумма: $out_summ | Email: $email | Описание: $description | Отправленные данные: " . json_encode($webhook_data, JSON_UNESCAPED_UNICODE) . " | Webhook ответ: $response\n";
if ($curl_error) {
    $log_data .= " | cURL ошибка: $curl_error\n";
}
file_put_contents($log_file, $log_data, FILE_APPEND);

// Возвращаем ответ Робокассе
echo "OK$inv_id";
