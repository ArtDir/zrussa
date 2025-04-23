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
		this.heroDescriptionElement = document.querySelector(
			'.hero__description p:first-child'
		);

		// Элемент переключателя темы
		// Подождем, пока DOM будет полностью загружен
		setTimeout(() => {
			this.switchLabelElement = document.querySelector('.theme-switch__label');
		}, 0);

		// Элементы в блоке команды
		this.teamTextElement = document.querySelector('.team__text');
		this.teamRoles = {
			backend: document.querySelector(
				'.team__cards-item:nth-child(1) .team__cards-role'
			),
			frontend: document.querySelector(
				'.team__cards-item:nth-child(2) .team__cards-role'
			),
			marketing: document.querySelector(
				'.team__cards-item:nth-child(3) .team__cards-role'
			),
			pr: document.querySelector(
				'.team__cards-item:nth-child(4) .team__cards-role'
			),
			design: document.querySelector(
				'.team__cards-item:nth-child(5) .team__cards-role'
			),
			lead: document.querySelector(
				'.team__cards-item:nth-child(6) .team__cards-role'
			),
		};

		// Элементы технологий
		this.teamTechnologiesText = document.querySelector(
			'.team__technologies-text'
		);
		this.teamTechnologiesList = document.querySelector(
			'.team__technologies-list'
		);

		// Элементы в блоке преимуществ
		this.advantagesItems = {
			first: document.querySelector('.advantages__body-item:nth-child(1)'),
			second: document.querySelector('.advantages__body-item:nth-child(2)'),
			third: document.querySelector('.advantages__body-item:nth-child(3)'),
		};

		// Новые элементы в блоке заказа
		this.orderTitleElement = document.querySelector('#order .section__title');
		this.orderTextElement = document.querySelector('.order__text p');
		this.orderTextareaElement = document.querySelector(
			'.feedback-form__textarea'
		);
		this.orderButtonElement = document.querySelector(
			'.feedback-form__inputs-button'
		);

		// Элементы в блоке отзывов/СМИ
		this.reviewsTitleElement = document.querySelector(
			'#reviews .section__title'
		);
		this.reviewsContainer = document.querySelector('.reviews');
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
			this.heroDescriptionElement.innerHTML =
				'Мы - музыкальная группа, которая помогает:';
		}

		// Меняем тексты в блоке команды
		if (this.teamTextElement) {
			this.teamTextElement.innerHTML =
				'<b>Концерты под ключ.</b> Мы подберем уникальную программу именно под ваше мероприятие: патриотические песни, русский-рок, джаз или авторские песни - на ваш выбор. Поём от души, а не «под фанеру».';
		}

		// Меняем роли в команде
		if (this.teamRoles.backend)
			this.teamRoles.backend.textContent = 'Джаз-вокалист, саксофонист';
		if (this.teamRoles.frontend)
			this.teamRoles.frontend.textContent = 'Рок-вокалист, гитарист';
		if (this.teamRoles.marketing)
			this.teamRoles.marketing.textContent = 'Автор песен, бас-гитарист';
		if (this.teamRoles.pr)
			this.teamRoles.pr.textContent = 'Ведущий, организатор';
		if (this.teamRoles.design)
			this.teamRoles.design.textContent = 'Рок-вокалист, гитарист';
		if (this.teamRoles.lead) this.teamRoles.lead.textContent = 'Продюссер';

		// Меняем текст и иконки технологий
		if (this.teamTechnologiesText) {
			this.teamTechnologiesText.textContent =
				'В своих выступлениях мы используем:';
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
			this.advantagesItems.first.innerHTML =
				'<b>Широкий репертуар.</b></br>Мы одинаково хорошо будем смотреться как на деловом мероприятии, так и на шумном девишнике.';
		}
		if (this.advantagesItems.second) {
			this.advantagesItems.second.innerHTML =
				'<b>Приходим вовремя.</b></br>Мы не опаздываем, не пьем, не ругаемся матом. Чувство юмора гарантировано, остальное - только за компанию :)';
		}
		if (this.advantagesItems.third) {
			this.advantagesItems.third.innerHTML =
				'<b>Душевно, а не по листочку.</b></br>Нам важнее, чтобы у вас и гостей пробежали мурашки, чтобы они радовались и плакали, чем формальности мероприятия.';
		}

		// Меняем тексты в блоке заказа
		if (this.orderTitleElement) {
			this.orderTitleElement.textContent = 'Заказать концерт';
		}
		if (this.orderTextElement) {
			this.orderTextElement.innerHTML =
				'Сроки и&nbsp;стоимость концерта зависят от города, стиля, продолжительности и количества музыкантов. Минимальная стоимость выступления: 300&nbsp;000 рублей. Если ваш бюджет меньше, к&nbsp;сожалению, мы&nbsp;не&nbsp;сможем вам помочь.';
		}
		if (this.orderTextareaElement) {
			this.orderTextareaElement.setAttribute(
				'placeholder',
				'Опишите где будет ваш концерт? Сколько будет человек? В каком духе хотите песни?'
			);
		}
		if (this.orderButtonElement) {
			this.orderButtonElement.textContent = 'Заказать концерт';
		}

		// Меняем заголовок и содержимое блока отзывов
		if (this.reviewsTitleElement) {
			this.reviewsTitleElement.textContent = 'Выступления и СМИ';
		}
		if (this.reviewsContainer) {
			this.reviewsContainer.innerHTML = `
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/kreml.png" alt="Кремль">
            <div class="reviews__item-button-holder">
              <a href="#music1" class="reviews__item-button button popup-trigger" type="button">Смотреть видео</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Предприниматели Новгородской области провели концерт в поддержку семей участников СВО.
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                Новгородское областное телевидение
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                Кремль, г.Великий Новгород
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/molcentr.png" alt="Молодёжный центр" loading="lazy">
            <div class="reviews__item-button-holder">
              <a href="#music2" class="reviews__item-button button popup-trigger" type="button">Смотреть видео</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Первая репитиция группы «Здравая Русса» в новом молодёжном центре Старой Руссы, визит губернатора области.
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                Россия 1
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                г.Старая Русса
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/denmol.png" alt="День молодёжи" loading="lazy">
            <div class="reviews__item-button-holder">
              <a href="#music3" class="reviews__item-button button popup-trigger" type="button">Смотреть видео</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Выступление на «Дне Молодёжи» на одной из главных сцен города. Концерт по заявкам, который не смог сорвать даже проливной дождь.
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                День молодёжи
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                г.Старая Русса
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
      `;
		}

		// Меняем тексты для анимации набора текста
		window.heroTextsToUse = 'music';

		// Переинициализируем модальные окна после изменения DOM
		// Импортируем функцию динамически
		import('../modules/popup.js').then(module => {
			if (typeof module.initPopup === 'function') {
				setTimeout(() => module.initPopup(), 100); // Небольшая задержка для уверенности, что DOM обновлен
			}
		});
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
			this.heroDescriptionElement.innerHTML =
				'Мы&nbsp;—&nbsp;группа разработчиков, которая&nbsp;помогает:';
		}

		// Меняем тексты в блоке команды
		if (this.teamTextElement) {
			this.teamTextElement.innerHTML =
				'<b>Вовремя и&nbsp;без &laquo;сюрпризов&raquo;.</b> В&nbsp;своей работе мы&nbsp;руководствуемся принципами гибкой методологии разработки (Agile), а&nbsp;также принципами «несдвигаемых сроков» и&nbsp;«чистого кода». Что позволяет нам сдавать даже горящие проекты в&nbsp;срок.';
		}

		// Меняем роли в команде
		if (this.teamRoles.backend)
			this.teamRoles.backend.textContent = 'Бекенд-разработчик';
		if (this.teamRoles.frontend)
			this.teamRoles.frontend.textContent = 'Фронтенд-разработчик';
		if (this.teamRoles.marketing)
			this.teamRoles.marketing.textContent = 'Маркетолог';
		if (this.teamRoles.pr) this.teamRoles.pr.textContent = 'PR-менеджер';
		if (this.teamRoles.design) this.teamRoles.design.textContent = 'Дизайнер';
		if (this.teamRoles.lead)
			this.teamRoles.lead.textContent = 'Руководитель проектов';

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
			this.advantagesItems.first.innerHTML =
				'<b>Тушим пожары.</b></br>Если у вас есть срочный проект и нет времени собеседовать разработчиков, мы оперативно включимся и вытащим сроки.';
		}
		if (this.advantagesItems.second) {
			this.advantagesItems.second.innerHTML =
				'<b>Упрощаем.</b></br>Перед тем, как взяться за любой проект мы предложим этапы, улучшения и расскажем на чём можно выиграть время понятным человеческим языком.';
		}
		if (this.advantagesItems.third) {
			this.advantagesItems.third.innerHTML =
				'<b>Информируем.</b></br>В отличии от больших компаний и фрилансеров, мы, даже в критических ситуациях, держим заказчика в курсе: делаем отчёты, проводим встречи, отвечаем на вопросы.';
		}

		// Меняем тексты в блоке заказа
		if (this.orderTitleElement) {
			this.orderTitleElement.textContent = 'Заказать проект';
		}
		if (this.orderTextElement) {
			this.orderTextElement.innerHTML =
				'Сроки и&nbsp;стоимость проекта рассчитываются индивидуально, после онлайн-встречи. Минимальная стоимость разработки проекта: 5&nbsp;млн. рублей. Если ваш бюджет меньше, к&nbsp;сожалению, мы&nbsp;не&nbsp;сможем вам помочь.';
		}
		if (this.orderTextareaElement) {
			this.orderTextareaElement.setAttribute(
				'placeholder',
				'Опишите коротко ваш проект: Что вы хотите реализовать? Для кого? В какие сроки?'
			);
		}
		if (this.orderButtonElement) {
			this.orderButtonElement.textContent = 'Заказать';
		}

		// Меняем заголовок и содержимое блока отзывов
		if (this.reviewsTitleElement) {
			this.reviewsTitleElement.textContent = 'Отзывы';
		}
		if (this.reviewsContainer) {
			this.reviewsContainer.innerHTML = `
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/Aynur.png" alt="reviews">
            <div class="reviews__item-button-holder">
              <a href="#rev1" class="reviews__item-button button popup-trigger" type="button">Видео-отзыв</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Кир&nbsp;&mdash; очень ответственный человек, которому можно доверять разработку и&nbsp;создание ИТ-продукта. Я&nbsp;лично обучал его тому, как создавать качественные онлайн-сервисы.
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                Айнур Абдулнасыров, основатель LinguaLeo
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                г.Казань
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/Azamat.png" alt="reviews" loading="lazy">
            <div class="reviews__item-button-holder">
              <a href="#rev2" class="reviews__item-button button popup-trigger" type="button">Видео-отзыв</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Ему не&nbsp;нужно напоминать, он&nbsp;способен действовать до&nbsp;результата по&nbsp;вашему плану. Доводит начатое до&nbsp;конца и&nbsp;делает работу качественно. Таких добросовестных людей в&nbsp;интернете мало
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                Азамат Ушанов, эксперт по интернет-продвижению
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                г.Уфа
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
        <div class="reviews__item">
          <div class="reviews__item-card">
            <img class="reviews__item-image" src="../images/Leonid.png" alt="reviews" loading="lazy">
            <div class="reviews__item-button-holder">
              <a href="#rev3" class="reviews__item-button button popup-trigger" type="button">Видео-отзыв</a>
            </div>
          </div>
          <div class="reviews__item-body">
            <div class="reviews__item-text">
              <p>
                Все было сделано с&nbsp;опережением сроков, что большая редкость. Итоговый сайт получился функциональным, красивым и&nbsp;очень удобным для просмотра на&nbsp;любых устройствах. Рекомендую. Очень доволен.
              </p>
            </div>
            <div class="reviews__item-name">
              <span>
                Леонид Егоров, предприниматель
              </span>
            </div>
            <div class="reviews__item-city">
              <p>
                г.Санкт-Петербург
              </p>
            </div>
          </div>
          <div class="reviews__item-quote hidden-mobile">
            <img src="../images/icons/quote.png" alt="quote">
          </div>
        </div>
      `;
		}

		// Меняем тексты для анимации набора текста
		window.heroTextsToUse = 'it';

		// Переинициализируем модальные окна после изменения DOM
		// Импортируем функцию динамически
		import('../modules/popup.js').then(module => {
			if (typeof module.initPopup === 'function') {
				setTimeout(() => module.initPopup(), 100); // Небольшая задержка для уверенности, что DOM обновлен
			}
		});
	}
}
