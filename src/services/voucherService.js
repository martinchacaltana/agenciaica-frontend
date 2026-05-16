import api from './api';

/** Comprobantes — /api/comprobantes */
const voucherService = {
  getAll(params)      { return api.get('/api/comprobantes', params); },
  getById(id)         { return api.get(`/api/comprobantes/${id}`); },
  create(data)        { return api.post('/api/comprobantes', data); },
  update(id, data)    { return api.put(`/api/comprobantes/${id}`, data); },
  remove(id)          { return api.delete(`/api/comprobantes/${id}`); },
};

export default voucherService;
