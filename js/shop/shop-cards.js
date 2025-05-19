/**
 * Модуль для работы с карточками товаров в магазине
 */
class ShopCards {
	constructor() {
		this.productsContainer = document.querySelector('.shop-products');
		// Добавляем поле для хранения данных корзины
		this.cart = {};

		if (this.productsContainer) {
			// Загружаем данные корзины из localStorage при инициализации
			this.loadCartData();
			this.initCards();
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
	 * Инициализация карточек товаров
	 */
	initCards() {
		console.log('Инициализация карточек товаров');

		this.loadProductsData()
			.then(data => this.renderCards(data))
			.catch(error => console.error('Ошибка загрузки товаров:', error));
	}

	/**
	 * Загрузка данных о товарах из JSON файла
	 * @returns {Promise} Promise с данными о товарах
	 */
	async loadProductsData() {
		try {
			// Используем относительный путь к JSON-файлу вместо абсолютного
			const response = await fetch('../js/shop/products.json');
			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error('Ошибка при загрузке данных товаров:', error);
			return [];
		}
	}

	/**
	 * Получение класса CSS для тега товара
	 * @param {string} tag - тег товара из JSON
	 * @returns {string} CSS класс для тега
	 */
	getTagClass(tag) {
		const tagMap = {
			svo: 'product-tag--help',
			elbook: 'product-tag--electronic',
		};

		return tagMap[tag] || '';
	}

	/**
	 * Получение текста для отображения тега
	 * @param {string} tag - тег товара из JSON
	 * @returns {string} текст для отображения
	 */
	getTagText(tag) {
		const tagTextMap = {
			svo: 'помощь СВО',
			elbook: 'электронная',
		};

		return tagTextMap[tag] || '';
	}

	/**
	 * Форматирование цены товара
	 * @param {number} price - цена товара
	 * @returns {string} отформатированная цена
	 */
	formatPrice(price) {
		return new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
	}

	/**
	 * Создание HTML элемента карточки товара
	 * @param {Object} product - данные о товаре
	 * @returns {string} HTML карточки товара
	 */
	createProductCardHTML(product) {
		const tagHTML = product.tag
			? `<span class="product-tag ${this.getTagClass(
					product.tag
			  )}">${this.getTagText(product.tag)}</span>`
			: '';

		return `
      <div class="shop-products__item" data-product-id="${product.id}">
        ${tagHTML}
        <div class="shop-products__item-image">
          <img src="${product.picture}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="shop-products__item-content">
          <div>
            <p>${product.name}</p>
            <p><i>Автор: ${product.author}</i></p>
          </div>
          <h3>${this.formatPrice(product.price)}</h3>
        </div>
        <button class="shop-products__item-button button" type="button">
          <img src="images/icons/shop_basket.svg" alt="" class="shop-products__item-button-icon" />
          добавить
        </button>
      </div>
    `;
	}

	/**
	 * Рендеринг карточек товаров
	 * @param {Array} products - массив с данными о товарах
	 */
	renderCards(products) {
		console.log('Рендеринг карточек товаров:', products);

		if (!products || products.length === 0) {
			console.warn('Нет данных о товарах для отображения');
			return;
		}

		// Создаем новый контейнер для карточек товаров
		const newProductsContainer = document.createElement('div');
		newProductsContainer.className = 'shop-products';

		// Генерируем HTML для каждого товара и добавляем в новый контейнер
		products.forEach(product => {
			const productCardHTML = this.createProductCardHTML(product);
			// Используем insertAdjacentHTML для добавления HTML-строки в DOM
			newProductsContainer.insertAdjacentHTML('beforeend', productCardHTML);
		});

		// Вставляем новый контейнер перед существующим
		if (this.productsContainer && this.productsContainer.parentNode) {
			this.productsContainer.parentNode.insertBefore(
				newProductsContainer,
				this.productsContainer
			);
			
			// Обновляем отображение карточек с учетом данных корзины
			this.updateProductCards(newProductsContainer);
		}
	}
	
	/**
	 * Обновление карточек товаров с учетом данных корзины
	 * @param {HTMLElement} container - контейнер с карточками товаров
	 */
	updateProductCards(container) {
		// Проверяем, есть ли товары в корзине
		if (Object.keys(this.cart).length === 0) {
			return; // Если корзина пуста, ничего не делаем
		}
		
		// Проходим по всем товарам в корзине
		Object.keys(this.cart).forEach(productId => {
			const quantity = this.cart[productId];
			const productItems = container.querySelectorAll(`.shop-products__item[data-product-id="${productId}"]`);
			
			productItems.forEach(productItem => {
				// Для каждого товара из корзины создаем счетчик вместо кнопки
				this.replaceButtonWithCounter(productItem, productId, quantity);
			});
		});
	}

	/**
	 * Замена кнопки на счетчик товаров
	 * @param {HTMLElement} productItem - карточка товара
	 * @param {string} productId - ID товара
	 * @param {number} quantity - количество товара
	 */
	replaceButtonWithCounter(productItem, productId, quantity) {
		const button = productItem.querySelector('.shop-products__item-button');
		if (!button) return;
		
		// Создаем счетчик с текущим количеством товара
		const counterHTML = `
			<div class="shop-products__item-counter">
				<button class="shop-products__item-counter__button button">
					<img src="images/icons/button_minus.svg" alt="" class="shop-products__item-counter-icon" />
				</button>
				<div class="shop-products__item-counter__count">
					<img src="images/icons/shop_basket.svg" alt="" class="shop-products__item-button-icon" />
					${quantity}
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
		button.parentNode.replaceChild(counterElement, button);
	}
}

// Экспортируем класс и создаем экземпляр
export default new ShopCards();
