import api from './api';

/**
 * dashboardService — Estadísticas y datos para el Dashboard
 * Endpoints esperados del backend:
 *   GET /api/dashboard/stats      → { totalIngresos, totalReservas, clientesActivos, paquetesActivos }
 *   GET /api/dashboard/monthly    → [{ mes, ingresos, reservas }]
 *   GET /api/dashboard/destinos   → [{ destino, reservas }]
 *   GET /api/dashboard/recientes  → últimas 5 reservas con cliente y paquete embebidos
 */
const dashboardService = {
  getStats()              { return api.get('/api/dashboard/stats'); },
  getMonthlyStats()       { return api.get('/api/dashboard/monthly'); },
  getDestinoStats()       { return api.get('/api/dashboard/destinos'); },
  getRecentReservations() { return api.get('/api/dashboard/recientes'); },
};

export default dashboardService;
