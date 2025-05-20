// Основной файл JS для страницы магазина
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

// Инициализация компонентов
document.addEventListener('DOMContentLoaded', () => {
	// Инициализируем общие компоненты
	new ThemeSwitch();
	new MobileMenu();

	// Инициализация специфичных компонентов магазина
	console.log('Страница магазина инициализирована');
});
