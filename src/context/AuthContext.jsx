import { createContext, useState, useCallback } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(authService.isAuthenticated());
  const [adminName, setAdminName] = useState(localStorage.getItem("studio_admin_name") || "");

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setIsAuthed(true);
    setAdminName(data.name || "Studio Admin");
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthed(false);
    setAdminName("");
  }, []);

  const refreshName = useCallback(() => {
    setAdminName(localStorage.getItem("studio_admin_name") || "");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed, adminName, setAdminName, refreshName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
