sliderAnimation = () => {
	const totalSlidesCount = document.querySelectorAll('.project-card').length;
	const cardWidth = document
		.querySelector('.project-card')
		.getBoundingClientRect().width;
	const gapWidth = parseFloat(
		getComputedStyle(document.querySelector('.projects-slider__items')).gap
	);
	const wrapperWidth = document
		.querySelector('.projects-slider')
		.getBoundingClientRect().width;
	const cardsInViewCount = Math.floor(wrapperWidth / cardWidth);

	const bigOffset = cardWidth + gapWidth;
	const smallOffset = cardWidth - (wrapperWidth - cardsInViewCount * bigOffset);

	const countOfClicks = totalSlidesCount - cardsInViewCount;
	const prevButton = document.querySelector('#prevSlide');
	const nextButton = document.querySelector('#nextSlide');
	const sliderItems = document.querySelector('.projects-slider__items');

	let currentSlide = 1;
	let currentOffset = 0;

	prevButtonStateHandler = () => {
		if (currentSlide < 2) {
			prevButton.classList.add('projects__slider-button--inactive');
		} else {
			prevButton.classList.remove('projects__slider-button--inactive');
		}
	};

	nextButton.addEventListener('click', () => {
		if (currentSlide < countOfClicks) {
			currentOffset -= bigOffset;
			sliderItems.style.marginLeft = `${currentOffset}px`;
			currentSlide += 1;
		} else if (currentSlide === countOfClicks) {
			currentOffset -= smallOffset;
			sliderItems.style.marginLeft = `${currentOffset}px`;
			currentSlide += 1;
		} else {
			currentSlide = 1;
			currentOffset = 0;
			sliderItems.style.marginLeft = 0 + 'px';
		}

		prevButtonStateHandler();
	});

	prevButton.addEventListener('click', () => {
		if (currentSlide < 2) {
			currentSlide = 1;
			currentOffset = 0;
			sliderItems.style.marginLeft = 0 + 'px';
		} else if (currentSlide <= countOfClicks) {
			currentOffset += bigOffset;
			sliderItems.style.marginLeft = `${currentOffset}px`;
			currentSlide -= 1;
		} else if (currentSlide > countOfClicks) {
			currentOffset += smallOffset;
			sliderItems.style.marginLeft = `${currentOffset}px`;
			currentSlide -= 1;
		}

		prevButtonStateHandler();
	});
};

// function getDeviceType() {
// 	const width = window.innerWidth;

// 	if (width >= 1920) {
// 		return { type: 'desktop', slidesOffset: 5 };
// 	} else if (width >= 1024 && width < 1920) {
// 		return { type: 'tablet', slidesOffset: 4 };
// 	} else {
// 		return { type: 'mobile', slidesOffset: 1 };
// 	}
// }

// initSliderAnimation = () => {
// 	const sliderItems = document.querySelector('.projects-slider__items');
// 	const prevButton = document.querySelector('#prevSlide');
// 	const nextButton = document.querySelector('#nextSlide');
// 	const totalSlides = sliderItems.children.length;
// 	const cardWidth = document // ширина одной карточки
// 		.querySelector('.project-card')
// 		.getBoundingClientRect().width;
// 	const wrapperWidth = document // ширина видимой части слайдера
//     .querySelector('.projects-slider')
//     .getBoundingClientRect().width;

// 	let currentSlide = 0;
// 	let currentOffset = 0;
// 	const { slidesOffset } = getDeviceType();

// 	prevButtonStateHandler = currentSlide => {
// 		if (currentSlide > 0) {
// 			prevButton.classList.remove('projects__slider-button--inactive');
// 		} else {
// 			prevButton.classList.add('projects__slider-button--inactive');
// 		}
// 	};

// 	nextButton.addEventListener('click', () => {
// 		if (currentSlide < totalSlides - slidesOffset) {
// 			currentSlide++;
// 			currentOffset -= cardWidth;
// 			sliderItems.style.marginLeft = `${currentOffset}em`;
// 		} else if (currentSlide === totalSlides - slidesOffset) {
// 			currentSlide++;
// 			currentOffset -= 7.28;
// 			sliderItems.style.marginLeft = `${currentOffset}em`;
// 		} else {
// 			currentSlide = 0;
// 			currentOffset = 0;
// 			sliderItems.style.marginLeft = 0 + 'em';
// 		}
// 		console.log(currentSlide);
// 		prevButtonStateHandler(currentSlide);
// 	});

// 	prevButton.addEventListener('click', () => {
// 		if (currentSlide === totalSlides - slidesOffset + 1) {
// 			currentSlide--;
// 			currentOffset += 7.28;
// 			sliderItems.style.marginLeft = `${currentOffset}em`;

// 			prevButtonStateHandler(currentSlide);
// 			console.log(currentSlide);
// 		} else if (currentSlide > 0) {
// 			currentSlide--;
// 			currentOffset += cardWidth;
// 			sliderItems.style.marginLeft = `${currentOffset}em`;

// 			prevButtonStateHandler(currentSlide);
// 			console.log(currentSlide);
// 		}
// 	});
// };

window.addEventListener('load', sliderAnimation);
