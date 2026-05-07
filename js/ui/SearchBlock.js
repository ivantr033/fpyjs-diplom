/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    const input = this.element.querySelector('input');
    const replaceBtn = this.element.querySelector('.replace');
    const addBtn = this.element.querySelector('.add');

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addBtn.click();
      }
    });

    replaceBtn.addEventListener('click', () => {
      const id = input.value.trim();
      if (id) {
        VK.get(id, (photos) => {
          App.imageViewer.clear();
          App.imageViewer.drawImages(photos);
        });
      }
    });

    addBtn.addEventListener('click', () => {
      const id = input.value.trim();
      if (id) {
        VK.get(id, (photos) => {
          App.imageViewer.drawImages(photos);
        });
      }
    });
  }

}