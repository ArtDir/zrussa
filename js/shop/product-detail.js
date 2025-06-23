/**
 * Модуль для отображения подробной информации о товаре в попапе
 */
class ProductDetail {
	constructor() {
		// Создаем элементы попапа, если их еще нет
		this.createPopupElements();

		// Добавляем обработчики событий для карточек товаров
		this.addEventListeners();
		
		// Проверяем URL-параметры при загрузке страницы
		document.addEventListener('DOMContentLoaded', () => {
			this.checkUrlParams();
		});
	}

	/**
	 * Проверка URL-параметров и открытие попапа при необходимости
	 */
	checkUrlParams() {
		console.log('Проверка URL-параметров...');
		
		// Получаем параметры из URL
		const urlParams = new URLSearchParams(window.location.search);
		const productId = urlParams.get('id');
		
		if (productId) {
			console.log(`Найден параметр id=${productId}, открываем попап...`);
			
			// Небольшая задержка для уверенности, что все компоненты загружены
			setTimeout(() => {
				try {
					// Открываем попап с товаром по ID
					this.showProductDetail(parseInt(productId, 10));
					
					// Обновляем URL без параметра, чтобы при обновлении страницы попап не открывался снова
					const newUrl = window.location.pathname;
					window.history.pushState({ productId }, '', newUrl);
				} catch (error) {
					console.error('Ошибка при открытии попапа:', error);
				}
			}, 1000);
		}
	}

	/**
	 * Создание элементов попапа
	 */
	createPopupElements() {
		// Проверяем, существует ли уже попап
		if (document.getElementById('product-detail-overlay')) {
			return;
		}

		// Создаем элементы попапа
		const overlay = document.createElement('div');
		overlay.id = 'product-detail-overlay';
		overlay.className = 'product-detail-overlay visually-hidden';

		const popupHTML = `
      <div class="product-detail">
        <button class="product-detail__close" type="button">
          <span class="visually-hidden">Закрыть</span>
        </button>
        <div class="product-detail__content">
          <div class="product-detail__image-container">
            <img src="" alt="" class="product-detail__image" />
            <div class="product-detail__tag-container"><span class="product-tag product-detail__tag"></span></div>
          </div>
          <div class="product-detail__info">
            <h2 class="product-detail__title"></h2>
            <p class="product-detail__author"></p>
            <div class="product-detail__price"></div>
            <div class="product-detail__description"></div>
            <button class="product-detail__button button" type="button">
              добавить в корзину
            </button>
          </div>
        </div>
      </div>
    `;

		overlay.innerHTML = popupHTML;
		document.body.appendChild(overlay);

		// Добавляем обработчики для закрытия попапа
		const closeButton = overlay.querySelector('.product-detail__close');
		closeButton.addEventListener('click', () => this.closePopup());

		overlay.addEventListener('click', event => {
			if (event.target === overlay) {
				this.closePopup();
			}
		});

		// Добавляем обработчик для кнопки "добавить в корзину"
		const addButton = overlay.querySelector('.product-detail__button');
		const self = this; // Сохраняем контекст this
		addButton.addEventListener('click', function() {
			const productId = overlay.dataset.productId;
			if (productId) {
				// Используем метод increaseQuantity для добавления товара в корзину
				self.increaseQuantity(parseInt(productId, 10));
				
				// Обновляем кнопку на счетчик
				self.updateAddButton(addButton, parseInt(productId, 10), 1);
			}
		});
	}

