import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const SettingsContext = createContext(null);

const defaults = {
  brandName: "ALL IN ALL AZHAGURAJA",
  tagline: "Create Moments, Build Brands",
  contactPhone: "+91 93455 52352",
  contactWhatsApp: "919345552352",
  contactEmail: "sakthiveeraputhiran50@gmail.com",
  instagramUrl: "https://instagram.com/all_in_all_azhaguraja",
  youtubeUrl: "https://youtube.com/@allinallazhaguraja",
  location: "Palayamkottai, Tirunelveli, Tamil Nadu",
  workingHours: "10:00 AM - 8:00 PM",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => setSettings({ ...defaults, ...data }))
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
