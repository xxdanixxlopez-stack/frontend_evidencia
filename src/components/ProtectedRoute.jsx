import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const adminEmails = [
    "xxdanixxlopez@gmail.com",
    "thehausebeauty@gmail.com"
  ];

  if (loading) return <div className="container">Cargando...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (!adminEmails.includes(user?.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
}