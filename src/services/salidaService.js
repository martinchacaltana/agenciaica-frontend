import api from './api';

/** Salidas — /api/salidas */
const salidaService = {
  getAll(params)      { return api.get('/api/salidas', params); },
  getById(id)         { return api.get(`/api/salidas/${id}`); },
  create(data)        { return api.post('/api/salidas', data); },
  update(id, data)    { return api.put(`/api/salidas/${id}`, data); },
  remove(id)          { return api.delete(`/api/salidas/${id}`); },
};

export default salidaService;
