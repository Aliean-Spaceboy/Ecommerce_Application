import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authStorage";

export default function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}
