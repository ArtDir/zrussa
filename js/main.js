// Import JS-modules
import './modules/order-form.js';
import './modules/popup.js';
import './modules/scrolling.js';
import './modules/slider-cards.js';
import './modules/slider.js';
import './modules/type-text.js';
import ThemeSwitch from './components/theme-switch.js';
import MobileMenu from './modules/mobile-menu.js';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitch();
  new MobileMenu();
});
