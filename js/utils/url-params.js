/**
 * Утилита для работы с URL-параметрами
 * Позволяет открывать попапы с товарами по прямым ссылкам вида /shop.html?id=1
 */
class UrlParams {
  constructor() {
    this.init();
  }

  /**
   * Инициализация модуля
   */
  init() {
    // Проверяем URL при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
      this.checkUrlParams();
    });
  }

  /**
   * Проверка URL-параметров и выполнение соответствующих действий
   */
  checkUrlParams() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Если есть параметр id, открываем попап с товаром
    if (productId) {
      // Проверяем, загружен ли модуль ProductDetail
      if (typeof window.productDetailInstance === 'undefined') {
        console.error('Модуль ProductDetail не инициализирован');
        return;
      }

      // Небольшая задержка, чтобы убедиться, что все компоненты загружены
      setTimeout(() => {
        // Открываем попап с товаром по ID
        window.productDetailInstance.showProductDetail(productId);
        
        // Обновляем URL без параметра, чтобы при обновлении страницы попап не открывался снова
        // Но сохраняем возможность использования кнопки "назад" в браузере
        const newUrl = window.location.pathname;
        window.history.pushState({ productId }, '', newUrl);
      }, 300);
    }
  }
}

// Экспортируем класс
export default UrlParams;
