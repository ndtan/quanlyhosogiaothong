export function getProfiles(params) {
  return window.electron.DB.all("SELECT * FROM profiles", params);
}

export function createProfile(data) {

}

export function getProfile(id) {

}

export function updateProfile(id, data) {

}

export function deleteProfile(id) {

}
