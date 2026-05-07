/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    let token = localStorage.getItem('yandex_token');
    if (!token) {
      token = prompt("Введите свой токен Яндекс.Диск:");
      if (token) {
        localStorage.setItem('yandex_token', token);
      }
    }
    return token;
  }

  static getHeaders() {
    return {
      'Authorization': `OAuth ${this.getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  static uploadFile(path, url, callback) {
    createRequest({
      url: `${this.HOST}/resources/upload?path=${encodeURIComponent(path)}&url=${encodeURIComponent(url)}`,
      method: 'POST',
      headers: this.getHeaders(),
      callback: callback
    });
  }

  static removeFile(path, callback) {
    createRequest({
      url: `${this.HOST}/resources?path=${encodeURIComponent(path)}`,
      method: 'DELETE',
      headers: this.getHeaders(),
      callback: callback
    });
  }

  static getUploadedFiles(callback) {
    createRequest({
      url: `${this.HOST}/resources/files`,
      method: 'GET',
      headers: this.getHeaders(),
      callback: callback
    });
  }

  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    link.setAttribute('rel', 'noreferrer');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}