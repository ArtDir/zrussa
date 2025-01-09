const initSlider = () => {
	// DOM элементы
	const elements = {
		slider: document.querySelector('.projects-slider'),
		items: document.querySelector('.projects-slider__items'),
		cards: document.querySelectorAll('.project-card'),
		prevBtn: document.querySelector('#prevSlide'),
		nextBtn: document.querySelector('#nextSlide'),
	};

	// Состояние
	let currentSlide = 1;
	let currentOffset = 0;
	let metrics = {};

	// Обновление метрик слайдера
	const updateMetrics = () => {
		const cardWidth = elements.cards[0].getBoundingClientRect().width;
		const wrapperWidth = elements.slider.getBoundingClientRect().width;
		const gapWidth = parseFloat(getComputedStyle(elements.items).gap);

		metrics = {
			cardWidth,
			gapWidth,
			cardsInView: Math.floor(wrapperWidth / cardWidth),
			bigOffset: cardWidth + gapWidth,
			get smallOffset() {
				return cardWidth - (wrapperWidth - this.cardsInView * this.bigOffset);
			},
			get maxSlides() {
				return elements.cards.length - this.cardsInView;
			},
		};
	};

	// Обновление UI
	const updateUI = () => {
		elements.items.style.marginLeft = `${currentOffset}px`;
		elements.prevBtn.classList.toggle(
			'projects__slider-button--inactive',
			currentSlide < 2
		);
	};

	// Обработчики кликов
	const handleNext = () => {
		if (currentSlide < metrics.maxSlides) {
			currentOffset -= metrics.bigOffset;
			currentSlide += 1;
		} else if (currentSlide === metrics.maxSlides) {
			currentOffset -= metrics.smallOffset;
			currentSlide += 1;
		} else {
			currentSlide = 1;
			currentOffset = 0;
		}
		updateUI();
	};

	const handlePrev = () => {
		if (currentSlide > metrics.maxSlides) {
			currentOffset += metrics.smallOffset;
			currentSlide -= 1;
		} else if (currentSlide > 1) {
			currentOffset += metrics.bigOffset;
			currentSlide -= 1;
		} else {
			currentSlide = 1;
			currentOffset = 0;
		}
		updateUI();
	};

	// Инициализация
	const init = () => {
		updateMetrics();
		updateUI();

		elements.nextBtn.addEventListener('click', handleNext);
		elements.prevBtn.addEventListener('click', handlePrev);

		// Обработка ресайза с debounce
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				updateMetrics();
				currentSlide = 1;
				currentOffset = 0;
				updateUI();
			}, 250);
		});
	};

	init();
};

window.addEventListener('load', initSlider);
