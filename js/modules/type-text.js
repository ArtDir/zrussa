const heroCanDoTexts = [
	'Запускать&nbsp;IT-продукты.',
	'Автоматизировать&nbsp;бизнес-процессы.',
	'Обучать нейросети&nbsp;заказчиков.',
	'Сверстать и&nbsp;запускать сайты.',
	'Разработать образовательные платформы.',
];

const heroMusicsTexts = [
	'Создавать&nbsp;душевную атмосферу.',
	'Писать музыку и&nbsp;песни.',
	'Заполнять паузы на&nbsp;деловых мероприятиях.',
	'Создавать клипы и&nbsp;анимацию.',
	'Обучаться музыке и&nbsp;вокалу.',
];

const TYPING_SPEED = 40;
const ERASING_SPEED = 10;
const PAUSE_BEFORE_ERASING = 4000;
const PAUSE_BEFORE_TYPING = 100;

class TypingAnimation {
	constructor(element, texts) {
		this.element = element;
		this.texts = texts;
		this.currentTextIndex = 0;
		this.currentText = '';
		this.blinkInterval = null;

		this.textNode = document.createTextNode('\u200B');
		this.cursorNode = document.createTextNode('|');

		this.element.textContent = '';
		this.element.appendChild(this.textNode);
		this.element.appendChild(this.cursorNode);

		this.startCursorBlink();
	}

	getCurrentTargetText() {
		const div = document.createElement('div');
		div.innerHTML = this.texts[this.currentTextIndex];
		return div.textContent;
	}

	startCursorBlink() {
		if (this.blinkInterval) {
			clearInterval(this.blinkInterval);
		}
		this.blinkInterval = setInterval(() => {
			this.cursorNode.nodeValue =
				this.cursorNode.nodeValue === '|' ? '\u00A0' : '|';
		}, 500);
	}

	stopCursorBlink() {
		if (this.blinkInterval) {
			clearInterval(this.blinkInterval);
			this.cursorNode.nodeValue = '|';
		}
	}

	async eraseText() {
		this.stopCursorBlink();
		while (this.currentText.length > 0) {
			this.currentText = this.currentText.slice(0, -1);
			this.updateText();
			await this.sleep(ERASING_SPEED);
		}
		this.startCursorBlink();
	}

	async typeText() {
		this.stopCursorBlink();
		const targetText = this.getCurrentTargetText();
		while (this.currentText.length < targetText.length) {
			this.currentText = targetText.slice(0, this.currentText.length + 1);
			this.updateText();
			await this.sleep(TYPING_SPEED);
		}
		this.startCursorBlink();
	}

	updateText() {
		this.textNode.nodeValue = this.currentText || '\u200B';
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async animate() {
		while (true) {
			await this.sleep(PAUSE_BEFORE_ERASING);
			await this.eraseText();

			this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;

			await this.sleep(PAUSE_BEFORE_TYPING);
			await this.typeText();
		}
	}
}

// Глобальная переменная для выбора набора текстов
window.heroTextsToUse = 'it';

export function initTextAnimation() {
	const textElement = document.querySelector(
		'.hero__description p:nth-child(2)'
	);
	if (!textElement) return;

	// Выбираем набор текстов в зависимости от темы
	const textsToUse = window.heroTextsToUse === 'music' ? heroMusicsTexts : heroCanDoTexts;
	const animation = new TypingAnimation(textElement, textsToUse);
	animation.animate();

	// Отслеживаем изменение темы
	let currentTheme = window.heroTextsToUse;
	setInterval(() => {
		if (window.heroTextsToUse !== currentTheme) {
			currentTheme = window.heroTextsToUse;
			// Обновляем тексты для анимации
			animation.texts = currentTheme === 'music' ? heroMusicsTexts : heroCanDoTexts;
			// Перезапускаем анимацию с новыми текстами
			animation.currentTextIndex = 0;
			animation.currentText = '';
			animation.updateText();
		}
	}, 1000);
}

window.addEventListener('load', initTextAnimation);
