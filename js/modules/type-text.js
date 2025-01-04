const heroCanDoTexts = [
	'Запускаем IT проекты',
	'Автоматизируем бизнес-процессы',
	'Настраиваем нейросети',
	'Верстаем сайты и приложения',
	'Разрабатываем образовательные платформы',
];

// Check all elements are loaded
window.onload = () => {
	console.log('Страница и все скрипты и загружены!');

	// Init typing on Hero section
	initHeroTextRotation();
};

const findHeroDescriptionElement = () => {
	return document.querySelector('.hero__description p:nth-child(2)');
};

const createTextRotationCycle = (element, textArray) => {
	let currentIndex = 0;

	return () => {
		element.textContent = textArray[currentIndex];
		currentIndex = (currentIndex + 1) % textArray.length;
	};
};

const initHeroTextRotation = () => {
	const heroDescriptionElement = findHeroDescriptionElement();
	const rotateHeroText = createTextRotationCycle(
		heroDescriptionElement,
		heroCanDoTexts
	);

	// Первоначальная установка текста
	rotateHeroText();

	// Запуск интервала для смены текста каждые 3 секунды
	setInterval(rotateHeroText, 3000);
};
