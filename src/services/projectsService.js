import api from "./api";

export async function getProjects() {
  const { data } = await api.get("/projects");
  return (data || []).map((p) => ({ ...p, id: p._id }));
}

export async function getProjectById(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data ? { ...data, id: data._id } : null;
}

export async function adminGetProjects() {
  const { data } = await api.get("/admin/projects");
  return (data || []).map((p) => ({ ...p, id: p._id }));
}

export async function adminSaveProject(project) {
  if (project.id) {
    const { data } = await api.patch(`/admin/projects/${project.id}`, project);
    return { ...data, id: data._id };
  }
  const { data } = await api.post("/admin/projects", project);
  return { ...data, id: data._id };
}

export async function adminDeleteProject(id) {
  await api.delete(`/admin/projects/${id}`);
  return true;
}
