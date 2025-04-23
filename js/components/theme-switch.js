export default class ThemeSwitch {
	constructor() {
		this.switchElement = null;
		this.heroDescriptionElement = null;
		this.switchLabelElement = null;
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

		// Получаем ссылку на элемент описания в блоке hero
		this.heroDescriptionElement = document.querySelector('.hero__description p:first-child');

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

		// Сохраняем ссылку на элемент с текстом переключателя
		this.switchLabelElement = switchContainer.querySelector('.theme-switch__label');

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

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'Музыкальная группа';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML = 'Мы - музыкальная группа, которая помогает:';
			}

			// Меняем данные для слайдера проектов
			this.loadMusicProjectCards();

			// Меняем тексты для анимации набора текста
			window.heroTextsToUse = 'music';
		} else {
			// Применяем IT тему
			root.style.setProperty('--primary-color', 'var(--it-primary-color)');
			root.style.setProperty('--primary-white', 'var(--it-primary-white)');
			root.style.setProperty('--primary-dark', 'var(--it-primary-dark)');
			root.style.setProperty('--primary-disable', 'var(--it-primary-disable)');
			root.style.setProperty('--primary-disable-alt', 'var(--it-primary-disable-alt)');
			root.style.setProperty('--primary-link', 'var(--it-primary-link)');
			console.log('Тема переключена: IT-команда');

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'IT-Команда';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML = 'Мы&nbsp;—&nbsp;группа разработчиков, которая&nbsp;помогает:';
			}

			// Меняем данные для слайдера проектов
			this.loadITProjectCards();

			// Меняем тексты для анимации набора текста
			window.heroTextsToUse = 'it';
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

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'Музыкальная группа';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML = 'Мы - музыкальная группа, которая помогает:';
			}

			// Меняем данные для слайдера проектов
			setTimeout(() => this.loadMusicProjectCards(), 100);

			// Меняем тексты для анимации набора текста
			window.heroTextsToUse = 'music';
		}
	}

	// Загрузка карточек проектов для музыкальной темы
	async loadMusicProjectCards() {
		try {
			const response = await fetch('/src/slider-cards-music.json');
			const musicCardsData = await response.json();
			this.updateProjectCards(musicCardsData);
		} catch (error) {
			console.error('Ошибка при загрузке карточек музыкальных проектов:', error);
		}
	}

	// Загрузка карточек проектов для IT темы
	async loadITProjectCards() {
		try {
			const response = await fetch('/src/slider-cards.json');
			const itCardsData = await response.json();
			this.updateProjectCards(itCardsData);
		} catch (error) {
			console.error('Ошибка при загрузке карточек IT проектов:', error);
		}
	}

	// Обновление карточек проектов
	updateProjectCards(cardsData) {
		const projectsContainer = document.querySelector('.projects-slider li');
		if (!projectsContainer) return;

		// Очищаем контейнер
		projectsContainer.innerHTML = '';

		// Создаем новые карточки
		cardsData.forEach(cardData => {
			const article = document.createElement('article');
			article.className = 'project-card';

			const image = document.createElement('img');
			image.src = cardData.image;
			image.alt = cardData.title;
			image.className = 'project-card__image';
			image.loading = 'lazy';

			article.appendChild(image);

			const body = document.createElement('div');
			body.className = 'project-card__body';

			const cardHolder = document.createElement('div');
			cardHolder.className = 'project-card__holder';

			const title = document.createElement('div');
			title.className = 'project-card__title';
			title.innerHTML = `<h3>${cardData.title}</h3>`;

			const description = document.createElement('div');
			description.className = 'project-card__description';
			description.innerHTML = `<p>${cardData.description}</p>`;

			cardHolder.appendChild(title);
			cardHolder.appendChild(description);

			const buttonsHolder = document.createElement('div');
			buttonsHolder.className = 'project-card__buttons-holder';

			cardData.buttons.forEach(button => {
				const buttonElement = document.createElement('a');
				buttonElement.className = `project-card__button button--${button.type} button`;
				buttonElement.setAttribute('type', 'button');
				buttonElement.textContent = button.text;
				if (button.url) {
					buttonElement.href = button.url;
					buttonElement.setAttribute('target', '_blank');
					buttonElement.setAttribute('rel', 'noopener noreferrer');
				}
				buttonsHolder.appendChild(buttonElement);
			});

			body.appendChild(cardHolder);
			body.appendChild(buttonsHolder);

			article.appendChild(body);

			projectsContainer.appendChild(article);
		});
	}
}
