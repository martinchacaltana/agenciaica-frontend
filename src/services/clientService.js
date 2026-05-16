import api from './api';

/** Clientes — /api/clientes */
const clientService = {
  getAll(params)      { return api.get('/api/clientes', params); },
  getById(id)         { return api.get(`/api/clientes/${id}`); },
  create(data)        { return api.post('/api/clientes', data); },
  update(id, data)    { return api.put(`/api/clientes/${id}`, data); },
  remove(id)          { return api.delete(`/api/clientes/${id}`); },
};

export default clientService;
