// Основной файл JS для страницы магазина
import '../modules/popup.js';
import '../modules/scrolling.js';
import '../modules/mobile-menu.js';
import './shop-cards.js';
import './shop-add-button.js';
import ThemeSwitch from '../components/theme-switch.js';
import MobileMenu from '../modules/mobile-menu.js';

// Инициализация компонентов
document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем общие компоненты
  new ThemeSwitch();
  new MobileMenu();
  
  // Инициализация специфичных компонентов магазина
  console.log('Страница магазина инициализирована');
});
