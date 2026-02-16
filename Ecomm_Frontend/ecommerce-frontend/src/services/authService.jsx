import api from "./api";

const login = (data) => {
  return api.post("/auth/login", data);
};

const register = (data) => {
  return api.post("/auth/register", data);
};

const logout = () => {
  localStorage.removeItem("token");
};

const saveToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

export default {
  login,
  register,
  logout,
  saveToken,
  getToken,
};
