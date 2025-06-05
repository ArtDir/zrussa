/**
 * Модуль для интеграции с платежной системой Робокасса
 */
class RobokassaPayment {
  constructor() {
    // Параметры Робокассы
    this.mrh_login = 'zrussa'; // Логин магазина
    this.mrh_pass1 = 'hy5cCWLUD320rU7DjVOI'; // Пароль 1
    this.mrh_pass2 = 'MI7Vpfv2m5ITvCdDJ1P0'; // Пароль 2 (для проверки результата)
    
    // Включаем тестовый режим
    this.isTest = 1; // Для тестового режима
    
    // URL для переадресации (используем относительные пути для локальной разработки)
    this.resultURL = '/success.html'; // Страница для обработки результата
    this.successURL = '/success.html'; // Страница успешной оплаты
    this.failURL = '/fail.html'; // Страница при ошибке оплаты
  }

  /**
   * Генерация случайного ID заказа в допустимом диапазоне для Робокассы
   * @returns {string} - ID заказа
   */
  generateOrderId() {
    // Максимальное значение для 32-битного целого числа со знаком: 2147483647 (2^31-1)
    const maxValue = 2147483647;
    // Генерируем случайное число от 1 до maxValue
    const randomNumber = Math.floor(Math.random() * maxValue) + 1;
    console.log('Сгенерирован ID заказа:', randomNumber);
    return randomNumber.toString();
  }

  /**
   * Вычисление MD5 хеша для SignatureValue
   * @param {string} str - Строка для хеширования
   * @returns {string} - MD5 хеш
   */
  md5(str) {
    // Используем внешнюю библиотеку md5.min.js
    // Библиотека добавляет функцию в глобальный объект
    if (typeof md5 === 'function') {
      return md5(str);
    } else if (typeof window.md5 === 'function') {
      return window.md5(str);
    } else {
      // Если библиотека не загружена, используем простой хеш
      console.warn('Библиотека MD5 не найдена, используем временное решение');
      let hash = 0;
      
      // Простой алгоритм хеширования
      let s = str.toString();
      for (let i = 0; i < s.length; i++) {
        let char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
      }
      
      // Преобразуем в шестнадцатеричную строку
      let hashHex = (hash >>> 0).toString(16);
      
      // Дополняем до 32 символов
      while (hashHex.length < 32) {
        hashHex = '0' + hashHex;
      }
      
      return hashHex;
    }
  }

  /**
   * Создание ссылки для оплаты через Робокассу
   * @param {string} outSum - Сумма заказа
   * @param {string} invId - Номер заказа
   * @param {string} invDesc - Описание заказа
   * @returns {string} - URL для перехода на страницу оплаты
   */
  createPaymentUrl(outSum, invId, invDesc) {
    // Формируем строку для подписи
    const signatureString = `${this.mrh_login}:${outSum}:${invId}:${this.mrh_pass1}`;
    
    // Вычисляем подпись
    const signatureValue = this.md5(signatureString);
    
    // Формируем URL для перехода на страницу оплаты
    const url = new URL('https://auth.robokassa.ru/Merchant/Index.aspx');
    
    // Добавляем параметры
    url.searchParams.append('MerchantLogin', this.mrh_login);
    url.searchParams.append('OutSum', outSum);
    url.searchParams.append('InvoiceID', invId);
    url.searchParams.append('Description', invDesc);
    url.searchParams.append('SignatureValue', signatureValue);
    
    // Добавляем параметр для тестового режима
    if (this.isTest) {
      url.searchParams.append('IsTest', this.isTest);
    }
    
    // Добавляем URL для переадресации
    url.searchParams.append('SuccessURL', this.successURL);
    url.searchParams.append('FailURL', this.failURL);
    url.searchParams.append('ResultURL', this.resultURL);
    
    // Сохраняем информацию о заказе в localStorage для последующей обработки результата
    localStorage.setItem('currentOrderId', invId);
    localStorage.setItem('currentOrderSum', outSum);
    
    console.log('Создана ссылка для оплаты через Робокассу:', url.toString());
    return url.toString();
  }

  /**
   * Расчет общей суммы заказа
   * @param {Array} cartItems - Массив товаров в корзине
   * @returns {number} - Общая сумма заказа
   */
  calculateTotal(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }
    
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }

  /**
   * Инициация платежа через Робокассу
   * @param {Object} orderData - Данные заказа
   * @param {Array} cartItems - Товары в корзине
   * @returns {string} - URL для перехода на страницу оплаты
   */
  initiatePayment(orderData, cartItems) {
    // Генерируем уникальный ID заказа
    const orderId = this.generateOrderId();
    
    // Вычисляем общую сумму заказа
    const totalSum = this.calculateTotal(cartItems);
    
    // Формируем описание заказа
    const orderDescription = `Заказ №${orderId} от ${orderData.fullName}`;
    
    // Сохраняем данные заказа в localStorage
    const fullOrderData = {
      ...orderData,
      orderId,
      totalSum,
      cartItems,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`order_${orderId}`, JSON.stringify(fullOrderData));
    
    // Создаем URL для оплаты
    return this.createPaymentUrl(
      totalSum.toString(),
      orderId,
      orderDescription
    );
  }
}

// Экспортируем класс для использования в других модулях
export default RobokassaPayment;
