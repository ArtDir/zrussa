/**
 * Модуль для управления цветами при переключении темы
 */
export default class ThemeSwitchColors {
  /**
   * Применяет цветовую схему музыкальной темы
   */
  static applyMusicTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', 'var(--music-primary-color)');
    root.style.setProperty('--primary-white', 'var(--music-primary-white)');
    root.style.setProperty('--primary-dark', 'var(--music-primary-dark)');
    root.style.setProperty('--primary-disable', 'var(--music-primary-disable)');
    root.style.setProperty('--primary-disable-alt', 'var(--music-primary-disable-alt)');
    root.style.setProperty('--primary-link', 'var(--music-primary-link)');
    console.log('Цветовая схема: Музыкальная группа');
  }

  /**
   * Применяет цветовую схему IT темы
   */
  static applyITTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', 'var(--it-primary-color)');
    root.style.setProperty('--primary-white', 'var(--it-primary-white)');
    root.style.setProperty('--primary-dark', 'var(--it-primary-dark)');
    root.style.setProperty('--primary-disable', 'var(--it-primary-disable)');
    root.style.setProperty('--primary-disable-alt', 'var(--it-primary-disable-alt)');
    root.style.setProperty('--primary-link', 'var(--it-primary-link)');
    console.log('Цветовая схема: IT-команда');
  }
}
