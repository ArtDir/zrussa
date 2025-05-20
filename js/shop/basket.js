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

		this.basketDescription.innerHTML = `${itemCount} ${itemsText} на сумму ${this.formatAmount(
			totalAmount
		)} руб.<br> Доставка по России входит в стоимость товаров.`;
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
		console.log('Рендерим товары в существующей HTML-структуре');

		// Получаем контейнер для товаров
		const productsContainer = document.querySelector(
			'.basket__content-products'
		);
		if (!productsContainer) {
			console.error('Не найден контейнер для товаров');
			return;
		}

		// Очищаем контейнер товаров
		productsContainer.innerHTML = '';

		// Получаем элемент с итоговой суммой
		const totalCostElement = document.querySelector(
			'.basket__content-total_cost h3'
		);

		if (this.cartItems.length === 0) {
			console.log('Корзина пуста');
			productsContainer.innerHTML =
				'<div class="basket__empty">Ваша корзина пуста. Выберите хотябы один товар на <a href="/shop.html">витрине</a>.';

			if (totalCostElement) {
				totalCostElement.textContent = 'Итого: 0 руб.';
			}
			return;
		}

		// Теперь создаем товары в соответствии с нашей HTML-структурой
		let totalCost = 0;

		this.cartItems.forEach(item => {
			totalCost += item.price * item.quantity;

			// Создаем HTML-элемент товара в соответствии с существующей версткой
			const itemElement = document.createElement('div');
			itemElement.className = 'basket__content-products_item';
			itemElement.dataset.id = item.id;

			itemElement.innerHTML = `
				<div class="basket__content-products_item-image">
					<img src="${item.image}" alt="${item.title}" loading="lazy" />
				</div>
				<div class="basket__content-products_item-description">
					<p>${item.title}</p>
					<p><i>Автор: ${item.author}</i></p>
					<div class="basket-products__item-counter">
						<button class="basket-products__item-counter__button button decrease-button">
							<img src="images/icons/button_minus.svg" alt="" class="basket-products__item-counter-icon" />
						</button>
						<div class="basket-products__item-counter__count">
							<img src="images/icons/shop_basket.svg" alt="" class="basket-products__item-button-icon" />
							${item.quantity}
						</div>
						<button class="basket-products__item-counter__button button increase-button">
							<img src="images/icons/button_plus.svg" alt="" class="basket-products__item-counter-icon" />
						</button>
					</div>
					<p><b>${this.formatAmount(item.price * item.quantity)} руб.</b></p>
				</div>
				<div class="basket__content-products_item-close hidden-mobile">
					<button class="cross remove-button">
						<img src="/images/icons/cross.svg" alt="close" />
					</button>
				</div>
			`;

			// Добавляем обработчики событий
			const decreaseButton = itemElement.querySelector('.decrease-button');
			const increaseButton = itemElement.querySelector('.increase-button');
			const removeButton = itemElement.querySelector('.remove-button');

			// Добавляем класс disabled для кнопки минус, если количество товара равно 1
			if (item.quantity === 1) {
				decreaseButton.classList.add('disabled');
			}

			decreaseButton.addEventListener('click', () => {
				// Не уменьшаем количество, если кнопка заблокирована
				if (!decreaseButton.classList.contains('disabled')) {
					this.decreaseQuantity(item.id);
				}
			});

			increaseButton.addEventListener('click', () =>
				this.increaseQuantity(item.id)
			);
			removeButton.addEventListener('click', () => this.removeItem(item.id));

			productsContainer.appendChild(itemElement);
		});

		// Обновляем итоговую сумму с неразрывными пробелами
		if (totalCostElement) {
			// Используем innerHTML вместо textContent для поддержки HTML-сущностей
			totalCostElement.innerHTML = `Итого: ${this.formatAmount(
				totalCost
			).replace(/ /g, '&nbsp;')}&nbsp;руб.`;
		}

		// Добавляем обработчик для кнопки заказа
		const orderButton = document.querySelector(
			'.basket__content-total_cost-button'
		);
		if (orderButton) {
			// Удаляем старые обработчики
			const newOrderButton = orderButton.cloneNode(true);
			orderButton.parentNode.replaceChild(newOrderButton, orderButton);
			newOrderButton.addEventListener('click', () => this.handleCheckout());
		}
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
		console.log('Обновляем интерфейс корзины');
		this.renderCartItems();
		this.updateDescription();
	}

	/**
	 * Увеличивает количество товара в корзине
	 * @param {number} productId - ID товара
	 */
	increaseQuantity(productId) {
		console.log(`Увеличиваем количество товара ID: ${productId}`);
		const item = this.cartItems.find(item => item.id === productId);
		if (item) {
			// Запоминаем предыдущее количество
			const oldQuantity = item.quantity;

			// Увеличиваем количество
			item.quantity += 1;

			// Сохраняем данные и обновляем UI
			this.saveCartData();
			this.updateUI();

			// Если количество увеличилось с 1 до 2, нужно снять блокировку с кнопки минус
			if (oldQuantity === 1) {
				// Находим все кнопки минус для этого товара
				const itemElement = document.querySelector(`[data-id="${productId}"]`);
				if (itemElement) {
					const decreaseButton = itemElement.querySelector('.decrease-button');
					if (decreaseButton) {
						decreaseButton.classList.remove('disabled');
					}
				}
			}
		}
	}

	/**
	 * Уменьшает количество товара в корзине или удаляет его, если количество становится 0
	 * @param {number} productId - ID товара
	 */
	decreaseQuantity(productId) {
		console.log(`Уменьшаем количество товара ID: ${productId}`);
		const item = this.cartItems.find(item => item.id === productId);
		if (item) {
			item.quantity -= 1;

			if (item.quantity <= 0) {
				// Удаляем товар, если количество стало 0 или меньше
				this.removeItem(productId);
			} else {
				this.saveCartData();
				this.updateUI();
			}
		}
	}

	/**
	 * Удаляет товар из корзины
	 * @param {number} productId - ID товара
	 */
	removeItem(productId) {
		console.log(`Удаляем товар ID: ${productId}`);
		this.cartItems = this.cartItems.filter(item => item.id !== productId);
		this.saveCartData();
		this.updateUI();
	}

	/**
	 * Обработка нажатия на кнопку оформления заказа
	 */
	handleCheckout() {
		// Перенаправление на страницу оформления заказа реализовано через HTML
		// window.location.href = 'order.html';
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
							author: product.author, // Добавляем поле автора
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

	// Включаем инициализацию корзины с работой с готовой HTML-структурой
	console.log('Инициализируем Basket для работы с данными в HTML-шаблоне');
	new Basket();
});
