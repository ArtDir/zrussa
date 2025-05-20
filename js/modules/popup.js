const videoLinks = {
	// IT-тема видео
	'#rev1':
		'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239263&hd=1&autoplay=1',
	'#rev2':
		'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239264&hd=2&autoplay=1',
	'#rev3':
		'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239265&hd=2&autoplay=1',

	// Музыкальная тема видео
	'#music1':
		'https://vk.com/video_ext.php?oid=-225915697&id=456239020&hd=2&autoplay=1',
	'#music2':
		'https://vk.com/video_ext.php?oid=-225915697&id=456239029&hd=2&autoplay=1',
	'#music3':
		'https://vk.com/video_ext.php?oid=-225915697&id=456239017&hd=2&autoplay=1',
};

// Функция обработчика клика по триггеру
function handleTriggerClick(event) {
	event.preventDefault();
	const overlay = document.getElementById('overlay');
	const popupVideo = document.getElementById('popup-video');
	const videoId = this.getAttribute('href');
	const videoSrc = videoLinks[videoId];

	if (videoSrc) {
		popupVideo.src = videoSrc;
		overlay.classList.remove('visually-hidden');
	}
}

// Функция закрытия модального окна
function closePopup() {
	const overlay = document.getElementById('overlay');
	const popupVideo = document.getElementById('popup-video');
	overlay.classList.add('visually-hidden');
	popupVideo.src = '';
}

// Функция обработчика клика вне модального окна
function handleOverlayClick(event) {
	if (event.target === this) {
		closePopup();
	}
}

// Функция инициализации модального окна
export function initPopup() {
	const overlay = document.getElementById('overlay');
	
	// Добавляем проверку наличия элемента overlay на странице
	if (!overlay) {
		// На этой странице нет модальных окон, прерываем инициализацию
		return;
	}
	
	const closeButton = overlay.querySelector('.popup__close');

	// Удаляем старые обработчики, если они были добавлены
	const oldTriggers = document.querySelectorAll('.popup-trigger');
	oldTriggers.forEach(trigger => {
		trigger.removeEventListener('click', handleTriggerClick);
	});

	// Добавляем новые обработчики
	const popupTriggers = document.querySelectorAll('.popup-trigger');
	popupTriggers.forEach(trigger => {
		trigger.addEventListener('click', handleTriggerClick);
	});

	// Добавляем обработчик закрытия модального окна
	closeButton.removeEventListener('click', closePopup);
	closeButton.addEventListener('click', closePopup);

	// Добавляем обработчик клика вне модального окна
	overlay.removeEventListener('click', handleOverlayClick);
	overlay.addEventListener('click', handleOverlayClick);
}

document.addEventListener('DOMContentLoaded', initPopup);
