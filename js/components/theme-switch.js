export default class ThemeSwitch {
	constructor() {
		this.switchElement = null;
		this.init();
	}

	init() {
		// Создаем элемент переключателя
		this.createSwitchElement();

		// Добавляем обработчик события
		this.switchElement
			.querySelector('.theme-switch__input')
			.addEventListener('change', this.toggleTheme.bind(this));

		// Проверяем сохраненную тему
		this.checkSavedTheme();
	}

	createSwitchElement() {
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
	}

	toggleTheme(event) {
		const isChecked = event.target.checked;
		const root = document.documentElement;

		if (isChecked) {
			// Применяем музыкальную тему
			root.style.setProperty('--primary-color', 'var(--music-primary-color)');
			root.style.setProperty('--primary-white', 'var(--music-primary-white)');
			root.style.setProperty('--primary-dark', 'var(--music-primary-dark)');
			root.style.setProperty('--primary-disable', 'var(--music-primary-disable)');
			root.style.setProperty('--primary-disable-alt', 'var(--music-primary-disable-alt)');
			root.style.setProperty('--primary-link', 'var(--music-primary-link)');
			console.log('Тема переключена: Музыкальная группа');
		} else {
			// Применяем IT тему
			root.style.setProperty('--primary-color', 'var(--it-primary-color)');
			root.style.setProperty('--primary-white', 'var(--it-primary-white)');
			root.style.setProperty('--primary-dark', 'var(--it-primary-dark)');
			root.style.setProperty('--primary-disable', 'var(--it-primary-disable)');
			root.style.setProperty('--primary-disable-alt', 'var(--it-primary-disable-alt)');
			root.style.setProperty('--primary-link', 'var(--it-primary-link)');
			console.log('Тема переключена: IT-команда');
		}

		// Сохраняем выбор пользователя
		localStorage.setItem('musicTheme', isChecked);
	}

	checkSavedTheme() {
		const savedTheme = localStorage.getItem('musicTheme');
		const root = document.documentElement;

		if (savedTheme === 'true') {
			// Устанавливаем переключатель в положение "Музыкальная группа"
			this.switchElement.querySelector('.theme-switch__input').checked = true;

			// Применяем музыкальную тему
			root.style.setProperty('--primary-color', 'var(--music-primary-color)');
			root.style.setProperty('--primary-white', 'var(--music-primary-white)');
			root.style.setProperty('--primary-dark', 'var(--music-primary-dark)');
			root.style.setProperty('--primary-disable', 'var(--music-primary-disable)');
			root.style.setProperty('--primary-disable-alt', 'var(--music-primary-disable-alt)');
			root.style.setProperty('--primary-link', 'var(--music-primary-link)');
		}
	}
}
