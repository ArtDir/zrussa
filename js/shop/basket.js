/**
 * Класс для управления страницей корзины
 */
class Basket {
	constructor() {
		this.cartItems = [];
		this.basketContent = document.querySelector('.basket__content');
		this.basketDescription = document.querySelector('.basket__description p');

		// Дебаг: выводим все компоненты в консоль
		console.log('Баскет начал инициализацию');
		console.log('basketContent найден:', this.basketContent);
		console.log('basketDescription найден:', this.basketDescription);

		// Выводим содержимое localStorage
		const shopCartData = localStorage.getItem('shopCart');
		console.log('Содержимое localStorage[shopCart]:', shopCartData);

		this.init();
	}

	/**
	 * Инициализация корзины
	 */
	init() {
		console.log('Начало инициализации корзины');
		// Загружаем данные корзины и обновляем UI только после загрузки
		this.loadCartData()
			.then(() => {
				console.log('Данные корзины загружены:', this.cartItems);
				this.renderCartItems();
				this.updateDescription();
				console.log('Обновление UI завершено');
			})
			.catch(error => {
				console.error('Ошибка при инициализации корзины:', error);
			});
	}

	/**
	 * Загрузка данных корзины из localStorage
	 */
	/**
	 * Загрузка данных корзины из localStorage
	 * @returns {Promise} Promise, который разрешается после загрузки данных
	 */
	loadCartData() {
		console.log('Начало загрузки данных корзины');
		return new Promise(resolve => {
			try {
				const cartData = localStorage.getItem('shopCart');
				console.log('Полученные данные из localStorage:', cartData);

				if (cartData) {
					// Преобразуем данные из формата shopCart в формат корзины
					const shopCartData = JSON.parse(cartData);
					console.log('Парсинг данных корзины:', shopCartData);

					// Преобразуем формат данных из {id: quantity} в массив объектов
					this.cartItems = [];

					// Проверяем разные пути к файлу products.json
					console.log('Попытка загрузить products.json');

					// Пробуем несколько вариантов путей
					const paths = [
						'./js/shop/products.json',
						'/js/shop/products.json',
						'../js/shop/products.json',
						'../../js/shop/products.json',
					];

					// Пробуем каждый путь по очереди
					this.tryLoadProducts(paths, 0, shopCartData, resolve);
				} else {
					console.log('Корзина пуста');
					resolve();
				}
			} catch (error) {
				console.error('Ошибка при загрузке данных корзины:', error);
				this.cartItems = [];
				resolve();
			}
		});
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
		// Вся функция временно закомментирована, так как мы хотим верстать корзину вручную
		console.log('Функция отрисовки товаров временно отключена');
		return;

		/*
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
		*/
	}

	/**
	 * Создание HTML-элемента для товара в корзине
	 * @param {Object} item - данные о товаре
	 * @returns {HTMLElement} HTML-элемент товара
	 */
	// Этот метод также временно отключен
	createCartItemElement(item) {
		/*
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
		*/
		return document.createElement('div'); // Возвращаем пустой div на время отключения
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
	// Добавляем метод для последовательной проверки разных путей до products.json
	Basket.prototype.tryLoadProducts = function (
		paths,
		index,
		shopCartData,
		resolve
	) {
		if (index >= paths.length) {
			console.error('Не удалось загрузить products.json ни по одному из путей');
			resolve();
			return;
		}

		const path = paths[index];
		console.log(`Пробуем загрузить из ${path}`);

		fetch(path)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				console.log(`Успешно загружен файл из ${path}`);
				return response.json();
			})
			.then(products => {
				console.log('Получены данные о товарах:', products);

				// Преобразуем данные корзины
				for (const productId in shopCartData) {
					const quantity = shopCartData[productId];
					// Исправляем проблему с типами: преобразуем productId в число, для сравнения с p.id
					const numericProductId = parseInt(productId, 10);
					const product = products.find(p => p.id === numericProductId);
					console.log(
						`Поиск товара ID: ${productId} (${numericProductId}), найден:`,
						product
					);

					if (product) {
						// Исправляем несоответствие имен полей между products.json и шаблоном
						this.cartItems.push({
							id: product.id,
							title: product.name, // В JSON это поле называется 'name'
							description: product.description,
							price: product.price,
							image: product.picture, // В JSON это поле называется 'picture'
							quantity: quantity,
						});
					}
				}
				resolve();
			})
			.catch(error => {
				console.error(`Ошибка при загрузке из ${path}:`, error);
				// Пробуем следующий путь
				this.tryLoadProducts(paths, index + 1, shopCartData, resolve);
			});
	};

	// Отключаем инициализацию корзины для ручной верстки
	console.log('Инициализация Basket отключена для ручной верстки');
	// new Basket(); - Отключено для ручной верстки
});
