const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      ...rest,
    });
  } catch {
    throw new Error('Cannot reach the API. Check that Nginx, the frontend, and Django are running.');
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.detail) {
        detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data.title) {
        detail = Array.isArray(data.title) ? data.title.join(' ') : String(data.title);
      }
    } catch {
      // keep the status-based message
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getTasks() {
  return request('/tasks/');
}

export function createTask(payload) {
  return request('/tasks/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(id, payload) {
  return request(`/tasks/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}/`, {
    method: 'DELETE',
  });
}
