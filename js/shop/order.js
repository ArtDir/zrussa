/**
 * Модуль для обработки формы заказа
 */
class OrderForm {
  constructor() {
    this.form = document.querySelector('.order-form');
    this.phoneInput = this.form ? this.form.querySelector('input[type="tel"]') : null;
    this.emailInput = this.form ? this.form.querySelector('input[type="email"]') : null;
    
    this.init();
  }
  
  /**
   * Инициализация обработчиков формы
   */
  init() {
    if (!this.form) return;
    
    // Полностью сбрасываем форму при загрузке страницы
    this.form.reset();
    
    // Удаляем все классы валидации из каждого поля
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      // Сбрасываем стили валидации
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      input.setCustomValidity('');
      
      // Добавляем обработчики для очистки состояния при фокусе или вводе
      input.addEventListener('focus', () => {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        input.setCustomValidity('');
      });
      
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        input.setCustomValidity('');
      });
    });
    
    // Применяем валидацию телефона
    if (this.phoneInput) {
      this.phoneInput.addEventListener('input', this.formatPhoneNumber.bind(this));
      this.phoneInput.addEventListener('blur', this.validatePhoneNumber.bind(this));
    }
    
    // Добавляем обработчик отправки формы
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }
  
  /**
   * Форматирование номера телефона во время ввода
   * @param {Event} event - событие input
   */
  formatPhoneNumber(event) {
    let input = event.target;
    let inputValue = input.value.replace(/\D/g, ''); // Удаляем все не-цифры
    
    // Если первый символ не 7 и не 8, и есть значение, автоматически добавляем 7
    if (inputValue.length > 0 && inputValue[0] !== '7' && inputValue[0] !== '8') {
      inputValue = '7' + inputValue;
    }
    
    // Если начинается с 8, заменяем на 7
    if (inputValue.length > 0 && inputValue[0] === '8') {
      inputValue = '7' + inputValue.substring(1);
    }
    
    // Если есть значение, добавляем + в начале
    if (inputValue.length > 0) {
      inputValue = '+' + inputValue;
    }
    
    // Ограничиваем до 12 символов (+7 и 10 цифр номера)
    if (inputValue.length > 12) {
      inputValue = inputValue.substring(0, 12);
    }
    
    input.value = inputValue;
  }
  
  /**
   * Валидация номера телефона при потере фокуса
   * @param {Event} event - событие blur
   */
  validatePhoneNumber(event) {
    let input = event.target;
    let phoneNumber = input.value;
    
    // Проверка формата +7XXXXXXXXXX или 7XXXXXXXXXX
    const phoneRegex = /^\+?(7|8)[0-9]{10}$/;
    
    if (!phoneRegex.test(phoneNumber)) {
      input.setCustomValidity('Пожалуйста, введите корректный номер телефона в формате +79XXXXXXXXX');
      input.classList.add('invalid');
    } else {
      input.setCustomValidity('');
      input.classList.remove('invalid');
    }
  }
  
  /**
   * Обработка отправки формы
   * @param {Event} event - событие submit
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    // Проверяем валидность формы
    if (!this.form.checkValidity()) {
      // Форма недействительна, показываем стандартные сообщения валидации
      this.form.reportValidity();
      return;
    }
    
    // Получаем все поля формы
    const fullName = this.form.querySelector('input[placeholder="Имя и фамилия"]').value.trim();
    const phone = this.phoneInput.value.trim();
    const email = this.emailInput.value.trim();
    const country = this.form.querySelector('input[placeholder="Страна"]').value.trim();
    const city = this.form.querySelector('input[placeholder="Город"]').value.trim();
    const zipCode = this.form.querySelector('input[placeholder="Почтовый индекс"]').value.trim();
    const address = this.form.querySelector('input[placeholder="Адрес доставки"]').value.trim();
    
    // Получаем данные о товарах из корзины
    const cartItems = this.getCartItems();
    
    // Формируем описание заказа для поля projectDescription
    let projectDescription = 'Заказ из интернет-магазина:\n';
    
    if (cartItems && cartItems.length > 0) {
      // Добавляем информацию о каждом товаре в формате:
      // 1. Название товара - 2 шт. x 50000 руб. = 100000 руб.
      projectDescription += cartItems.map((item, index) => {
        const title = item.title || 'Товар';
        const author = item.author ? ` (Автор: ${item.author})` : '';
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = quantity * price;
        
        return `${index + 1}. ${title}${author} - ${quantity} шт. x ${price} руб. = ${total} руб.`;
      }).join('\n');
      
      // Подсчитываем общую сумму
      const totalSum = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      projectDescription += `\n\nИтого: ${totalSum} руб.`;
    } else {
      projectDescription += 'Корзина пуста';
    }
    
    // Формируем контактную информацию для поля contactInfo
    const contactInfo = `ФИО: ${fullName}\nТелефон: ${phone}\nEmail: ${email}\nСтрана: ${country}\nГород: ${city}\nИндекс: ${zipCode}\nАдрес: ${address}`;
    
    // Создаем объект с данными в формате, идентичном основной форме
    const formData = {
      projectDescription,
      contactInfo,
      submissionTime: new Date().toISOString(),
      orderType: 'shop_order', // Дополнительное поле для различения форм
      // Сохраняем исходные данные для возможной дополнительной обработки
      fullName,
      phone,
      email,
      country,
      city,
      zipCode,
      address,
      cartItems
    };
    
    try {
      // Показываем индикатор загрузки (изменяем текст кнопки)
      const submitButton = this.form.querySelector('.order-form__submit');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;
      
      // Отправляем данные на сервер
      const response = await fetch(
        'https://hook.eu2.make.com/mjab95ygp4snnrhm17wx1thexcjfcunm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      
      // Возвращаем кнопку в исходное состояние
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      if (response.ok) {
        // Очищаем корзину до перенаправления
        this.clearCart();
        
        // Немедленно перенаправляем на страницу успеха
        // Вместо очистки и показа очищенной формы показываем новую страницу
        window.location.href = 'success.html'; // Убрал начальный слэш, используем относительный путь
      } else {
        throw new Error('Не удалось отправить заказ');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.');
    }
  }
  
  /**
   * Получение товаров из корзины
   * @returns {Array} Массив товаров из корзины
   */
  getCartItems() {
    try {
      // Получаем данные корзины из localStorage по правильному ключу 'shopCart'
      const cartData = localStorage.getItem('shopCart');
      if (cartData) {
        const cartObject = JSON.parse(cartData);
        
        // Дополнительно загружаем данные о товарах из products.json
        return this.getProductsDetails(cartObject);
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении данных корзины:', error);
      return [];
    }
  }
  
  /**
   * Получение подробных данных о товарах из корзины
   * @param {Object} cartObject - Объект корзины из localStorage
   * @returns {Array} Массив товаров с подробной информацией
   */
  getProductsDetails(cartObject) {
    // Формируем массив товаров для отправки
    const cartItems = [];
    
    // Точные данные о товарах из products.json
    const productsMap = {
      '1': { title: 'Это не стратегия', price: 50000, author: 'Юрий Мороз' },
      '2': { title: 'Логика на примерах западной пропаганды', price: 5000, author: 'Павел Макевич' },
      '3': { title: 'Как при помощи правого полушария создавать новые идеи', price: 5000, author: 'Юрий Мороз' },
      '4': { title: 'Курс по развитию бизнеса', price: 50000, author: 'Юрий Мороз' },
      '5': { title: 'Логика мышления', price: 5000, author: 'Павел Макевич' },
      '6': { title: 'Креативное мышление', price: 5000, author: 'Юрий Мороз' }
    };
    
    // Преобразуем объект корзины в массив с подробной информацией о товарах
    for (const [productId, quantity] of Object.entries(cartObject)) {
      // Очищенный ID продукта (без префикса "product")
      const cleanId = productId.replace('product', '');
      
      // Получаем информацию о товаре из нашего справочника
      const product = productsMap[cleanId] || { title: `Товар ${cleanId}`, price: 999 };
      
      // Добавляем товар в массив
      cartItems.push({
        id: cleanId,
        title: product.title,
        author: product.author || '',
        price: product.price,
        quantity: quantity
      });
    }
    
    return cartItems;
  }
  
  /**
   * Полная очистка формы и сброс состояния валидации
   */
  clearForm() {
    // Сбрасываем всю форму (это лучше, чем просто очищать значения)
    this.form.reset();
    
    // Сбрасываем состояние валидации для каждого поля
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      // Удаляем классы стилей для невалидных полей
      input.classList.remove('invalid');
      // Сбрасываем пользовательскую валидацию
      input.setCustomValidity('');
    });
  }
  
  /**
   * Очистка корзины
   */
  clearCart() {
    try {
      // Очищаем корзину по правильному ключу 'shopCart'
      localStorage.removeItem('shopCart');
      console.log('Корзина успешно очищена');
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
    }
  }
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new OrderForm();
});
