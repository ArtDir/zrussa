// Основной файл JS для страницы магазина

// Добавляем библиотеку MD5 глобально для всех модулей
import '../utils/md5.min.js';

import ThemeSwitch from '../components/theme-switch.js';
import '../modules/mobile-menu.js';
import MobileMenu from '../modules/mobile-menu.js';
import '../modules/popup.js';
import '../modules/scrolling.js';
import './shop-add-button.js';
import './shop-cards.js';
import './bottom-menu.js';
import './basket.js'; // Импортируем логику корзины
import './order.js'; // Импортируем логику оформления заказа
import './product-detail.js'; // Импортируем логику отображения деталей товара

// Инициализация компонентов
document.addEventListener('DOMContentLoaded', () => {
	// Инициализируем общие компоненты
	new ThemeSwitch();
	new MobileMenu();

	// Инициализация специфичных компонентов магазина
	console.log('Страница магазина инициализирована');
});
