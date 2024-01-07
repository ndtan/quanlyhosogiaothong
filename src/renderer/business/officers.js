export function getOfficers(params = {}) {
  return window.electron.DB.all("SELECT id, name, date(birthday, 'unixepoch') as birthday FROM OFFICERS", params);
}

export function createOfficer(data = {}) {
  // this function will return data in format {changes:1, lastInsertRowid:6}
  return window.electron.DB.run('INSERT INTO officers (name) VALUES ($name)', {name: null});
}

export function getOfficer(id) {

}

export function updateOfficer(id, data) {

}

export function deleteOfficer(id) {

}
