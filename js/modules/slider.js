const initSlider = () => {
	const elements = {
		slider: document.querySelector('.projects-slider'),
		items: document.querySelector('.projects-slider__items'),
		cards: document.querySelectorAll('.project-card'),
		prevBtn: document.querySelector('#prevSlide'),
		nextBtn: document.querySelector('#nextSlide'),
	};

	// Ждем загрузку карточек
	if (elements.cards.length === 0) {
		setTimeout(initSlider, 100);
		return;
	}

	let currentSlide = 1;
	let currentOffset = 0;
	let metrics = {};

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

	const updateUI = () => {
		// Применяем плавную анимацию для мобильных устройств
		if (window.innerWidth <= 767) {
			// Для мобильных устройств используем анимацию через transform
			elements.items.style.transition = 'transform 0.3s ease-out';
			elements.items.style.transform = `translateX(${currentOffset}px)`;
			elements.items.style.webkitTransform = `translateX(${currentOffset}px)`; // Для старых версий Safari
		} else {
			// Для десктопа оставляем margin-left
			elements.items.style.transition = 'margin-left 0.3s ease';
			elements.items.style.marginLeft = `${currentOffset}px`;
			// Сбрасываем transform, если он был установлен ранее
			elements.items.style.transform = '';
			elements.items.style.webkitTransform = '';
		}
		elements.prevBtn.classList.toggle(
			'projects__slider-button--inactive',
			currentSlide < 2
		);

		// Удаление filter:sepia для карточек на мобильном
		if (window.innerWidth <= 767) {
			elements.cards.forEach((card, index) => {
				const mediaElement = card.querySelector('.project-card__image');
				if (mediaElement) {
					mediaElement.style.filter =
						index === currentSlide - 1 ? 'sepia(0%)' : 'sepia(100%)';
				}
			});
		} else {
			elements.cards.forEach(card => {
				const mediaElement = card.querySelector('.project-card__image');
				if (mediaElement) {
					mediaElement.style.filter = '';
				}
			});
		}
	};

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

	const init = () => {
		updateMetrics();
		updateUI();

		elements.nextBtn.addEventListener('click', handleNext);
		elements.prevBtn.addEventListener('click', handlePrev);

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

// Делаем функцию доступной глобально
window.initSlider = initSlider;

window.addEventListener('load', initSlider);
