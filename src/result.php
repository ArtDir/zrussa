<?php
/**
 * Скрипт обработки уведомлений от Робокассы (ResultURL)
 * Этот скрипт вызывается Робокассой после успешного платежа
 * и отправляет уведомление о платеже на вебхук
 */

// Параметры Робокассы
$mrh_login = "zrussa";
$mrh_pass2 = "B66SZ5ZWBkTN2mYFuPn9"; // Пароль #2 для проверки уведомлений

// Получаем параметры от Робокассы
$out_summ = $_REQUEST["OutSum"];
$inv_id = $_REQUEST["InvId"] ?? ""; // В простом магазине может отсутствовать
$signature = $_REQUEST["SignatureValue"];

// Формируем строку для проверки подписи
$crc = strtoupper(md5("$out_summ:$inv_id:$mrh_pass2"));

// Проверяем подпись
if (strtoupper($signature) !== $crc) {
    echo "bad sign";
    exit;
}

// Получаем дополнительные параметры, если они были переданы
$description = $_REQUEST["Description"] ?? "Заказ без описания";

// Извлекаем данные из описания заказа
// Формат описания: "Заказ_дата_email"
preg_match('/Заказ_([^_]+)_([^_]+)/', $description, $matches);
$orderDate = $matches[1] ?? date('d.m.Y');

// Проверяем, есть ли email в параметрах запроса от Робокассы
// Сначала проверяем параметр EMail, если он есть
if (isset($_REQUEST['EMail']) && !empty($_REQUEST['EMail'])) {
    $email = $_REQUEST['EMail'];
} elseif (isset($matches[2]) && !empty($matches[2])) {
    $email = $matches[2];
} else {
    $email = 'не указан';
}

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
curl_close($ch);

// Записываем информацию о платеже в лог-файл
$log_file = __DIR__ . '/payment_log.txt';
$log_data = date('Y-m-d H:i:s') . " | Сумма: $out_summ | Email: $email | Описание: $description | Отправленные данные: " . json_encode($webhook_data, JSON_UNESCAPED_UNICODE) . " | Webhook ответ: $response\n";
file_put_contents($log_file, $log_data, FILE_APPEND);

// Также записываем все полученные параметры для отладки
$debug_log_file = __DIR__ . '/payment_debug_log.txt';
$debug_data = date('Y-m-d H:i:s') . " | Полученные параметры: " . json_encode($_REQUEST, JSON_UNESCAPED_UNICODE) . "\n";
file_put_contents($debug_log_file, $debug_data, FILE_APPEND);

// Возвращаем ответ Робокассе
echo "OK$inv_id";
