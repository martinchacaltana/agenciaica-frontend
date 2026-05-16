import api from './api';

/** Pagos — /api/pagos */
const paymentService = {
  getAll(params)      { return api.get('/api/pagos', params); },
  getById(id)         { return api.get(`/api/pagos/${id}`); },
  create(data)        { return api.post('/api/pagos', data); },
  update(id, data)    { return api.put(`/api/pagos/${id}`, data); },
  remove(id)          { return api.delete(`/api/pagos/${id}`); },
};

export default paymentService;
