import api from './api';

/**
 * authService — Autenticación con usuario + contraseña
 * POST /api/auth/login  → { token, user }
 * GET  /api/auth/me     → perfil del usuario logueado
 */
const authService = {
  /**
   * Inicia sesión.
   * @param {string} username
   * @param {string} password
   * @returns {{ token: string, user: object }}
   */
  login(username, password) {
    return api.post('/api/auth/login', { username, password });
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   */
  getProfile() {
    return api.get('/api/auth/me');
  },
};

export default authService;
