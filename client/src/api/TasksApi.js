import { ApiError } from './ApiError';

export class TasksApi {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  list(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.#request(`/tasks${query}`);
  }

  get(id) {
    return this.#request(`/tasks/${encodeURIComponent(id)}`);
  }

  create(task) {
    return this.#request('/tasks', { method: 'POST', body: task });
  }

  update(id, task) {
    return this.#request(`/tasks/${encodeURIComponent(id)}`, { method: 'PUT', body: task });
  }

  remove(id) {
    return this.#request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  upload(id, file) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return this.#request(`/tasks/${encodeURIComponent(id)}/attachments`, {
      method: 'POST',
      formData,
    });
  }

  removeAttachment(taskId, attachmentId) {
    return this.#request(
      `/tasks/${encodeURIComponent(taskId)}/attachments/${encodeURIComponent(attachmentId)}`,
      { method: 'DELETE' },
    );
  }

  downloadUrl(taskId, attachmentId) {
    return `${this.baseUrl}/tasks/${encodeURIComponent(taskId)}/attachments/${encodeURIComponent(attachmentId)}/download`;
  }

  async download(taskId, attachmentId, fileName) {
    let response;
    try {
      response = await fetch(this.downloadUrl(taskId, attachmentId));
    } catch {
      throw new ApiError('Нет соединения с сервером', 0);
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(data.message || 'Не удалось скачать файл', response.status, data.fields || {});
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async #request(path, { method = 'GET', body, formData } = {}) {
    const headers = {};
    let payload;
    if (formData) {
      payload = formData;
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { method, headers, body: payload });
    } catch {
      throw new ApiError('Нет соединения с сервером', 0);
    }

    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data.message || 'Ошибка запроса', response.status, data.fields || {});
    }
    return data;
  }
}
