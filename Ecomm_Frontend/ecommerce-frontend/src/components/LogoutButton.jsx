import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/authStorage";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/");
  };

  return <button onClick={logout}>Logout</button>;
}
