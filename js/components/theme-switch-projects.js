/**
 * Модуль для управления проектами при переключении темы
 */
export default class ThemeSwitchProjects {
	/**
	 * Загружает карточки проектов для музыкальной темы
	 * @returns {boolean} Успешность операции
	 */
	static loadMusicProjectCards() {
		try {
			// Используем глобальную функцию переключения темы проектов
			if (typeof window.switchProjectsTheme === 'function') {
				window.switchProjectsTheme('music');
				console.log('Переключение на музыкальные проекты успешно');
				return true;
			} else {
				console.error('Функция переключения темы проектов недоступна');
				return false;
			}
		} catch (error) {
			console.error('Ошибка при переключении на музыкальные проекты:', error);
			return false;
		}
	}

	/**
	 * Загружает карточки проектов для IT темы
	 * @returns {boolean} Успешность операции
	 */
	static loadITProjectCards() {
		try {
			// Используем глобальную функцию переключения темы проектов
			if (typeof window.switchProjectsTheme === 'function') {
				window.switchProjectsTheme('it');
				console.log('Переключение на IT проекты успешно');
				return true;
			} else {
				console.error('Функция переключения темы проектов недоступна');
				return false;
			}
		} catch (error) {
			console.error('Ошибка при переключении на IT проекты:', error);
			return false;
		}
	}
}
