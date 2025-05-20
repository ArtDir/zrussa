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
      // Добавляем информацию о каждом товаре
      projectDescription += cartItems.map((item, index) => {
        return `${index + 1}. ${item.title || 'Товар'} - ${item.quantity || 1} шт. x ${item.price || 0} руб. = ${(item.quantity || 1) * (item.price || 0)} руб.`;
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
        // Очищаем форму и корзину
        this.clearForm();
        this.clearCart();
        
        // Показываем сообщение об успехе
        alert('Заказ успешно оформлен! Спасибо за покупку.');
        
        // Редирект на главную страницу (в будущем можно изменить на страницу оплаты)
        window.location.href = '/';
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
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        return JSON.parse(cartData);
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении данных корзины:', error);
      return [];
    }
  }
  
  /**
   * Очистка формы
   */
  clearForm() {
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
    });
  }
  
  /**
   * Очистка корзины
   */
  clearCart() {
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
    }
  }
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new OrderForm();
});
