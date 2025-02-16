export function byDate(a, b) {
  return new Date(a) - new Date(b);
}

export function byNumber(a, b, key, order = "asc") {
  return order === "asc" ? a[key] - b[key] : b[key] - a[key];
}
