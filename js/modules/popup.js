const videoLinks = {
    '#rev1': 'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239263&hd=1&autoplay=1',
    '#rev2': 'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239264&hd=2&autoplay=1',
    '#rev3': 'https://vkvideo.ru/video_ext.php?oid=-5914255&id=456239265&hd=2&autoplay=1'
};

export function initPopup() {
    const overlay = document.getElementById('overlay');
    const popupVideo = document.getElementById('popup-video');
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const closeButton = overlay.querySelector('.popup__close');

    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            const videoId = this.getAttribute('href');
            const videoSrc = videoLinks[videoId];

            if (videoSrc) {
                popupVideo.src = videoSrc;
                overlay.classList.remove('visually-hidden');
            }
        });
    });

    closeButton.addEventListener('click', () => {
        overlay.classList.add('visually-hidden');
        popupVideo.src = '';
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.classList.add('visually-hidden');
            popupVideo.src = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', initPopup);