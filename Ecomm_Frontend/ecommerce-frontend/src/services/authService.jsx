import api from './api';

const login = (data) => api.post('/auth/login', data);
const register = (data) => api.post('/auth/register', data);

export default {
  login,
  register,
};
