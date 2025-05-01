/**
 * Модуль для управления мобильным меню
 */
export default class MobileMenu {
  constructor() {
    // Элементы меню
    this.burgerButton = document.querySelector('.burger-button');
    this.body = document.body;
    this.mobileMenu = null;
    this.currentTheme = localStorage.getItem('theme') || 'it';
    
    // Привязка контекста к методам
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleEscKey = this.handleEscKey.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.updateMenuItems = this.updateMenuItems.bind(this);
    
    // Инициализация меню
    this.init();
  }
  
  /**
   * Инициализация мобильного меню
   */
  init() {
    if (!this.burgerButton) return;
    
    // Создаем мобильное меню
    this.createMobileMenu();
    
    // Добавляем обработчики событий
    this.burgerButton.addEventListener('click', this.toggleMenu);
    
    // Обработчик клавиши Escape
    document.addEventListener('keydown', this.handleEscKey);
    
    // Отслеживаем изменение темы
    document.addEventListener('themeChanged', (e) => {
      this.currentTheme = e.detail.theme;
      this.updateMenuItems();
    });
  }
  
  /**
   * Создает структуру мобильного меню
   */
  createMobileMenu() {
    // Создаем контейнер для мобильного меню
    this.mobileMenu = document.createElement('div');
    this.mobileMenu.className = 'mobile-menu';
    
    // Добавляем кнопку закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'mobile-menu__close';
    closeButton.setAttribute('aria-label', 'Закрыть меню');
    closeButton.addEventListener('click', this.closeMenu);
    
    // Создаем навигацию
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-menu__nav';
    
    // Создаем список меню
    const menuList = document.createElement('ul');
    menuList.className = 'mobile-menu__list';
    
    // Создаем пункты меню в зависимости от темы
    const menuItems = [
      { href: '#projects', textIT: 'проекты', textMusic: 'песни' },
      { href: '#reviews', textIT: 'отзывы', textMusic: 'отзывы' },
      { href: '#team', textIT: 'команда', textMusic: 'команда' },
      { href: '#advantages', textIT: 'преимущества', textMusic: 'преимущества' },
      { href: '#order', textIT: 'заказать', textMusic: 'заказать' }
    ];
    
    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('li');
      menuItem.className = 'mobile-menu__item';
      
      const link = document.createElement('a');
      link.className = 'mobile-menu__link';
      link.href = item.href;
      link.textContent = this.currentTheme === 'music' ? item.textMusic : item.textIT;
      link.addEventListener('click', this.handleLinkClick);
      
      menuItem.appendChild(link);
      menuList.appendChild(menuItem);
    });
    
    mobileNav.appendChild(menuList);
    
    // Добавляем элементы в мобильное меню
    this.mobileMenu.appendChild(closeButton);
    this.mobileMenu.appendChild(mobileNav);
    
    // Добавляем меню в DOM
    document.body.appendChild(this.mobileMenu);
  }
  
  /**
   * Переключает состояние мобильного меню
   */
  toggleMenu() {
    if (!this.mobileMenu) return;
    
    const isOpen = this.mobileMenu.classList.contains('is-open');
    
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  /**
   * Открывает мобильное меню
   */
  openMenu() {
    if (!this.mobileMenu) return;
    
    this.mobileMenu.classList.add('is-open');
    this.body.classList.add('menu-open');
    this.burgerButton.classList.add('is-active');
    
    // Фокус на первый элемент меню для доступности
    const firstLink = this.mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) {
      setTimeout(() => {
        firstLink.focus();
      }, 100);
    }
  }
  
  /**
   * Закрывает мобильное меню
   */
  closeMenu() {
    if (!this.mobileMenu) return;
    
    this.mobileMenu.classList.remove('is-open');
    this.body.classList.remove('menu-open');
    this.burgerButton.classList.remove('is-active');
    
    // Возвращаем фокус на кнопку бургер-меню
    this.burgerButton.focus();
  }
  
  /**
   * Обработчик нажатия клавиши Escape
   * @param {KeyboardEvent} event Событие клавиатуры
   */
  handleEscKey(event) {
    if (event.key === 'Escape' && this.mobileMenu.classList.contains('is-open')) {
      this.closeMenu();
    }
  }
  
  /**
   * Обновляет пункты меню в зависимости от текущей темы
   */
  updateMenuItems() {
    if (!this.mobileMenu) return;
    
    const menuItems = [
      { href: '#projects', textIT: 'проекты', textMusic: 'песни' },
      { href: '#reviews', textIT: 'отзывы', textMusic: 'отзывы' },
      { href: '#team', textIT: 'команда', textMusic: 'команда' },
      { href: '#advantages', textIT: 'преимущества', textMusic: 'преимущества' },
      { href: '#order', textIT: 'заказать', textMusic: 'заказать' }
    ];
    
    const links = this.mobileMenu.querySelectorAll('.mobile-menu__link');
    links.forEach((link, index) => {
      if (index < menuItems.length) {
        link.textContent = this.currentTheme === 'music' ? menuItems[index].textMusic : menuItems[index].textIT;
      }
    });
  }
  
  /**
   * Обработчик клика по ссылке в мобильном меню
   */
  handleLinkClick() {
    // Закрываем меню при клике на ссылку
    this.closeMenu();
  }
}
