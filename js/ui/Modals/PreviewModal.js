/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.content = this.element.querySelector('.content');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    const closeBtn = this.element.querySelector('.header i.x.icon');
    closeBtn.onclick = () => this.close();

    this.content.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete');
      const downloadBtn = e.target.closest('.download');

      if (deleteBtn) {
        const path = deleteBtn.dataset.path;
        deleteBtn.classList.add('disabled', 'loading');
        Yandex.removeFile(path, (err) => {
          if (!err) {
            deleteBtn.closest('.image-preview-container').remove();
          }
        });
      }

      if (downloadBtn) {
        const url = downloadBtn.dataset.file;
        Yandex.downloadFileByUrl(url);
      }
    });
  }

  show() {
    // Asterisk loading icon
    this.content.innerHTML = '<i class="asterisk loading icon massive"></i>';

    this.open();

    Yandex.getUploadedFiles((err, response) => {
      if (err) {
        alert("Ошибка загрузки файлов из Яндекса.");
        this.content.innerHTML = '';
        return;
      }

      if (response && response.items) {
        this.showImages(response.items);
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    this.content.innerHTML = data.map(item => this.getImageInfo(item)).join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    // Format: «30 декабря 2021 г. в 23:40»
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).replace(',', ' в');
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src="${item.preview}" referrerpolicy="no-referrer" />
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Создано</th>
              <th>Размер</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${item.name}</td>
              <td>${this.formatDate(item.created)}</td>
              <td>${(item.size / 1024).toFixed(1)} КБ</td>
            </tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red button delete" data-path="${item.path}">
            <i class="trash icon"></i> Удалить
          </button>
          <button class="ui labeled icon primary button download" data-file="${item.file}">
            <i class="download icon"></i> Скачать
          </button>
        </div>
      </div>`;
  }
}
