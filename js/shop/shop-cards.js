/**
 * Модуль для работы с карточками товаров в магазине
 */
class ShopCards {
	constructor() {
		this.productsContainer = document.querySelector('.shop-products');

		if (this.productsContainer) {
			this.initCards();
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
		}
	}
}

// Экспортируем класс и создаем экземпляр
export default new ShopCards();
