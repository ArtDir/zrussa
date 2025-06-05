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

// Формируем данные для отправки на вебхук
$webhook_data = [
    'event' => 'payment_success',
    'payment_date' => date('Y-m-d H:i:s'),
    'amount' => $out_summ,
    'description' => $description,
    // Извлекаем email из описания, если он там есть
    'email' => preg_match('/Email: ([^,]+)/', $description, $matches) ? $matches[1] : 'не указан'
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
$log_data = date('Y-m-d H:i:s') . " | Сумма: $out_summ | Описание: $description | Webhook ответ: $response\n";
file_put_contents($log_file, $log_data, FILE_APPEND);

// Возвращаем ответ Робокассе
echo "OK$inv_id";
