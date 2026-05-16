import api from './api';

/** Personal (Staff) — /api/personal */
const staffService = {
  getAll(params)      { return api.get('/api/personal', params); },
  getById(id)         { return api.get(`/api/personal/${id}`); },
  create(data)        { return api.post('/api/personal', data); },
  update(id, data)    { return api.put(`/api/personal/${id}`, data); },
  toggleEstado(id)    { return api.patch(`/api/personal/${id}/toggle-estado`); },
};

export default staffService;
