/**
 * Модуль для управления текстами при переключении темы
 */
export default class ThemeSwitchTexts {
  constructor() {
    this.initElements();
  }

  /**
   * Инициализирует ссылки на элементы DOM
   */
  initElements() {
    // Элемент описания в блоке hero
    this.heroDescriptionElement = document.querySelector('.hero__description p:first-child');
    
    // Элемент переключателя темы
    // Подождем, пока DOM будет полностью загружен
    setTimeout(() => {
      this.switchLabelElement = document.querySelector('.theme-switch__label');
    }, 0);
    
    // Элементы в блоке команды
    this.teamTextElement = document.querySelector('.team__text');
    this.teamRoles = {
      backend: document.querySelector('.team__cards-item:nth-child(1) .team__cards-role'),
      frontend: document.querySelector('.team__cards-item:nth-child(2) .team__cards-role'),
      marketing: document.querySelector('.team__cards-item:nth-child(3) .team__cards-role'),
      pr: document.querySelector('.team__cards-item:nth-child(4) .team__cards-role'),
      design: document.querySelector('.team__cards-item:nth-child(5) .team__cards-role'),
      lead: document.querySelector('.team__cards-item:nth-child(6) .team__cards-role'),
    };
    
    // Элементы технологий
    this.teamTechnologiesText = document.querySelector('.team__technologies-text');
    this.teamTechnologiesList = document.querySelector('.team__technologies-list');
    
    // Элементы в блоке преимуществ
    this.advantagesItems = {
      first: document.querySelector('.advantages__body-item:nth-child(1)'),
      second: document.querySelector('.advantages__body-item:nth-child(2)'),
      third: document.querySelector('.advantages__body-item:nth-child(3)')
    };
  }

  /**
   * Применяет тексты музыкальной темы
   */
  applyMusicTheme() {
    // Меняем текст переключателя
    if (this.switchLabelElement) {
      this.switchLabelElement.textContent = 'Музыкальная группа';
    }

    // Меняем текст в блоке hero
    if (this.heroDescriptionElement) {
      this.heroDescriptionElement.innerHTML = 'Мы - музыкальная группа, которая помогает:';
    }

    // Меняем тексты в блоке команды
    if (this.teamTextElement) {
      this.teamTextElement.innerHTML = '<b>Концерты под ключ.</b> Мы подберем уникальную программу именно под ваше мероприятие: патриотические песни, русский-рок, джаз или авторские песни - на ваш выбор. Поём от души, а не «под фанеру».';
    }

    // Меняем роли в команде
    if (this.teamRoles.backend) this.teamRoles.backend.textContent = 'Джаз-вокалист, саксофонист';
    if (this.teamRoles.frontend) this.teamRoles.frontend.textContent = 'Рок-вокалист, гитарист';
    if (this.teamRoles.marketing) this.teamRoles.marketing.textContent = 'Автор песен, бас-гитарист';
    if (this.teamRoles.pr) this.teamRoles.pr.textContent = 'Ведущий, организатор';
    if (this.teamRoles.design) this.teamRoles.design.textContent = 'Рок-вокалист, гитарист';
    if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Продюссер';

    // Меняем текст и иконки технологий
    if (this.teamTechnologiesText) {
      this.teamTechnologiesText.textContent = 'В своих выступлениях мы используем:';
    }
    if (this.teamTechnologiesList) {
      this.teamTechnologiesList.innerHTML = `
        <li class="team__technologies-item"><img src="../images/icons/music/amplifier.png" alt="Усилитель"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/keyboard.png" alt="Клавишные"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/saxophone.png" alt="Саксофон"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/electric-guitar.png" alt="Электрогитара"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/electric-guitar_2.png" alt="Электрогитара"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/acoustic-guitar.png" alt="Акустическая гитара"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/microphone.png" alt="Микрофон"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/drum-set.png" alt="Ударные"></li>
        <li class="team__technologies-item"><img src="../images/icons/music/music-stand.png" alt="Пюпитер"></li>
      `;
    }

    // Меняем тексты в блоке преимуществ
    if (this.advantagesItems.first) {
      this.advantagesItems.first.innerHTML = '<b>Широкий репертуар.</b></br>Мы одинаково хорошо будем смотреться как на деловом мероприятии, так и на шумном девишнике.';
    }
    if (this.advantagesItems.second) {
      this.advantagesItems.second.innerHTML = '<b>Приходим вовремя.</b></br>Мы не опаздываем, не пьем, не ругаемся матом. Чувство юмора гарантировано, остальное - только за компанию :)';
    }
    if (this.advantagesItems.third) {
      this.advantagesItems.third.innerHTML = '<b>Душевно, а не по листочку.</b></br>Нам важнее, чтобы у вас и гостей пробежали мурашки, чтобы они радовались и плакали, чем формальности мероприятия.';
    }

    // Меняем тексты для анимации набора текста
    window.heroTextsToUse = 'music';
  }

