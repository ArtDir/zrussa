// Import JS-modules
import './modules/order-form.js';
import './modules/popup.js';
import './modules/scrolling.js';
import './modules/slider-cards.js';
import './modules/slider.js';
import './modules/type-text.js';
import ThemeSwitch from './components/theme-switch.js';
import MobileMenu from './modules/mobile-menu.js';
import UrlParams from './utils/url-params.js';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitch();
  new MobileMenu();
  new UrlParams(); // Инициализируем обработчик URL-параметров
});
