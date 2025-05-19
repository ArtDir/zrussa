/**
 * Модуль для работы с кнопками добавления товаров в корзину
 */
class ShopAddButton {
  constructor() {
    this.cart = {}; // Храним товары в объекте с ключами по ID
    this.bindEvents();
    this.init();
  }

  /**
   * Инициализация корзины
   */
  init() {
    // Загружаем корзину из localStorage, если она там есть
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
        this.updateAllCounters();
      } catch (e) {
        console.error('Ошибка при загрузке корзины:', e);
        this.cart = {};
      }
    }
  }

  /**
   * Привязка обработчиков событий
   */
  bindEvents() {
    // Делегируем события клика на документ
    document.addEventListener('click', (event) => {
      // Кнопка "добавить"
      const addButton = event.target.closest('.shop-products__item-button');
      if (addButton && !addButton.closest('.shop-products__item-counter__button')) {
        const productItem = addButton.closest('.shop-products__item');
        const productId = productItem.dataset.productId;
        
        if (productId) {
          this.addToCart(productId, productItem);
          event.preventDefault();
        }
      }
      
      // Кнопка "-" (уменьшение количества)
      const minusButton = event.target.closest('.shop-products__item-counter__button:first-child');
      if (minusButton) {
        const productItem = minusButton.closest('.shop-products__item');
        const productId = productItem.dataset.productId;
        
        if (productId) {
          this.decreaseQuantity(productId, productItem);
          event.preventDefault();
        }
      }
      
      // Кнопка "+" (увеличение количества)
      const plusButton = event.target.closest('.shop-products__item-counter__button:last-child');
      if (plusButton) {
        const productItem = plusButton.closest('.shop-products__item');
        const productId = productItem.dataset.productId;
        
        if (productId) {
          this.increaseQuantity(productId, productItem);
          event.preventDefault();
        }
      }
    });
  }

  /**
   * Добавление товара в корзину
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  addToCart(productId, productItem) {
    // Добавляем товар в корзину или увеличиваем количество
    if (this.cart[productId]) {
      this.cart[productId]++;
    } else {
      this.cart[productId] = 1;
    }
    
    // Сохраняем корзину в localStorage
    this.saveCart();
    
    // Заменяем кнопку на счетчик
    this.switchToCounter(productId, productItem);
    
    console.log('Товар добавлен в корзину:', productId);
    console.log('Текущая корзина:', this.cart);
  }

  /**
   * Увеличение количества товара
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  increaseQuantity(productId, productItem) {
    if (this.cart[productId]) {
      this.cart[productId]++;
      this.updateCounter(productId, productItem);
      this.saveCart();
    }
  }

  /**
   * Уменьшение количества товара
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  decreaseQuantity(productId, productItem) {
    if (this.cart[productId]) {
      if (this.cart[productId] > 1) {
        this.cart[productId]--;
        this.updateCounter(productId, productItem);
      } else {
        // Если остался только 1 товар, удаляем его из корзины
        delete this.cart[productId];
        this.switchToButton(productId, productItem);
      }
      this.saveCart();
    }
  }

  /**
   * Сохранение корзины в localStorage и оповещение об изменениях
   */
  saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(this.cart));
    
    // Создаем и диспетчеризуем событие обновления корзины
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
  }

  /**
   * Замена кнопки на счетчик товаров
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  switchToCounter(productId, productItem) {
    const addButton = productItem.querySelector('.shop-products__item-button');
    if (!addButton) return;

    // Создаем счетчик
    const counterHTML = `
      <div class="shop-products__item-counter">
        <button class="shop-products__item-counter__button button">
          <img src="images/icons/button_minus.svg" alt="" class="shop-products__item-counter-icon" />
        </button>
        <div class="shop-products__item-counter__count">
          <img src="images/icons/shop_basket.svg" alt="" class="shop-products__item-button-icon" />
          ${this.cart[productId]}
        </div>
        <button class="shop-products__item-counter__button button">
          <img src="images/icons/button_plus.svg" alt="" class="shop-products__item-counter-icon" />
        </button>
      </div>
    `;

    // Заменяем кнопку на счетчик
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = counterHTML.trim();
    const counterElement = tempDiv.firstChild;
    addButton.parentNode.replaceChild(counterElement, addButton);
  }

  /**
   * Замена счетчика на кнопку добавления
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  switchToButton(productId, productItem) {
    const counter = productItem.querySelector('.shop-products__item-counter');
    if (!counter) return;

    // Создаем кнопку добавления
    const buttonHTML = `
      <button class="shop-products__item-button button" type="button">
        <img src="images/icons/shop_basket.svg" alt="" class="shop-products__item-button-icon" />
        добавить
      </button>
    `;

    // Заменяем счетчик на кнопку
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = buttonHTML.trim();
    const buttonElement = tempDiv.firstChild;
    counter.parentNode.replaceChild(buttonElement, counter);
  }

  /**
   * Обновление счетчика товаров
   * @param {string} productId - ID товара
   * @param {HTMLElement} productItem - HTML элемент карточки товара
   */
  updateCounter(productId, productItem) {
    const countElement = productItem.querySelector('.shop-products__item-counter__count');
    if (countElement && this.cart[productId]) {
      // Обновляем текст в счетчике
      const iconHTML = '<img src="images/icons/shop_basket.svg" alt="" class="shop-products__item-button-icon" />';
      countElement.innerHTML = iconHTML + this.cart[productId];
    }
  }

  /**
   * Обновление всех счетчиков на странице
   */
  updateAllCounters() {
    // Проходим по всем товарам в корзине
    Object.keys(this.cart).forEach(productId => {
      const productItems = document.querySelectorAll(`.shop-products__item[data-product-id="${productId}"]`);
      
      productItems.forEach(productItem => {
        // Если у товара есть кнопка добавления, заменяем её на счетчик
        const addButton = productItem.querySelector('.shop-products__item-button');
        if (addButton && !productItem.querySelector('.shop-products__item-counter')) {
          this.switchToCounter(productId, productItem);
        } else {
          // Если счетчик уже есть, обновляем его
          this.updateCounter(productId, productItem);
        }
      });
    });
  }
}

// Экспортируем класс и создаем экземпляр
export default new ShopAddButton();
