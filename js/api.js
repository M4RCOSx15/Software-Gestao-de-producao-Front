/**
 * api.js — camada única de comunicação com o back-end.
 *
 * Centraliza:
 *  - montagem da URL (API_BASE_URL + path), evitando o bug de path relativo;
 *  - envio do header Authorization: Bearer <token> quando o usuário está logado;
 *  - tratamento padronizado de erros (nunca deixa a tela em branco);
 *  - logout automático em respostas 401/403.
 */

const TOKEN_KEY = 'prodmanager_token';
const USER_KEY = 'prodmanager_user';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isAuthenticated() {
  return Boolean(getToken());
}

/**
 * @param {string} path caminho da API, ex: '/auth/login'
 * @param {object} options
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [options.method]
 * @param {any} [options.body] objeto que será enviado como JSON
 * @param {boolean} [options.auth] envia o Bearer token (padrão: true)
 * @param {object} [options.params] query string params
 */
async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = true, params } = options;

  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError(
      `Não foi possível conectar ao servidor em ${API_BASE_URL}. Verifique se o back-end está rodando e se a URL em js/config.js está correta.`,
      0
    );
  }

  if (response.status === 401 || response.status === 403) {
    clearSession();
    if (!/login\.html$/.test(window.location.pathname)) {
      window.location.href = 'login.html';
    }
    throw new ApiError('Sessão expirada ou não autorizada. Faça login novamente.', response.status);
  }

  const raw = await response.text();
  const contentType = response.headers.get('content-type') || '';
  let data = raw;
  if (raw && contentType.includes('application/json')) {
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = raw;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Erro ${response.status} (${method} ${path}).`;
    throw new ApiError(message, response.status);
  }

  return data;
}

/** Mostra um alerta discreto no topo da tela em vez de deixar a página em branco. */
function showToast(message, type = 'error') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
