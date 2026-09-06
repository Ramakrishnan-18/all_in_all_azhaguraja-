import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
