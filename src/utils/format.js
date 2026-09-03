export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function categoryLabel(category) {
  const map = { wedding: "Weddings & Events", event: "Weddings & Events", brand: "Brand Marketing" };
  return map[category] || category;
}
