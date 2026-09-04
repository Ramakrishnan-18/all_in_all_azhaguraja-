import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthed, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}
