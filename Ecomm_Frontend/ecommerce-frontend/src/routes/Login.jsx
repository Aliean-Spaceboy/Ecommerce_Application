import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authService.login(form).then((res) => {
      authService.saveToken(res.data.token);
      navigate("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
      />
      <button>Login</button>
    </form>
  );
}
