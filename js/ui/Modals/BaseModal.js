/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor(element) {
    this.element = element;
    this.jqueryElement = $(element);
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.jqueryElement.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.jqueryElement.modal('hide');
  }
}