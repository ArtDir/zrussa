import ThemeSwitchColors from './theme-switch-colors.js';
import ThemeSwitchTexts from './theme-switch-texts.js';
import ThemeSwitchProjects from './theme-switch-projects.js';

/**
 * Основной класс для управления переключением темы
 */
export default class ThemeSwitch {
  constructor() {
    this.currentTheme = 'it';
    this.switchElement = null;
    this.textsManager = new ThemeSwitchTexts();
    
    this.init();
  }

  /**
   * Инициализирует переключатель темы
   */
  init() {
    // Создаем элемент переключателя
    this.createSwitchElement();

    // Если мы на странице магазина, то не нужно настраивать переключатель
    if (this.isShopPage()) {
      return; 
    }
    
    // Проверяем наличие элемента переключателя
    if (!this.switchElement) {
      return;
    }

    // Добавляем обработчик события
    const input = this.switchElement.querySelector('.theme-switch__input');
    if (input) {
      input.addEventListener('change', this.toggleTheme.bind(this));
    }

    // Проверяем сохраненную тему
    this.checkSavedTheme();
  }

  /**
   * Проверяет, находимся ли мы на странице магазина
   * @returns {boolean} true, если текущая страница - shop.html или basket.html
   */
  isShopPage() {
    const path = window.location.pathname.toLowerCase();
    return path.includes('shop.html') || path.includes('basket.html');
  }
  
  /**
   * Применяет выбранную тему
   * @param {string} theme - Имя темы ('it' или 'music')
   */
  applyTheme(theme) {
    if (theme === 'music') {
      // Применяем музыкальную тему
      this.currentTheme = 'music';
      try {
        ThemeSwitchColors.applyMusicTheme();
        this.textsManager.applyMusicTheme();
        ThemeSwitchProjects.loadMusicProjectCards();
      } catch (e) {
        console.log('Не удалось применить музыкальную тему:', e);
      }
    } else {
      // Применяем IT тему по умолчанию
      this.currentTheme = 'it';
      try {
        ThemeSwitchColors.applyITTheme();
        this.textsManager.applyITTheme();
        ThemeSwitchProjects.loadITProjectCards();
      } catch (e) {
        console.log('Не удалось применить IT тему:', e);
      }
    }
    
    // Сохраняем выбранную тему
    try {
      this.saveTheme();
    } catch (e) {
      console.log('Не удалось сохранить тему:', e);
    }
  }

  /**
   * Создает элемент переключателя темы
   */
  createSwitchElement() {
    // На страницах магазина используем фиксированную тему "ШЕ"
    if (this.isShopPage()) {
      this.currentTheme = 'it'; // Фиксируем тему "ШЕ" для магазина
      try {
        // Напрямую вызываем методы темы, избегая вызова applyTheme
        ThemeSwitchColors.applyITTheme();
      } catch (e) {
        console.log('Не удалось применить IT тему для магазина:', e);
      }
      return;
    }
    
    // Получаем ссылку на элемент, который нужно заменить
    const logoElement = document.querySelector('.header__logo');
    if (!logoElement) return;

    // Создаем контейнер для переключателя
    const switchContainer = document.createElement('div');
    switchContainer.className = 'theme-switch__container';

    // Создаем HTML для переключателя
    switchContainer.innerHTML = `
      <label class="theme-switch">
        <input class="theme-switch__input" type="checkbox">
        <span class="theme-switch__slider"></span>
      </label>
      <span class="theme-switch__label">IT-Команда</span>
    `;

    // Заменяем логотип на переключатель
    logoElement.parentNode.replaceChild(switchContainer, logoElement);

    this.switchElement = switchContainer;
    
    // Обновляем ссылку на элемент переключателя в текстовом менеджере
    this.textsManager.switchLabelElement = switchContainer.querySelector('.theme-switch__label');
  }

  /**
   * Переключает тему
   * @param {Event} event Событие изменения состояния переключателя
   */
  toggleTheme(event) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Применяем музыкальную тему
      this.currentTheme = 'music';
      ThemeSwitchColors.applyMusicTheme();
      this.textsManager.applyMusicTheme();
      ThemeSwitchProjects.loadMusicProjectCards();
    } else {
      // Применяем IT тему
      this.currentTheme = 'it';
      ThemeSwitchColors.applyITTheme();
      this.textsManager.applyITTheme();
      ThemeSwitchProjects.loadITProjectCards();
    }

    // Сохраняем выбранную тему
    this.saveTheme();
    
    // Диспатчим событие изменения темы
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: this.currentTheme }
    }));
  }

  /**
   * Сохраняет выбранную тему в localStorage
   */
  saveTheme() {
    localStorage.setItem('theme', this.currentTheme);
  }

  /**
   * Проверяет сохраненную тему и применяет ее
   */
  checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'music') {
      // Устанавливаем состояние переключателя
      const switchInput = this.switchElement.querySelector('.theme-switch__input');
      if (switchInput) {
        switchInput.checked = true;
      }
      
      // Применяем музыкальную тему
      this.currentTheme = 'music';
      ThemeSwitchColors.applyMusicTheme();
      this.textsManager.applyMusicTheme();
      ThemeSwitchProjects.loadMusicProjectCards();
      
      // Диспатчим событие изменения темы
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: this.currentTheme }
      }));
    }
  }
}
