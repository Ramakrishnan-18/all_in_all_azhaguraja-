import { _db } from "./mockData";

export async function getServices() {
  return _db.getServices().filter((s) => s.enabled !== false);
}

export async function adminGetServices() {
  return _db.getServices();
}

export async function adminSaveService(service) {
  const all = _db.getServices();
  if (service.id) {
    const idx = all.findIndex((s) => s.id === service.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...service };
    }
  } else {
    service.id = "s" + Date.now();
    service.enabled = true;
    all.push(service);
  }
  _db.setServices(all);
  return service;
}

export async function adminDeleteService(id) {
  const all = _db.getServices();
  const next = all.filter((s) => s.id !== id);
  _db.setServices(next);
  return true;
}
