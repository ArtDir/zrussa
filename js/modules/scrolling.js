export function initSmoothScroll() {
  const menuLinks = document.querySelectorAll('.header__menu-link[href^="#"]');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', initSmoothScroll);