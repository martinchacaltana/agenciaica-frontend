import api from './api';

/** Paquetes Turísticos — /api/paquetes */
const packageService = {
  getAll(params)      { return api.get('/api/paquetes', params); },
  getById(id)         { return api.get(`/api/paquetes/${id}`); },
  create(data)        { return api.post('/api/paquetes', data); },
  update(id, data)    { return api.put(`/api/paquetes/${id}`, data); },
  remove(id)          { return api.delete(`/api/paquetes/${id}`); },
  toggleEstado(id)    { return api.patch(`/api/paquetes/${id}/toggle-estado`); },
};

export default packageService;
