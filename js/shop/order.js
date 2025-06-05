/**
 * Модуль для обработки формы заказа
 */
import RobokassaPayment from './order-robokassa.js';
class OrderForm {
	constructor() {
		this.form = document.querySelector('.order-form');
		this.phoneInput = this.form
			? this.form.querySelector('input[type="tel"]')
			: null;
		this.emailInput = this.form
			? this.form.querySelector('input[type="email"]')
			: null;

		// Инициализируем объект RobokassaPayment для работы с платежной системой
		this.robokassaPayment = new RobokassaPayment();

		this.init();
	}

	/**
	 * Инициализация обработчиков формы
	 */
	init() {
		if (!this.form) return;

		// Полностью сбрасываем форму при загрузке страницы
		this.form.reset();

		// Удаляем все классы валидации из каждого поля
		const inputs = this.form.querySelectorAll('input');
		inputs.forEach(input => {
			// Сбрасываем стили валидации
			input.classList.remove('invalid');
			input.removeAttribute('aria-invalid');
			input.setCustomValidity('');

			// Добавляем обработчики для очистки состояния при фокусе или вводе
			input.addEventListener('focus', () => {
				input.classList.remove('invalid');
				input.removeAttribute('aria-invalid');
				input.setCustomValidity('');
			});

			input.addEventListener('input', () => {
				input.classList.remove('invalid');
				input.removeAttribute('aria-invalid');
				input.setCustomValidity('');
			});
		});

		// Применяем валидацию телефона
		if (this.phoneInput) {
			this.phoneInput.addEventListener(
				'input',
				this.formatPhoneNumber.bind(this)
			);
			this.phoneInput.addEventListener(
				'blur',
				this.validatePhoneNumber.bind(this)
			);
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
		if (
			inputValue.length > 0 &&
			inputValue[0] !== '7' &&
			inputValue[0] !== '8'
		) {
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
			input.setCustomValidity(
				'Пожалуйста, введите корректный номер телефона в формате +79XXXXXXXXX'
			);
			input.classList.add('invalid');
		} else {
			input.setCustomValidity('');
			input.classList.remove('invalid');
		}
	}

	/**
	 * Генерация случайного ID заказа в допустимом диапазоне для Робокассы
	 * @returns {string} - ID заказа
	 */
	generateOrderId() {
		// Максимальное значение для 32-битного целого числа со знаком: 2147483647 (2^31-1)
		const maxValue = 2147483647;
		// Генерируем случайное число от 1 до maxValue
		const randomNumber = Math.floor(Math.random() * maxValue) + 1;
		console.log('Сгенерирован ID заказа:', randomNumber);
		return randomNumber.toString();
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
		const fullName = this.form
			.querySelector('input[placeholder="Имя и фамилия"]')
			.value.trim();
		const phone = this.phoneInput.value.trim();
		const email = this.emailInput.value.trim();
		const country = this.form
			.querySelector('input[placeholder="Страна"]')
			.value.trim();
		const city = this.form
			.querySelector('input[placeholder="Город"]')
			.value.trim();
		const zipCode = this.form
			.querySelector('input[placeholder="Почтовый индекс"]')
			.value.trim();
		const address = this.form
			.querySelector('input[placeholder="Адрес доставки"]')
			.value.trim();

		// Получаем данные о товарах из корзины
		const cartItems = this.getCartItems();

		// Проверяем, есть ли товары в корзине
		if (!cartItems || cartItems.length === 0) {
			alert(
				'Ваша корзина пуста. Пожалуйста, добавьте товары перед оформлением заказа.'
			);
			return;
		}

		// Подсчитываем общую сумму заказа
		const totalSum = cartItems.reduce(
			(sum, item) => sum + (item.price || 0) * (item.quantity || 1),
			0
		);
		if (totalSum <= 0) {
			alert(
				'Ошибка при расчете суммы заказа. Пожалуйста, проверьте товары в корзине.'
			);
			return;
		}

		// Генерируем уникальный ID заказа
		const orderId = this.generateOrderId();

		// Описание заказа (будет отображаться на странице оплаты)
		const orderDescription = `Заказ №${orderId} от ${fullName}`;

		// Формируем описание заказа для поля projectDescription
		let projectDescription = 'Заказ из интернет-магазина:\n';

		// Добавляем информацию о каждом товаре в формате
		projectDescription += cartItems
			.map((item, index) => {
				const title = item.title || 'Товар';
				const author = item.author ? ` (Автор: ${item.author})` : '';
				const quantity = item.quantity || 1;
				const price = item.price || 0;
				const total = quantity * price;

				return `${
					index + 1
				}. ${title}${author} - ${quantity} шт. x ${price} руб. = ${total} руб.`;
			})
			.join('\n');

		projectDescription += `\n\nИтого: ${totalSum} руб.`;

		// Формируем контактную информацию для поля contactInfo
		const contactInfo = `ФИО: ${fullName}\nТелефон: ${phone}\nEmail: ${email}\nСтрана: ${country}\nГород: ${city}\nИндекс: ${zipCode}\nАдрес: ${address}`;

		// Создаем объект с данными в формате, идентичном основной форме
		const formData = {
			orderId,
			projectDescription,
			contactInfo,
			submissionTime: new Date().toISOString(),
			orderType: 'shop_order',
			totalSum,
			fullName,
			phone,
			email,
			country,
			city,
			zipCode,
			address,
			cartItems,
		};

		try {
			// Показываем индикатор загрузки (изменяем текст кнопки)
			const submitButton = this.form.querySelector('.order-form__submit');
			const originalText = submitButton.textContent;
			submitButton.textContent = 'Подготовка к оплате...';
			submitButton.disabled = true;

			// Сохраняем информацию о заказе в localStorage
			localStorage.setItem('lastOrderData', JSON.stringify(formData));

			// Отправляем данные на сервер (ЭТО ВАЖНО СОХРАНИТЬ!)
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

			// Формируем описание заказа с email и датой
			const currentDate = new Date().toLocaleDateString('ru-RU');
			const emailForDescription = formData.email || 'не указан';
			const detailedDescription = `Заказ_${currentDate}_${emailForDescription}`;

			// Создаем URL для оплаты
			const robokassaUrl = this.robokassaPayment.createPaymentUrl(
				totalSum.toString(),
				detailedDescription,
				formData.email // Передаем email для предзаполнения в форме оплаты
			);

			// Сохраняем данные заказа в localStorage
			const orderKey = `order_${new Date().getTime()}`;
			localStorage.setItem(
				orderKey,
				JSON.stringify({
					formData,
					totalSum,
					date: new Date().toISOString(),
					cartItems,
					description: detailedDescription,
				})
			);

			// Сохраняем сумму заказа для страницы успеха
			localStorage.setItem('currentOrderSum', totalSum.toString());

			// Возвращаем кнопку в исходное состояние (на случай ошибки)
			submitButton.textContent = originalText;
			submitButton.disabled = false;

			if (response.ok) {
				// Очищаем корзину после успешной отправки заказа
				localStorage.removeItem('shopCart');

				// Сохраняем флаг, что заказ был размещен
				localStorage.setItem('orderPlaced', 'true');

				// Перенаправляем пользователя на страницу оплаты Робокассы
				window.location.href = robokassaUrl;
			} else {
				throw new Error('Не удалось отправить заказ');
			}
		} catch (error) {
			console.error('Ошибка:', error);
			alert(
				'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.'
			);
		}
	}

	/**
	 * Получение товаров из корзины
	 * @returns {Array} Массив товаров из корзины
	 */
	getCartItems() {
		try {
			// Получаем данные корзины из localStorage по правильному ключу 'shopCart'
			const cartData = localStorage.getItem('shopCart');
			if (cartData) {
				const cartObject = JSON.parse(cartData);

				// Дополнительно загружаем данные о товарах из products.json
				return this.getProductsDetails(cartObject);
			}
			return [];
		} catch (error) {
			console.error('Ошибка при получении данных корзины:', error);
			return [];
		}
	}

	/**
	 * Получение подробных данных о товарах из корзины
	 * @param {Object} cartObject - Объект корзины из localStorage
	 * @returns {Array} Массив товаров с подробной информацией
	 */
	getProductsDetails(cartObject) {
		// Формируем массив товаров для отправки
		const cartItems = [];

		// Загружаем данные о товарах из products.json
		let productsMap = {};

		try {
			// Загружаем данные синхронно
			const xhr = new XMLHttpRequest();
			xhr.open('GET', '/js/shop/products.json', false);
			xhr.send(null);

			if (xhr.status === 200) {
				const productsArray = JSON.parse(xhr.responseText);

				// Преобразуем массив в объект для удобного доступа по id
				productsArray.forEach(product => {
					productsMap[product.id] = {
						title: product.name,
						price: product.price,
						author: product.author,
					};
				});
			} else {
				console.error('Ошибка загрузки данных о товарах:', xhr.status);
			}
		} catch (error) {
			console.error('Ошибка при загрузке данных о товарах:', error);
		}

		// Преобразуем объект корзины в массив с подробной информацией о товарах
		for (const [productId, quantity] of Object.entries(cartObject)) {
			// Очищенный ID продукта (без префикса "product")
			const cleanId = productId.replace('product', '');

			// Получаем информацию о товаре из нашего справочника
			const product = productsMap[cleanId] || {
				title: `Товар ${cleanId}`,
				price: 999,
			};

			// Добавляем товар в массив
			cartItems.push({
				id: cleanId,
				title: product.title,
				author: product.author || '',
				price: product.price,
				quantity: quantity,
			});
		}

		return cartItems;
	}

	/**
	 * Полная очистка формы и сброс состояния валидации
	 */
	clearForm() {
		// Сбрасываем всю форму (это лучше, чем просто очищать значения)
		this.form.reset();

		// Сбрасываем состояние валидации для каждого поля
		const inputs = this.form.querySelectorAll('input');
		inputs.forEach(input => {
			// Удаляем классы стилей для невалидных полей
			input.classList.remove('invalid');
			// Сбрасываем пользовательскую валидацию
			input.setCustomValidity('');
		});
	}

	/**
	 * Очистка корзины
	 */
	clearCart() {
		try {
			// Очищаем корзину по правильному ключу 'shopCart'
			localStorage.removeItem('shopCart');
			console.log('Корзина успешно очищена');
		} catch (error) {
			console.error('Ошибка при очистке корзины:', error);
		}
	}
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	new OrderForm();
});
