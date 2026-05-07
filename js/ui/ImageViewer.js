/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.imagesList = element.querySelector('.images-list .grid .row');
    this.previewImage = element.querySelector('.six.wide.column img');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.imagesList.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      }
    });

    this.imagesList.addEventListener('dblclick', (e) => {
      if (e.target.tagName === 'IMG') {
        this.previewImage.src = e.target.src;
      }
    });

    const selectAllBtn = this.element.querySelector('.select-all');
    selectAllBtn.addEventListener('click', () => {
      const images = Array.from(this.imagesList.querySelectorAll('img'));
      const allSelected = images.length > 0 && images.every(img => img.classList.contains('selected'));

      images.forEach(img => {
        if (allSelected) {
          img.classList.remove('selected');
        } else {
          img.classList.add('selected');
        }
      });
      this.checkButtonText();
    });

    this.element.querySelector('.show-uploaded-files').addEventListener('click', () => {
      App.getModal('filePreviewer').show();
    });

    this.element.querySelector('.send').addEventListener('click', () => {
      const selectedImages = Array.from(this.imagesList.querySelectorAll('img.selected'));
      const urls = selectedImages.map(img => img.src);
      App.getModal('fileUploader').showImages(urls);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesList.innerHTML = '';
    this.checkButtonText();
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const selectAllBtn = this.element.querySelector('.select-all');
    if (images.length > 0) {
      selectAllBtn.classList.remove('disabled');
    }

    images.forEach(photo => {
      const container = document.createElement('div');
      container.className = 'four wide column ui medium image-wrapper';
      container.innerHTML = `<img src="${photo.src}" referrerpolicy="no-referrer" />`;
      this.imagesList.appendChild(container);
    });
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const images = Array.from(this.imagesList.querySelectorAll('img'));
    const selectedImages = this.imagesList.querySelectorAll('img.selected');
    const selectAllBtn = this.element.querySelector('.select-all');
    const sendBtn = this.element.querySelector('.send');

    const allSelected = images.length > 0 && images.every(img => img.classList.contains('selected'));
    selectAllBtn.textContent = allSelected ? 'Снять выделение' : 'Выбрать всё';

    if (selectedImages.length > 0) {
      sendBtn.classList.remove('disabled');
    } else {
      sendBtn.classList.add('disabled');
    }
  }

}