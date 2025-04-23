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
		this.heroDescriptionElement = document.querySelector(
			'.hero__description p:first-child'
		);

		// Получаем ссылки на элементы в блоке команды
		this.teamTextElement = document.querySelector('.team__text');
		this.teamRoles = {
			backend: document.querySelector(
				'.team__cards-item:nth-child(1) .team__cards-role'
			),
			frontend: document.querySelector(
				'.team__cards-item:nth-child(2) .team__cards-role'
			),
			marketing: document.querySelector(
				'.team__cards-item:nth-child(3) .team__cards-role'
			),
			pr: document.querySelector(
				'.team__cards-item:nth-child(4) .team__cards-role'
			),
			design: document.querySelector(
				'.team__cards-item:nth-child(5) .team__cards-role'
			),
			lead: document.querySelector(
				'.team__cards-item:nth-child(6) .team__cards-role'
			),
		};
		this.teamTechnologiesText = document.querySelector(
			'.team__technologies-text'
		);
		this.teamTechnologiesList = document.querySelector(
			'.team__technologies-list'
		);

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
		this.switchLabelElement = switchContainer.querySelector(
			'.theme-switch__label'
		);

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
			root.style.setProperty(
				'--primary-disable',
				'var(--music-primary-disable)'
			);
			root.style.setProperty(
				'--primary-disable-alt',
				'var(--music-primary-disable-alt)'
			);
			root.style.setProperty('--primary-link', 'var(--music-primary-link)');
			console.log('Тема переключена: Музыкальная группа');

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'Музыкальная группа';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML =
					'Мы - музыкальная группа, которая помогает:';
			}

			// Меняем тексты в блоке команды
			if (this.teamTextElement) {
				this.teamTextElement.innerHTML =
					'<b>Концерты под ключ.</b> Мы подберем уникальную программу именно под ваше мероприятие: патриотические песни, русский-рок, джаз или авторские песни - на ваш выбор. Поём от души, а не «под фанеру».';
			}

			// Меняем роли в команде
			if (this.teamRoles.backend)
				this.teamRoles.backend.textContent = 'Джаз-вокалист, саксофонист';
			if (this.teamRoles.frontend)
				this.teamRoles.frontend.textContent = 'Рок-вокалист, гитарист';
			if (this.teamRoles.marketing)
				this.teamRoles.marketing.textContent = 'Автор песен, бас-гитарист';
			if (this.teamRoles.pr)
				this.teamRoles.pr.textContent = 'Ведущий, организатор';
			if (this.teamRoles.design)
				this.teamRoles.design.textContent = 'Рок-вокалист, гитарист';
			if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Продюссер';

			// Меняем текст и иконки технологий
			if (this.teamTechnologiesText)
				this.teamTechnologiesText.textContent =
					'В своих выступлениях мы используем:';
			if (this.teamTechnologiesList) {
				this.teamTechnologiesList.innerHTML = `
					<li class="team__technologies-item"><img src="../images/icons/music/amplifier.png" alt="Усилитель"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/keyboard.png" alt="Клавишные"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/saxophone.png" alt="Саксофон"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/electric-guitar.png" alt="Электрогитара"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/electric-guitar_2.png" alt="Электрогитара"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/acoustic-guitar.png" alt="Акустическая гитара"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/microphone.png" alt="Микрофон"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/drum-set.png" alt="Ударные"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/music-stand.png" alt="Пюпитер"></li>
				`;
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
			root.style.setProperty(
				'--primary-disable-alt',
				'var(--it-primary-disable-alt)'
			);
			root.style.setProperty('--primary-link', 'var(--it-primary-link)');
			console.log('Тема переключена: IT-команда');

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'IT-Команда';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML =
					'Мы&nbsp;—&nbsp;группа разработчиков, которая&nbsp;помогает:';
			}

			// Меняем тексты в блоке команды
			if (this.teamTextElement) {
				this.teamTextElement.innerHTML =
					'<b>Вовремя и&nbsp;без &laquo;сюрпризов&raquo;.</b> В&nbsp;своей работе мы&nbsp;руководствуемся принципами гибкой методологии разработки (Agile), а&nbsp;также принципами «несдвигаемых сроков» и&nbsp;«чистого кода». Что позволяет нам сдавать даже горящие проекты в&nbsp;срок.';
			}

			// Меняем роли в команде
			if (this.teamRoles.backend)
				this.teamRoles.backend.textContent = 'Бекенд-разработчик';
			if (this.teamRoles.frontend)
				this.teamRoles.frontend.textContent = 'Фронтенд-разработчик';
			if (this.teamRoles.marketing)
				this.teamRoles.marketing.textContent = 'Интернет-маркетолог';
			if (this.teamRoles.pr) this.teamRoles.pr.textContent = 'PR-менеджер';
			if (this.teamRoles.design)
				this.teamRoles.design.textContent = 'Тимлид, Дизайнер';
			if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Руководитель';

			// Меняем текст и иконки технологий
			if (this.teamTechnologiesText)
				this.teamTechnologiesText.textContent = 'В проектах мы используем:';
			if (this.teamTechnologiesList) {
				this.teamTechnologiesList.innerHTML = `
					<li class="team__technologies-item"><img src="../images/icons/tech/HTML5.svg" alt="HTML5"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/CSS3.svg" alt="CSS3"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/JS.svg" alt="JS"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/TS.svg" alt="TS"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/NodeJS.svg" alt="NodeJS"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/React.svg" alt="React"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/NextJS.svg" alt="NextJS"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/Sass.svg" alt="Sass"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/Python.svg" alt="Python"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/Django.svg" alt="Django"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/PostgreSQL.svg" alt="PostgreSQL"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/Git.svg" alt="Git"></li>
					<li class="team__technologies-item"><img src="../images/icons/tech/Docker.svg" alt="Docker"></li>
				`;
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
			root.style.setProperty(
				'--primary-disable',
				'var(--music-primary-disable)'
			);
			root.style.setProperty(
				'--primary-disable-alt',
				'var(--music-primary-disable-alt)'
			);
			root.style.setProperty('--primary-link', 'var(--music-primary-link)');

			// Меняем текстовое содержимое
			this.switchLabelElement.textContent = 'Музыкальная группа';
			if (this.heroDescriptionElement) {
				this.heroDescriptionElement.innerHTML =
					'Мы - музыкальная группа, которая помогает:';
			}

			// Меняем тексты в блоке команды
			if (this.teamTextElement) {
				this.teamTextElement.innerHTML =
					'<b>Концерты под ключ.</b> Мы подберем уникальную программу именно под ваше мероприятие: патриотические песни, русский-рок, джаз или авторские песни - на ваш выбор. Поём от души, а не «под фанеру».';
			}

			// Меняем роли в команде
			if (this.teamRoles.backend)
				this.teamRoles.backend.textContent = 'Джаз-вокалист, саксофонист';
			if (this.teamRoles.frontend)
				this.teamRoles.frontend.textContent = 'Гитарист, вокалист';
			if (this.teamRoles.marketing)
				this.teamRoles.marketing.textContent = 'Автор песен';
			if (this.teamRoles.pr) this.teamRoles.pr.textContent = 'Ведущий';
			if (this.teamRoles.design)
				this.teamRoles.design.textContent = 'Гитарист, вокалист';
			if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Продюссер';

			// Меняем текст и иконки технологий
			if (this.teamTechnologiesText)
				this.teamTechnologiesText.textContent =
					'На выступлениях мы используем:';
			if (this.teamTechnologiesList) {
				this.teamTechnologiesList.innerHTML = `
					<li class="team__technologies-item"><img src="../images/icons/music/saxophone.png" alt="Саксофон"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/electric-guitar.png" alt="Электрогитара"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/acoustic-guitar.png" alt="Акустическая гитара"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/microphone.png" alt="Микрофон"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/keyboard.png" alt="Клавишные"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/drum-set.png" alt="Ударные"></li>
					<li class="team__technologies-item"><img src="../images/icons/music/amplifier.png" alt="Усилитель"></li>
				`;
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
			console.error(
				'Ошибка при загрузке карточек музыкальных проектов:',
				error
			);
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
