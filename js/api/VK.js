/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = 'vk1.a.p0iYeuKqEzBj8Zijo6N5psWwPjqoVlfpfZNdt5OphZoat8tjSCToDLruMj_dBvd1nbfnUYQPjqheekz3t1OcXVTuJsZvpa7x-EzWYZY-i102lM1U7K2PDQazjTlYv0CNyEWWp22qyz1DaZQg7VH9smTWAEbg5tsik3GNi4nbYcy02SvuEmA_dG1Uq3FickEh';
  static lastCallback = () => { };

  // VK emulator (mock for CORS security restrictions)
  static USE_MOCK = true;

  static get(id, callback) {
    this.lastCallback = callback;

    if (this.USE_MOCK) {
      console.warn("Активный режим моделирования: использование тестовых данных для предотвращения блокировок сети.");

      const mockResponse = {
        response: {
          items: [
            {
              sizes: [
                { width: 800, height: 800, url: 'https://media.istockphoto.com/id/1679733776/es/foto/imagen-en-primer-plano-del-martillo-del-juez-y-texto-responsabilidad-del-producto.jpg?s=1024x1024&w=is&k=20&c=rduPUDXw5Jy-ZljVmW3TxcurWUgFPBeqxO_l6xA9u-o=' }
              ],
              likes: { count: 15 },
              date: Math.floor(Date.now() / 1000)
            },
            {
              sizes: [
                { width: 800, height: 800, url: 'https://media.istockphoto.com/id/1324909380/es/foto/local-libro-de-responsabilidad-con-un-hummer-de-la-corte.jpg?s=1024x1024&w=is&k=20&c=2zVTypG_FeOdF91UxlA3XuvuzWqHR8952Ina95yQGDo=' }
              ],
              likes: { count: 42 },
              date: Math.floor(Date.now() / 1000)
            }
          ]
        }
      };

      // Мы используем небольшую задержку для имитации работы сети
      setTimeout(() => this.processData(mockResponse), 500);
      return;
    }

    // Preparing JSONP
    const script = document.createElement('script');
    script.id = 'vk-request';

    const baseUrl = 'https://vk.com';
    const params = `owner_id=${id}` +
                    `&album_id=profile` +
                    `&extended=1` +
                    `&photo_sizes=1` +
                    `&access_token=${this.ACCESS_TOKEN}` +
                    `&v=5.131` +
                    `&callback=VK.processData`;
    script.src = `${baseUrl}?${params}`;

    document.body.appendChild(script);
  }

  static processData(response) {
    const script = document.getElementById('vk-request');
    if (script) script.remove();

    if (response.error) {
      alert(`Ошибка VK: ${response.error.error_msg}`);
      return;
    }

    // Обрабатываем изображения по их размеру и выбираем самые большие.
    const photos = response.response.items.map(item => {
      const largestSize = item.sizes.reduce((prev, curr) =>
        (prev.width * prev.height > curr.width * curr.height) ? prev : curr
      );

      return {
        src: largestSize.url,
        likes: item.likes.count,
        date: item.date
      };
    });

    this.lastCallback(photos);
    this.lastCallback = () => { }; // Reset
  }
}

// Делаем класс VK глобальным.
window.VK = VK;