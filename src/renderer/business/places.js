export function getPlaces() {
  return window.electron.DB.all("SELECT * FROM places");
}

export function getPlace(id) {
  return window.electron.DB.get("SELECT * FROM places WHERE id=$id", {id});
}
