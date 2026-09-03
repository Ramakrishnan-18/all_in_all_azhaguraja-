import { _db } from "./mockData";

export async function getPackages() {
  return _db.getPackages().filter((p) => p.enabled !== false);
}

export async function adminGetPackages() {
  return _db.getPackages();
}

export async function adminSavePackage(pkg) {
  const all = _db.getPackages();
  if (pkg.id) {
    const idx = all.findIndex((p) => p.id === pkg.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...pkg };
    }
  } else {
    pkg.id = "pk" + Date.now();
    pkg.enabled = true;
    all.push(pkg);
  }
  _db.setPackages(all);
  return pkg;
}

export async function adminDeletePackage(id) {
  const all = _db.getPackages();
  const next = all.filter((p) => p.id !== id);
  _db.setPackages(next);
  return true;
}
