import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Solo para lectura de datos en el frontend.
 */
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('token'));
  const [user, setUser]     = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  // Verifica si el token expiró al cargar
  useEffect(() => {
    if (!token) return;
    const decoded = decodeJWT(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      logout();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Inicia sesión con username y password.
   * El backend debe responder: { token: string, user: object }
   * o { token: string } (en cuyo caso se decodifica el JWT para obtener el user).
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);

      const newToken = data.token ?? data.accessToken;
      if (!newToken) throw new Error('Respuesta del servidor inválida: sin token.');

      // El backend puede devolver el user directamente, o lo sacamos del JWT
      const newUser = data.user ?? data.usuario ?? decodeJWT(newToken) ?? { username };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
