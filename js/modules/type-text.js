const heroCanDoTexts = [
	'Мы&nbsp;помогаем запускать&nbsp;IT продукты',
	'Мы&nbsp;автоматизируем бизнес-процессы.',
	'Мы&nbsp;обучаем нейросети&nbsp;заказчиков.',
	'Мы&nbsp;верстаем и&nbsp;запускаем сайты.',
	'Мы&nbsp;разрабатываем образовательные платформы.',
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
			this.cursorNode.nodeValue = this.cursorNode.nodeValue === '|' ? '' : '|';
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
		// Используем Zero Width Space (невидимый символ) вместо неразрывного пробела
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

function initTextAnimation() {
	const textElement = document.querySelector(
		'.hero__description p:nth-child(2)'
	);
	if (!textElement) return;

	const animation = new TypingAnimation(textElement, heroCanDoTexts);
	animation.animate();
}

window.addEventListener('load', initTextAnimation);