  /**
   * Применяет тексты IT темы
   */
  applyITTheme() {
    // Меняем текст переключателя
    if (this.switchLabelElement) {
      this.switchLabelElement.textContent = 'IT-Команда';
    }

    // Меняем текст в блоке hero
    if (this.heroDescriptionElement) {
      this.heroDescriptionElement.innerHTML = 'Мы&nbsp;—&nbsp;группа разработчиков, которая&nbsp;помогает:';
    }

    // Меняем тексты в блоке команды
    if (this.teamTextElement) {
      this.teamTextElement.innerHTML = '<b>Вовремя и&nbsp;без &laquo;сюрпризов&raquo;.</b> В&nbsp;своей работе мы&nbsp;руководствуемся принципами гибкой методологии разработки (Agile), а&nbsp;также принципами «несдвигаемых сроков» и&nbsp;«чистого кода». Что позволяет нам сдавать даже горящие проекты в&nbsp;срок.';
    }

    // Меняем роли в команде
    if (this.teamRoles.backend) this.teamRoles.backend.textContent = 'Бекенд-разработчик';
    if (this.teamRoles.frontend) this.teamRoles.frontend.textContent = 'Фронтенд-разработчик';
    if (this.teamRoles.marketing) this.teamRoles.marketing.textContent = 'Маркетолог';
    if (this.teamRoles.pr) this.teamRoles.pr.textContent = 'PR-менеджер';
    if (this.teamRoles.design) this.teamRoles.design.textContent = 'Дизайнер';
    if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Руководитель проектов';

    // Меняем текст и иконки технологий
    if (this.teamTechnologiesText) {
      this.teamTechnologiesText.textContent = 'В работе мы используем:';
    }
    if (this.teamTechnologiesList) {
      this.teamTechnologiesList.innerHTML = `
        <li class="team__technologies-item"><img src="../images/icons/tech/HTML5.svg" alt="HTML5"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/CSS3.svg" alt="CSS3"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/JS.svg" alt="JavaScript"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/TS.svg" alt="TypeScript"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/NodeJS.svg" alt="Node.js"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/React.svg" alt="React"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/NextJS.svg" alt="NextJS"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/Sass.svg" alt="Sass"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/Python.svg" alt="Python"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/Django.svg" alt="Django"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/PostgreSQL.svg" alt="PostgreSQL"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/Git.svg" alt="Git"></li>
        <li class="team__technologies-item"><img src="../images/icons/tech/Docker.svg" alt="Docker"></li>
      `;
    }

    // Меняем тексты в блоке преимуществ
    if (this.advantagesItems.first) {
      this.advantagesItems.first.innerHTML = '<b>Тушим пожары.</b></br>Если у вас есть срочный проект и нет времени собеседовать разработчиков, мы оперативно включимся и вытащим сроки.';
    }
    if (this.advantagesItems.second) {
      this.advantagesItems.second.innerHTML = '<b>Упрощаем.</b></br>Перед тем, как взяться за любой проект мы предложим этапы, улучшения и расскажем на чём можно выиграть время понятным человеческим языком.';
    }
    if (this.advantagesItems.third) {
      this.advantagesItems.third.innerHTML = '<b>Информируем.</b></br>В отличии от больших компаний и фрилансеров, мы, даже в критических ситуациях, держим заказчика в курсе: делаем отчёты, проводим встречи, отвечаем на вопросы.';
    }

    // Меняем тексты для анимации набора текста
    window.heroTextsToUse = 'it';
  }
}
