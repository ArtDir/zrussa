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
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data, JSON_UNESCAPED_UNICODE));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
// Добавляем важные настройки для надежности
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // Таймаут соединения 10 секунд
curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Общий таймаут 30 секунд
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Проверка SSL сертификата
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Следовать за редиректами

// Выполняем запрос и проверяем результат
$response = curl_exec($ch);
$curl_error = null;

// Проверяем, были ли ошибки при выполнении запроса
if ($response === false) {
    $curl_error = curl_error($ch);
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Записываем результат в сессию для просмотра на странице успеха
session_start();
$_SESSION['webhook_result'] = [
    'time' => date('Y-m-d H:i:s'),
    'http_code' => $http_code,
    'response' => $response,
    'error' => $curl_error,
    'data_sent' => $webhook_data
];
session_write_close();

// Возвращаем ответ Робокассе
echo "OK$inv_id";
