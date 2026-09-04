import { createContext, useState, useCallback, useEffect } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    let active = true;
    authService.getCurrentAdmin()
      .then((currentAdmin) => {
        if (!active) return;
        setAdmin(currentAdmin);
        setAdminName(currentAdmin.name || "");
        setIsAuthed(true);
      })
      .catch(() => {
        if (!active) return;
        setAdmin(null);
        setIsAuthed(false);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setAdmin(data);
    setIsAuthed(true);
    setAdminName(data.name || "Studio Admin");
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAdmin(null);
    setIsAuthed(false);
    setAdminName("");
  }, []);

  const refreshName = useCallback(() => {
    setAdminName(authService.getCurrentAdminName());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed, isLoading, admin, adminName, setAdminName, refreshName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
