import { useState } from "react";
import authService from "../services/authService";
import { saveToken, clearToken, getToken } from "../utils/authStorage";

export default function useAuth() {
  const [token, setToken] = useState(getToken());

  const login = async (data) => {
    const res = await authService.login(data);
    saveToken(res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
}
