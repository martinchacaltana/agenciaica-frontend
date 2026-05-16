/**
 * api.js — Cliente HTTP base
 * Todas las llamadas al backend pasan por aquí.
 * - Adjunta automáticamente el JWT del localStorage
 * - Si recibe 401, limpia el token y redirige al login
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('token');
}

function buildHeaders(extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // si el body no es JSON, usamos el mensaje genérico
    }
    throw new Error(message);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

const api = {
  get(path, params) {
    let url = `${BASE_URL}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }
    return fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
    }).then(handleResponse);
  },

  post(path, body) {
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse);
  },

  put(path, body) {
    return fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse);
  },

  patch(path, body) {
    return fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse);
  },

  delete(path) {
    return fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then(handleResponse);
  },
};

export default api;
