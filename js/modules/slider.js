initSliderAnimation = () => {
	const sliderItems = document.querySelector('.projects-slider__items');
	const prevButton = document.querySelector('#prevSlide');
	const nextButton = document.querySelector('#nextSlide');
	const totalSlides = sliderItems.children.length;
	const totalSliderWidth = totalSlides * 18.5;

	let currentSlide = 0;
	let currentOffset = 0;

	prevButtonStateHandler = currentSlide => {
		if (currentSlide > 0) {
			prevButton.classList.remove('projects__slider-button--inactive');
		} else {
			prevButton.classList.add('projects__slider-button--inactive');
		}
	};

	nextButton.addEventListener('click', () => {
		if (currentSlide < totalSlides - 4) {
			currentSlide++;
			currentOffset -= 18.5;
			sliderItems.style.marginLeft = `${currentOffset}em`;
		} else if (currentSlide === totalSlides - 4) {
			currentSlide++;
			currentOffset -= 7.28;
			sliderItems.style.marginLeft = `${currentOffset}em`;
		} else {
			currentSlide = 0;
			currentOffset = 0;
			sliderItems.style.marginLeft = 0 + 'em';
		}
		console.log(currentSlide);
		prevButtonStateHandler(currentSlide);
	});

	prevButton.addEventListener('click', () => {
		if (currentSlide === totalSlides - 3) {
			currentSlide--;
			currentOffset += 7.28;
			sliderItems.style.marginLeft = `${currentOffset}em`;

			prevButtonStateHandler(currentSlide);
			console.log(currentSlide);
		} else if (currentSlide > 0) {
			currentSlide--;
			currentOffset += 18.5;
			sliderItems.style.marginLeft = `${currentOffset}em`;

			prevButtonStateHandler(currentSlide);
			console.log(currentSlide);
		}
	});
};

window.addEventListener('load', initSliderAnimation);
