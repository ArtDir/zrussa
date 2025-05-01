import cardsData from '../../src/slider-cards.json';

/**
 * Класс для создания и управления карточками проектов
 */
class ProjectsCardBuilder {
	/**
	 * Конструктор класса
	 * @param {string} containerSelector - CSS-селектор контейнера для карточек
	 */
	constructor(containerSelector) {
		this.container = document.querySelector(containerSelector);
		this.itemsContainer = this.container ? this.container.querySelector('li') : null;
		this.currentTheme = 'it'; // По умолчанию тема IT
		
		// Создаем все карточки и показываем только те, которые соответствуют текущей теме
		this.renderCards();
	}

	/**
	 * Фильтрует карточки по текущей теме
	 * @returns {Array} Отфильтрованный массив карточек
	 */
	filterCardsByTheme() {
		return cardsData.filter(card => {
			return card.theme_label === this.currentTheme || card.theme_label === 'both';
		});
	}

	/**
	 * Рендерит карточки на странице
	 */
	renderCards() {
		if (!this.container || !this.itemsContainer) {
			console.error('Контейнер для карточек проектов не найден');
			return;
		}
		
		// Очищаем контейнер
		this.itemsContainer.innerHTML = '';
		
		// Фильтруем карточки по текущей теме
		const filteredCards = this.filterCardsByTheme();
		
		// Создаем и добавляем карточки
		filteredCards.forEach(cardData => {
			const card = this.createCard(cardData);
			this.itemsContainer.appendChild(card);
		});
		
		console.log(`Отрендерено ${filteredCards.length} карточек проектов для темы ${this.currentTheme}`);
		
		// Инициализируем слайдер
		if (typeof window.initSlider === 'function') {
			setTimeout(() => window.initSlider(), 100);
		}
	}

	/**
	 * Переключает тему и обновляет карточки
	 * @param {string} theme - Новая тема ('it' или 'music')
	 */
	switchTheme(theme) {
		if (theme !== 'it' && theme !== 'music') {
			console.error('Неверная тема:', theme);
			return;
		}
		
		this.currentTheme = theme;
		this.renderCards();
		console.log(`Тема проектов переключена на: ${theme}`);
	}

	/**
	 * Создает DOM-элемент карточки проекта
	 * @param {Object} cardData - Данные для карточки
	 * @returns {HTMLElement} - DOM-элемент карточки
	 */
	createCard(cardData) {
		const article = document.createElement('article');
		article.className = 'project-card';
		// Добавляем атрибут с темой карточки
		article.setAttribute('data-theme', cardData.theme_label);

		// Проверяем тип файла по расширению
		const isVideo = cardData.image.toLowerCase().endsWith('.webm');

		if (isVideo) {
			// Создаем видео-элемент для webm
			const video = document.createElement('video');
			video.src = cardData.image;
			video.alt = cardData.title;
			video.className = 'project-card__image';
			video.autoplay = true;
			video.loop = true;
			video.muted = true;
			video.playsInline = true;
			video.setAttribute('playsinline', '');
			video.setAttribute('disablePictureInPicture', '');
			video.setAttribute('disableRemotePlayback', '');
			article.appendChild(video);
		} else {
			// Создаем обычное изображение для других форматов
			const image = document.createElement('img');
			image.src = cardData.image;
			image.alt = cardData.title;
			image.className = 'project-card__image';
			image.loading = 'lazy';
			article.appendChild(image);
		}

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

		return article;
	}
}

// Создаем экземпляр класса и делаем его доступным глобально
let cardBuilderInstance;

document.addEventListener('DOMContentLoaded', () => {
	// Создаем экземпляр класса
	cardBuilderInstance = new ProjectsCardBuilder('.projects-slider');
	
	// Делаем его доступным глобально
	window.projectCardBuilder = cardBuilderInstance;
});

// Делаем функцию переключения темы доступной глобально
window.switchProjectsTheme = (theme) => {
	if (window.projectCardBuilder) {
		window.projectCardBuilder.switchTheme(theme);
		return true;
	}
	return false;
};
