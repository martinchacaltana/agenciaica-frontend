import api from './api';

/** Reservas — /api/reservas */
const reservationService = {
  getAll(params)      { return api.get('/api/reservas', params); },
  getById(id)         { return api.get(`/api/reservas/${id}`); },
  create(data)        { return api.post('/api/reservas', data); },
  update(id, data)    { return api.put(`/api/reservas/${id}`, data); },
  remove(id)          { return api.delete(`/api/reservas/${id}`); },
};

export default reservationService;
