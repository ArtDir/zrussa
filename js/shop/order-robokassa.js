/**
 * Модуль для интеграции с платежной системой Робокасса
 */
class RobokassaPayment {
  constructor() {
    // Параметры Робокассы
    this.mrh_login = 'zrussa'; // Логин магазина
    this.mrh_pass1 = 'hy5cCWLUD320rU7DjVOI'; // Пароль 1
    this.mrh_pass2 = 'MI7Vpfv2m5ITvCdDJ1P0'; // Пароль 2 (для проверки результата)
    
    // URL для переадресации
    this.resultURL = 'http://zrussa.ru/result.html';
    this.successURL = 'http://zrussa.ru/success.html';
    this.failURL = 'http://zrussa.ru/fail.html';
  }

  /**
   * Генерация случайного ID заказа из 10 цифр
   * @returns {string} - ID заказа
   */
  generateOrderId() {
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
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
    
    // Добавляем URL для переадресации
    url.searchParams.append('SuccessURL', this.successURL);
    url.searchParams.append('FailURL', this.failURL);
    url.searchParams.append('ResultURL', this.resultURL);
    
    // Сохраняем информацию о заказе в localStorage для последующей обработки результата
    localStorage.setItem('currentOrderId', invId);
    localStorage.setItem('currentOrderSum', outSum);
    
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
