/**
 * Класс для управления страницей корзины
 */
class Basket {
	constructor() {
		this.cartItems = [];
		this.basketContent = document.querySelector('.basket__content');
		this.basketDescription = document.querySelector('.basket__description p');

		this.init();
	}

	/**
	 * Инициализация корзины
	 */
	init() {
		this.loadCartData();
		this.renderCartItems();
		this.updateDescription();
	}

	/**
	 * Загрузка данных корзины из localStorage
	 */
	loadCartData() {
		try {
			const cartData = localStorage.getItem('shopCart');
			if (cartData) {
				// Преобразуем данные из формата shopCart в формат корзины
				const shopCartData = JSON.parse(cartData);

				// Преобразуем формат данных из {id: quantity} в массив объектов
				this.cartItems = [];

				// Загружаем данные о товарах для получения дополнительной информации
				fetch('../js/shop/products.json')
					.then(response => response.json())
					.then(products => {
						// Преобразуем данные корзины
						for (const productId in shopCartData) {
							const quantity = shopCartData[productId];
							const product = products.find(p => p.id === productId);

							if (product) {
								this.cartItems.push({
									id: product.id,
									title: product.title,
									description: product.description,
									price: product.price,
									image: product.image,
									quantity: quantity,
								});
							}
						}
						// Обновляем отображение после загрузки данных
						this.updateUI();
					})
					.catch(error => {
						console.error('Ошибка при загрузке данных о товарах:', error);
					});
			}
		} catch (error) {
			console.error('Ошибка при загрузке данных корзины:', error);
			this.cartItems = [];
		}
	}

	/**
	 * Обновление описания корзины с информацией о количестве товаров и общей сумме
	 */
	updateDescription() {
		if (!this.basketDescription) return;

		const itemCount = this.cartItems.reduce(
			(sum, item) => sum + item.quantity,
			0
		);
		const totalAmount = this.cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);

		let itemsText = 'товаров';
		if (itemCount % 10 === 1 && itemCount % 100 !== 11) {
			itemsText = 'товар';
		} else if (
			[2, 3, 4].includes(itemCount % 10) &&
			![12, 13, 14].includes(itemCount % 100)
		) {
			itemsText = 'товара';
		}

		this.basketDescription.textContent = `${itemCount} ${itemsText} на сумму ${this.formatAmount(
			totalAmount
		)} руб. Доставка по России входит в стоимость товаров.`;
	}

	/**
	 * Форматирование суммы с разделителями разрядов
	 * @param {number} amount - сумма для форматирования
	 * @returns {string} отформатированная сумма
	 */
	formatAmount(amount) {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	/**
	 * Отображение товаров в корзине
	 */
	renderCartItems() {
		if (!this.basketContent) return;

		// Очищаем контейнер корзины
		this.basketContent.innerHTML = '';

		if (this.cartItems.length === 0) {
			this.basketContent.innerHTML =
				'<div class="basket__empty">Ваша корзина пуста</div>';
			return;
		}

		// Создаем элементы для каждого товара в корзине
		this.cartItems.forEach(item => {
			const itemElement = this.createCartItemElement(item);
			this.basketContent.appendChild(itemElement);
		});

		// Добавляем кнопку оформления заказа
		const checkoutButton = document.createElement('button');
		checkoutButton.className = 'basket__checkout-button button';
		checkoutButton.textContent = 'Оформить заказ';
		checkoutButton.addEventListener('click', () => this.handleCheckout());

		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'basket__button-container';
		buttonContainer.appendChild(checkoutButton);

		this.basketContent.appendChild(buttonContainer);
	}

	/**
	 * Создание HTML-элемента для товара в корзине
	 * @param {Object} item - данные о товаре
	 * @returns {HTMLElement} HTML-элемент товара
	 */
	createCartItemElement(item) {
		const itemElement = document.createElement('div');
		itemElement.className = 'basket__item';
		itemElement.dataset.id = item.id;

		// Создаем разметку для элемента корзины
		itemElement.innerHTML = `
      <div class="basket__item-image">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
      </div>
      <div class="basket__item-content">
        <h3 class="basket__item-title">${item.title}</h3>
        <p class="basket__item-description">${item.description}</p>
        <p class="basket__item-price">${this.formatAmount(item.price)} руб.</p>
      </div>
      <div class="basket__item-quantity">
        <button class="basket__item-decrease">-</button>
        <span class="basket__item-count">${item.quantity}</span>
        <button class="basket__item-increase">+</button>
      </div>
      <div class="basket__item-total">
        <span>${this.formatAmount(item.price * item.quantity)} руб.</span>
      </div>
      <button class="basket__item-remove" aria-label="Удалить товар">
        <img src="images/icons/button_cross.svg" alt="Удалить" />
      </button>
    `;

		// Добавляем обработчики событий для кнопок
		const decreaseButton = itemElement.querySelector('.basket__item-decrease');
		const increaseButton = itemElement.querySelector('.basket__item-increase');
		const removeButton = itemElement.querySelector('.basket__item-remove');

		decreaseButton.addEventListener('click', () =>
			this.decreaseItemQuantity(item.id)
		);
		increaseButton.addEventListener('click', () =>
			this.increaseItemQuantity(item.id)
		);
		removeButton.addEventListener('click', () => this.removeItem(item.id));

		return itemElement;
	}

	/**
	 * Увеличение количества товара
	 * @param {string} itemId - ID товара
	 */
	increaseItemQuantity(itemId) {
		const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
		if (itemIndex !== -1) {
			this.cartItems[itemIndex].quantity += 1;
			this.saveCartData();
			this.updateUI();
		}
	}

	/**
	 * Уменьшение количества товара
	 * @param {string} itemId - ID товара
	 */
	decreaseItemQuantity(itemId) {
		const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
		if (itemIndex !== -1) {
			if (this.cartItems[itemIndex].quantity > 1) {
				this.cartItems[itemIndex].quantity -= 1;
			} else {
				// Если количество равно 1, удаляем товар
				this.removeItem(itemId);
				return;
			}
			this.saveCartData();
			this.updateUI();
		}
	}

	/**
	 * Удаление товара из корзины
	 * @param {string} itemId - ID товара
	 */
	removeItem(itemId) {
		this.cartItems = this.cartItems.filter(item => item.id !== itemId);
		this.saveCartData();
		this.updateUI();
	}

	/**
	 * Сохранение данных корзины в localStorage
	 */
	saveCartData() {
		try {
			// Создаем объект в формате {productId: quantity}
			const shopCartData = {};
			this.cartItems.forEach(item => {
				shopCartData[item.id] = item.quantity;
			});

			// Сохраняем в localStorage с ключом 'shopCart'
			localStorage.setItem('shopCart', JSON.stringify(shopCartData));

			// Создаем и диспетчеризуем событие обновления корзины
			const event = new CustomEvent('cartUpdated');
			document.dispatchEvent(event);
		} catch (error) {
			console.error('Ошибка при сохранении данных корзины:', error);
		}
	}

	/**
	 * Обновление UI после изменений в корзине
	 */
	updateUI() {
		this.renderCartItems();
		this.updateDescription();
	}

	/**
	 * Обработка нажатия на кнопку оформления заказа
	 */
	handleCheckout() {
		// Здесь будет логика оформления заказа
		alert('Функция оформления заказа находится в разработке');
	}
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	new Basket();
});
