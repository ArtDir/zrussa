/**
 * Модуль для работы с нижним меню корзины
 */
class ShopBottomMenu {
  constructor() {
    this.menuElement = null;
    this.totalElement = null;
    this.cart = {};
    this.products = [];
    
    this.init();
  }
  
  /**
   * Инициализация нижнего меню корзины
   */
  init() {
    // Создаем элемент меню, если его еще нет на странице
    this.createMenuElement();
    
    // Загружаем актуальные данные о корзине
    this.loadCartData();
    
    // Загружаем данные о товарах для расчета суммы
    this.loadProductsData()
      .then(() => {
        // Обновляем отображение после загрузки данных
        this.updateDisplay();
      });
    
    // Устанавливаем слушатель события для обновления при изменении localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'shopCart') {
        this.loadCartData();
        this.updateDisplay();
      }
    });
    
    // Устанавливаем кастомное событие для обновления меню при изменении корзины из текущего окна
    document.addEventListener('cartUpdated', () => {
      this.loadCartData();
      this.updateDisplay();
    });
  }
  
  /**
   * Создание элемента меню на странице
   */
  createMenuElement() {
    // Проверяем, существует ли уже меню
    if (document.querySelector('.shop-bottom-menu')) {
      this.menuElement = document.querySelector('.shop-bottom-menu');
      this.totalElement = this.menuElement.querySelector('.shop-bottom-menu__total');
      return;
    }
    
    // Создаем элемент меню
    const menuHTML = `
      <div class="shop-bottom-menu">
        <p class="shop-bottom-menu__total">Товаров в корзине на сумму: 0 руб.</p>
        <button class="shop-bottom-menu__button">перейти в корзину</button>
      </div>
    `;
    
    // Добавляем меню на страницу
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    // Сохраняем ссылки на элементы
    this.menuElement = document.querySelector('.shop-bottom-menu');
    this.totalElement = this.menuElement.querySelector('.shop-bottom-menu__total');
    
    // Добавляем обработчик на кнопку
    const cartButton = this.menuElement.querySelector('.shop-bottom-menu__button');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        // В будущем здесь будет переход в корзину
        console.log('Переход в корзину');
      });
    }
  }
  
  /**
   * Загрузка данных корзины из localStorage
   */
  loadCartData() {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        console.error('Ошибка при загрузке корзины:', e);
        this.cart = {};
      }
    } else {
      this.cart = {};
    }
  }
  
  /**
   * Загрузка данных о товарах из JSON файла
   * @returns {Promise} Promise
   */
  async loadProductsData() {
    try {
      const response = await fetch('../js/shop/products.json');
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      this.products = await response.json();
    } catch (error) {
      console.error('Ошибка при загрузке данных товаров:', error);
      this.products = [];
    }
  }
  
  /**
   * Расчет общей суммы товаров в корзине
   * @returns {number} Сумма товаров в корзине
   */
  calculateTotal() {
    let total = 0;
    
    // Перебираем все товары в корзине
    Object.keys(this.cart).forEach(productId => {
      const quantity = this.cart[productId];
      
      // Находим информацию о товаре
      const product = this.products.find(p => p.id.toString() === productId);
      if (product) {
        total += product.price * quantity;
      }
    });
    
    return total;
  }
  
  /**
   * Форматирование суммы в российском формате
   * @param {number} amount - сумма
   * @returns {string} отформатированная сумма
   */
  formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' руб.';
  }
  
  /**
   * Обновление отображения меню
   */
  updateDisplay() {
    const total = this.calculateTotal();
    
    // Обновляем текст с суммой
    if (this.totalElement) {
      this.totalElement.textContent = `Товаров в корзине на сумму: ${this.formatAmount(total)}`;
    }
    
    // Показываем или скрываем меню в зависимости от наличия товаров в корзине
    if (total > 0) {
      this.menuElement.classList.add('shop-bottom-menu--visible');
    } else {
      this.menuElement.classList.remove('shop-bottom-menu--visible');
    }
  }
}

// Экспортируем класс и создаем экземпляр
export default new ShopBottomMenu();
