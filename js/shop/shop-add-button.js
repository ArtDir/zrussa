/**
 * Модуль для работы с кнопками добавления товаров в корзину
 */
class ShopAddButton {
  constructor() {
    this.cart = [];
    this.bindEvents();
  }

  /**
   * Привязка обработчиков событий
   */
  bindEvents() {
    // Делегирование события для кнопок добавления товаров
    document.addEventListener('click', (event) => {
      if (event.target.closest('.shop-product__add-button')) {
        const button = event.target.closest('.shop-product__add-button');
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = button.dataset.productPrice;
        
        this.addToCart(productId, productName, productPrice);
      }
    });
  }

  /**
   * Добавление товара в корзину
   * @param {string} id - ID товара
   * @param {string} name - название товара
   * @param {number} price - цена товара
   */
  addToCart(id, name, price) {
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = this.cart.find(item => item.id === id);
    
    if (existingItem) {
      // Если есть, увеличиваем количество
      existingItem.quantity++;
    } else {
      // Если нет, добавляем новый товар
      this.cart.push({
        id,
        name,
        price,
        quantity: 1
      });
    }
    
    // Обновляем отображение корзины
    this.updateCartDisplay();
    
    console.log('Товар добавлен в корзину:', { id, name, price });
    console.log('Текущая корзина:', this.cart);
  }

  /**
   * Обновление отображения корзины
   */
  updateCartDisplay() {
    // Будет реализовано позже
    console.log('Обновление отображения корзины');
  }
}

// Экспортируем класс и создаем экземпляр
export default new ShopAddButton();
