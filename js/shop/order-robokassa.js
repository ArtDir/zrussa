/**
 * Модуль для интеграции с платежной системой Робокасса
 */
class RobokassaPayment {
	constructor() {
		// Параметры Робокассы
		this.mrh_login = 'zrussa'; // Логин магазина
		this.mrh_pass1 = 'n3nnjl68FJs1yL6DijxL'; // Пароль 1
		this.mrh_pass2 = 'B66SZ5ZWBkTN2mYFuPn9'; // Пароль 2 (для проверки результата)

		// Тестовый режим отключен
		this.isTest = 0; // 0 - боевой режим

		// URL для переадресации
		this.resultURL = '/result.php'; // Страница для обработки результата (уведомление о платеже)
		this.successURL = '/success.html'; // Страница успешной оплаты (перенаправление пользователя)
		this.failURL = '/fail.html'; // Страница при ошибке оплаты
	}

	// Метод generateOrderId больше не нужен для простого магазина, так как мы не используем InvoiceID

	/**
	 * Вычисление MD5 хеша для SignatureValue
	 * @param {string} str - Строка для хеширования
	 * @returns {string} - MD5 хеш
	 */
	md5(str) {
		// Используем внешнюю библиотеку md5.min.js
		// Библиотека добавляет функцию в глобальный объект
		if (typeof md5 === 'function') {
			return md5(str);
		} else if (typeof window.md5 === 'function') {
			return window.md5(str);
		} else {
			// Если библиотека не загружена, используем простой хеш
			console.warn('Библиотека MD5 не найдена, используем временное решение');
			let hash = 0;

			// Простой алгоритм хеширования
			let s = str.toString();
			for (let i = 0; i < s.length; i++) {
				let char = s.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash;
			}

			// Преобразуем в шестнадцатеричную строку
			let hashHex = (hash >>> 0).toString(16);

			// Дополняем до 32 символов
			while (hashHex.length < 32) {
				hashHex = '0' + hashHex;
			}

			return hashHex;
		}
	}

	/**
	 * Создает URL для перехода на страницу оплаты Робокассы
	 * @param {string} outSum - Сумма заказа
	 * @param {string} invDesc - Описание заказа
	 * @param {string} [email] - Email покупателя для предзаполнения в форме оплаты
	 * @returns {string} - URL для перехода на страницу оплаты
	 */
	createPaymentUrl(outSum, invDesc, email) {
		// Формируем строку для подписи с пустым значением InvId
		const signatureString = `${this.mrh_login}:${outSum}::${this.mrh_pass1}`;

		// Вычисляем подпись
		const signatureValue = this.md5(signatureString);

		// Формируем URL для перехода на страницу оплаты
		const url = new URL('https://auth.robokassa.ru/Merchant/Index.aspx');

		// Добавляем параметры
		url.searchParams.append('MerchantLogin', this.mrh_login);
		url.searchParams.append('OutSum', outSum);
		// Не добавляем InvoiceID для простого магазина
		url.searchParams.append('Description', invDesc);
		url.searchParams.append('SignatureValue', signatureValue);

		// Добавляем email пользователя для предзаполнения в форме оплаты
		if (email) {
			// Используем только стандартный параметр Email
			url.searchParams.append('Email', email);
		}

		// Добавляем параметр для тестового режима
		if (this.isTest) {
			url.searchParams.append('IsTest', this.isTest);
		}

		// Добавляем URL для переадресации
		url.searchParams.append('SuccessURL', this.successURL);
		url.searchParams.append('FailURL', this.failURL);
		url.searchParams.append('ResultURL', this.resultURL);

		// Сохраняем информацию о заказе в localStorage для последующей обработки результата
		localStorage.setItem('currentOrderSum', outSum);

		return url.toString();
	}

	/**
	 * Расчет общей суммы заказа
	 * @param {Array} cartItems - Массив товаров в корзине
	 * @returns {number} - Общая сумма заказа
	 */
	calculateTotal(cartItems) {
		if (!cartItems || cartItems.length === 0) {
			return 0;
		}

		return cartItems.reduce(
			(sum, item) => sum + (item.price || 0) * (item.quantity || 1),
			0
		);
	}

	/**
	 * Инициация платежа через Робокассу (простой магазин)
	 * @param {Object} orderData - Данные заказа
	 * @param {Array} cartItems - Товары в корзине
	 * @returns {string} - URL для перехода на страницу оплаты
	 */
	initiatePayment(orderData, cartItems) {
		// Рассчитываем общую сумму заказа
		const total = this.calculateTotal(cartItems);

		// Сохраняем сумму заказа в localStorage для страницы успеха
		localStorage.setItem('currentOrderSum', total.toString());

		// Формируем описание заказа с email и датой
		const currentDate = new Date().toLocaleDateString('ru-RU');
		const orderDescription = `Заказ от ${currentDate}, Email: ${
			orderData.email || 'не указан'
		}`;

		// Сохраняем данные заказа в localStorage
		const orderKey = `order_${new Date().getTime()}`;
		localStorage.setItem(
			orderKey,
			JSON.stringify({
				...orderData,
				total,
				date: new Date().toISOString(),
				items: cartItems,
				description: orderDescription,
			})
		);

		// Создаем URL для оплаты, передаем email для предзаполнения
		return this.createPaymentUrl(
			total.toString(),
			orderDescription,
			orderData.email // Передаем email для предзаполнения в форме оплаты
		);
	}
}

// Экспортируем класс для использования в других модулях
export default RobokassaPayment;