	/**
	 * Добавление обработчиков событий
	 */
	addEventListeners() {
		// Слушаем событие обновления корзины
		document.addEventListener('cartUpdated', () => {
			// Проверяем, открыт ли попап
			const overlay = document.getElementById('product-detail-overlay');
			if (overlay && !overlay.classList.contains('visually-hidden')) {
				// Получаем ID текущего товара в попапе
				const productId = overlay.dataset.productId;
				if (productId) {
					// Обновляем статус корзины для этого товара
					this.checkCartStatus(productId);
				}
			}
		});

		// Обработчик клика по карточке товара
		document.addEventListener('click', async (event) => {
			// Проверяем, был ли клик по карточке товара или ее дочернему элементу
			const productCard = event.target.closest('.shop-products__item');

			if (productCard) {
				// Проверяем, не был ли клик по кнопке "добавить в корзину" или счетчику
				const isButton = event.target.closest('.shop-products__item-button');
				const isCounter = event.target.closest('.shop-products__item-counter');

				if (!isButton && !isCounter) {
					const productId = productCard.dataset.productId;
					if (productId) {
						this.showProductDetail(productId);
					}
				}
			}
		});

		// Обработчик события добавления товара в корзину
		document.addEventListener('cart-updated', event => {
			const { productId, quantity } = event.detail;
			const overlay = document.getElementById('product-detail-overlay');

			if (overlay && overlay.dataset.productId === productId.toString()) {
				const addButton = overlay.querySelector('.product-detail__button');
				const counter = overlay.querySelector('.product-detail__counter');

				if (quantity > 0) {
					this.updateAddButton(addButton || counter, productId, quantity);
				} else {
					this.resetAddButton();
				}
			}
		});
	}

	/**
	 * Отображение попапа с информацией о товаре
	 * @param {number} productId - ID товара
	 */
	async showProductDetail(productId) {
		try {
			// Сбрасываем состояние попапа перед открытием
			const overlay = document.getElementById('product-detail-overlay');
			const counter = overlay.querySelector('.product-detail__counter');
			if (counter) {
				this.resetAddButton();
			}

			// Загружаем данные о товарах
			const products = await this.loadProductsData();
			const product = products.find((p) => p.id === parseInt(productId, 10));

			if (!product) {
				throw new Error(`Товар с ID ${productId} не найден`);
			}

			// Заполняем попап данными о товаре
			this.fillProductDetail(product);

			// Отображаем попап
			overlay.classList.remove('visually-hidden');
			document.body.classList.add('no-scroll');

			// Сохраняем ID текущего товара
			overlay.dataset.productId = product.id;

			// Получаем актуальное состояние корзины из localStorage
			const savedCart = localStorage.getItem('shopCart');
			let currentQuantity = 0;

			if (savedCart) {
				try {
					const cart = JSON.parse(savedCart);
					currentQuantity = cart[product.id] || 0;
				} catch (e) {
					console.error('Ошибка при чтении корзины:', e);
				}
			}

			// Обновляем состояние кнопки в зависимости от количества товара в корзине
			if (currentQuantity > 0) {
				const addButton = overlay.querySelector('.product-detail__button');
				if (addButton) {
					this.updateAddButton(addButton, product.id, currentQuantity);
				}
			}

			// Дополнительно проверяем статус корзины
			this.checkCartStatus(product.id);
		} catch (error) {
			console.error('Ошибка при отображении информации о товаре:', error);
		}
	}

