import cardsData from '../../src/slider-cards.json';

class ProjectsCardBuilder {
	constructor(containerSelector) {
		this.container = document.querySelector(containerSelector);

		cardsData.forEach(cardData => {
			const card = this.createCard(cardData);
			this.container.querySelector('li').appendChild(card);
		});
	}

	createCard(cardData) {
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
			}
			buttonsHolder.appendChild(buttonElement);
		});

		body.appendChild(cardHolder);
		body.appendChild(buttonsHolder);

		article.appendChild(body);

		return article;
	}
}

// Экспорт экземпляра класса
document.addEventListener('DOMContentLoaded', () => {
	const cardBuilder = new ProjectsCardBuilder('.projects-slider');
});
