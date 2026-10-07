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

const saveCustomer = (customer) => {
  localStorage.setItem("customer", JSON.stringify(customer));
};

const getCustomer = () => {
  const cust = localStorage.getItem("customer");
  return cust ? JSON.parse(cust) : null;
};

export default {
  login,
  register,
  logout,
  saveToken,
  getToken,
  saveCustomer,
  getCustomer,
};