	/**
	 * Загрузка данных о товарах
	 * @returns {Promise<Array>} Массив товаров
	 */
	async loadProductsData() {
		try {
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
	 * Заполнение попапа данными о товаре
	 * @param {Object} product - Данные о товаре
	 */
	fillProductDetail(product) {
		const overlay = document.getElementById('product-detail-overlay');

		// Заполняем данные
		const image = overlay.querySelector('.product-detail__image');
		image.src = product.picture;
		image.alt = product.name;

		overlay.querySelector('.product-detail__title').textContent = product.name;
		overlay.querySelector(
			'.product-detail__author'
		).textContent = `Автор: ${product.author}`;
		overlay.querySelector('.product-detail__price').textContent =
			this.formatPrice(product.price);

		// Обрабатываем описание с переносами строк
		const description = overlay.querySelector('.product-detail__description');
		// Заменяем \n на <br> и форматируем текст для лучшей читаемости
		const formattedDescription = product.description
			.replace(/\\n/g, '<br>')
			.replace(/\n/g, '<br>')
			.replace(/(\. )/g, '.$1'); // Добавляем небольшой отступ после точки для лучшей читаемости

		description.innerHTML = formattedDescription;

		// Обрабатываем тег товара
		const tagElement = overlay.querySelector('.product-detail__tag');
		if (product.tag) {
			tagElement.textContent = this.getTagText(product.tag);
			tagElement.className = `product-tag product-detail__tag ${this.getTagClass(
				product.tag
			)}`;
			tagElement.style.display = '';
		} else {
			tagElement.style.display = 'none';
		}
	}

	/**
	 * Проверка статуса товара в корзине
	 * @param {number} productId - ID товара
	 */
	checkCartStatus(productId) {
		// Получаем данные корзины из localStorage
		const savedCart = localStorage.getItem('shopCart');
		if (savedCart) {
			try {
				const cart = JSON.parse(savedCart);
				const quantity = cart[productId];

				// Проверяем, есть ли уже счетчик в попапе
				const overlay = document.getElementById('product-detail-overlay');
				const counter = overlay.querySelector('.product-detail__counter');
				const addButton = overlay.querySelector('.product-detail__button');

				if (quantity && quantity > 0) {
					// Товар есть в корзине
					if (counter) {
						// Если счетчик уже есть, просто обновляем значение
						const countElement = counter.querySelector('.product-detail__counter__count');
						if (countElement) {
							countElement.innerHTML = `
          <img src="images/icons/shop_basket.svg" alt="" class="product-detail__button-icon" />
          ${quantity}
        `;
						}
					} else if (addButton) {
						// Если есть кнопка "добавить", заменяем её на счетчик
						this.updateAddButton(addButton, productId, quantity);
					}
				} else {
					// Товара нет в корзине, но есть счетчик - возвращаем кнопку
					if (counter) {
						this.resetAddButton();
					}
				}
			} catch (e) {
				console.error('Ошибка при проверке статуса корзины:', e);
			}
		} else {
			// Корзина пуста, но есть счетчик - возвращаем кнопку
			const overlay = document.getElementById('product-detail-overlay');
			const counter = overlay.querySelector('.product-detail__counter');
			if (counter) {
				this.resetAddButton();
			}
		}
	}

	/**
	 * Обновление кнопки "добавить в корзину" на счетчик
	 * @param {HTMLElement} button - Кнопка "добавить в корзину"
	 * @param {number} productId - ID товара
	 * @param {number} quantity - Количество товара
	 */
	updateAddButton(button, productId, quantity) {
		if (!button) return;

		// Если это уже счетчик, просто обновляем количество
		if (button.classList.contains('product-detail__counter')) {
			const countElement = button.querySelector(
				'.product-detail__counter__count'
			);
			if (countElement) {
				countElement.innerHTML = `
          <img src="images/icons/shop_basket.svg" alt="" class="product-detail__button-icon" />
          ${quantity}
        `;
			}
			return;
		}

		// Создаем счетчик с текущим количеством товара
		const counterHTML = `
      <div class="product-detail__counter">
        <button class="product-detail__counter__button button" data-action="decrease">
          <img src="images/icons/button_minus.svg" alt="" class="product-detail__counter-icon" />
        </button>
        <div class="product-detail__counter__count">
          <img src="images/icons/shop_basket.svg" alt="" class="product-detail__button-icon" />
          ${quantity}
        </div>
        <button class="product-detail__counter__button button" data-action="increase">
          <img src="images/icons/button_plus.svg" alt="" class="product-detail__counter-icon" />
        </button>
      </div>
    `;

		// Проверяем, что кнопка находится в DOM
		if (!button.parentNode) {
			console.error('Ошибка: кнопка не находится в DOM');
			return;
		}

		// Заменяем кнопку на счетчик
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = counterHTML.trim();
		const counterElement = tempDiv.firstChild;
		button.parentNode.replaceChild(counterElement, button);

		// Добавляем обработчики для кнопок счетчика
		const decreaseButton = counterElement.querySelector(
			'[data-action="decrease"]'
		);
		const increaseButton = counterElement.querySelector(
			'[data-action="increase"]'
		);

		decreaseButton.addEventListener('click', () => {
			// Уменьшаем количество товара в корзине
			this.decreaseQuantity(productId);
		});

		increaseButton.addEventListener('click', () => {
			// Увеличиваем количество товара в корзине
			this.increaseQuantity(productId);
		});
	}

	/**
	 * Сброс кнопки "добавить в корзину"
	 */
	resetAddButton() {
		const overlay = document.getElementById('product-detail-overlay');
		const counter = overlay.querySelector('.product-detail__counter');

		if (counter) {
			const buttonHTML = `
        <button class="product-detail__button button" type="button">
          добавить в корзину
        </button>
      `;

			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = buttonHTML.trim();
			const buttonElement = tempDiv.firstChild;
			counter.parentNode.replaceChild(buttonElement, counter);

			// Добавляем обработчик для новой кнопки
			const self = this; // Сохраняем контекст this
			buttonElement.addEventListener('click', function() {
				const productId = overlay.dataset.productId;
				if (productId) {
					// Используем метод increaseQuantity для добавления товара в корзину
					self.increaseQuantity(parseInt(productId, 10));
					
					// Обновляем кнопку на счетчик
					self.updateAddButton(buttonElement, parseInt(productId, 10), 1);
				}
			});
		}
	}

	/**
	 * Закрытие попапа
	 */
	closePopup() {
		const overlay = document.getElementById('product-detail-overlay');
		overlay.classList.add('visually-hidden');
		document.body.classList.remove('no-scroll');
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
	 * Увеличение количества товара в корзине
	 * @param {number} productId - ID товара
	 */
	increaseQuantity(productId) {
		// Получаем текущую корзину из localStorage
		const cart = this.getCart();

		// Увеличиваем количество товара в корзине
		if (cart[productId]) {
			cart[productId]++;
		} else {
			cart[productId] = 1;
		}

		// Сохраняем корзину в localStorage
		this.saveCart(cart);

		// Немедленно обновляем счетчик в попапе
		const overlay = document.getElementById('product-detail-overlay');
		if (overlay && !overlay.classList.contains('visually-hidden')) {
			const counter = overlay.querySelector('.product-detail__counter');
			if (counter) {
				const countElement = counter.querySelector('.product-detail__counter__count');
				if (countElement) {
					countElement.innerHTML = `
          <img src="images/icons/shop_basket.svg" alt="" class="product-detail__button-icon" />
          ${cart[productId]}
        `;
				}
			}
		}

		// Отправляем событие обновления корзины
		const event = new CustomEvent('cartUpdated', {
			detail: { productId: parseInt(productId, 10), quantity: cart[productId] },
		});
		document.dispatchEvent(event);
	}

	/**
	 * Уменьшение количества товара в корзине
	 * @param {number} productId - ID товара
	 */
	decreaseQuantity(productId) {
		// Получаем текущую корзину из localStorage
		const cart = this.getCart();
		let needReset = false;

		// Уменьшаем количество товара в корзине
		if (cart[productId]) {
			cart[productId]--;

			// Если количество стало 0, удаляем товар из корзины
			if (cart[productId] <= 0) {
				delete cart[productId];
				needReset = true;
			}
		}

		// Сохраняем корзину в localStorage
		this.saveCart(cart);

		// Немедленно обновляем счетчик в попапе
		const overlay = document.getElementById('product-detail-overlay');
		if (overlay && !overlay.classList.contains('visually-hidden')) {
			if (needReset) {
				// Если товар удален из корзины, возвращаем кнопку "добавить"
				this.resetAddButton();
			} else {
				// Иначе обновляем счетчик
				const counter = overlay.querySelector('.product-detail__counter');
				if (counter) {
					const countElement = counter.querySelector('.product-detail__counter__count');
					if (countElement) {
						countElement.innerHTML = `
          <img src="images/icons/shop_basket.svg" alt="" class="product-detail__button-icon" />
          ${cart[productId]}
        `;
					}
				}
			}
		}

		// Отправляем событие обновления корзины
		const quantity = cart[productId] || 0;
		const event = new CustomEvent('cartUpdated', {
			detail: { productId: parseInt(productId, 10), quantity },
		});
		document.dispatchEvent(event);
	}

	/**
	 * Получение данных корзины из localStorage
	 * @returns {Object} Объект корзины
	 */
	getCart() {
		const savedCart = localStorage.getItem('shopCart');
		return savedCart ? JSON.parse(savedCart) : {};
	}

	/**
	 * Сохранение корзины в localStorage
	 * @param {Object} cart - Объект корзины
	 */
	saveCart(cart) {
		localStorage.setItem('shopCart', JSON.stringify(cart));
	}
}

// Экспортируем класс и создаем экземпляр
// Создаем экземпляр класса
const productDetailInstance = new ProductDetail();

// Делаем экземпляр доступным глобально для использования в других модулях
window.productDetailInstance = productDetailInstance;

// Экспортируем экземпляр по умолчанию
export default productDetailInstance;
