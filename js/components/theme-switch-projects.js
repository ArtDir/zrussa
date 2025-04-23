/**
 * Модуль для управления проектами при переключении темы
 */
export default class ThemeSwitchProjects {
  /**
   * Загружает данные проектов для музыкальной темы
   * @returns {Promise} Промис с данными проектов
   */
  static async loadMusicProjectCards() {
    try {
      const response = await fetch('src/slider-cards-music.json');
      const data = await response.json();
      ThemeSwitchProjects.updateProjectCards(data);
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке данных для музыкальных проектов:', error);
      return null;
    }
  }

  /**
   * Загружает данные проектов для IT темы
   * @returns {Promise} Промис с данными проектов
   */
  static async loadITProjectCards() {
    try {
      const response = await fetch('src/slider-cards.json');
      const data = await response.json();
      ThemeSwitchProjects.updateProjectCards(data);
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке данных для IT проектов:', error);
      return null;
    }
  }

  /**
   * Обновляет карточки проектов на странице
   * @param {Array} data Массив данных проектов
   */
  static updateProjectCards(data) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      if (index >= data.length) return;
      
      const cardData = data[index];
      
      // Обновляем изображение
      const image = card.querySelector('.project-card__image img');
      if (image) image.src = cardData.image;
      
      // Обновляем заголовок
      const title = card.querySelector('.project-card__title');
      if (title) title.innerHTML = `<h3>${cardData.title}</h3>`;
      
      // Обновляем описание
      const description = card.querySelector('.project-card__description');
      if (description) description.innerHTML = `<p>${cardData.description}</p>`;
      
      // Обновляем кнопки
      const buttonsContainer = card.querySelector('.project-card__buttons');
      if (buttonsContainer && cardData.buttons) {
        buttonsContainer.innerHTML = '';
        
        cardData.buttons.forEach(button => {
          const buttonElement = document.createElement('a');
          buttonElement.href = button.url;
          buttonElement.textContent = button.text;
          buttonElement.className = `project-card__button button--${button.type} button`;
          
          if (button.target) {
            buttonElement.target = button.target;
          }
          
          buttonsContainer.appendChild(buttonElement);
        });
      }
    });
  }
}
