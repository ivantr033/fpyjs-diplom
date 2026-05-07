/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    const { url, data, method, callback, headers } = options;

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.response);
        } else {
            callback(xhr.response, null);
        }
    };

    try {
        xhr.open(method, url);

        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
        }

        xhr.send(method === 'GET' ? null : data);
    } catch (e) {
        callback(e, null);
    }
};