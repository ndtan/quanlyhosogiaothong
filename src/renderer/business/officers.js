export function getOfficers(params = {}) {
  return window.electron.DB.all("SELECT * , date(birthday, 'unixepoch', 'localtime') as birthday FROM OFFICERS", params);
}

export function createOfficer(data = {}) {
  data.birthday = data.birthday ?? null;
  // this function will return data in format {changes:1, lastInsertRowid:6}
  return window.electron.DB.run(
    "INSERT INTO officers(name,department,role,birthday) \
    VALUES ($name,$department,$role,unixepoch($birthday, 'localtime'))", data);
}

export function getOfficer(id) {
  return window.electron.DB.get("SELECT *, date(birthday, 'unixepoch', 'localtime') as birthday FROM OFFICERS WHERE id=$id", {id});
}

export function updateOfficer(id, data) {

}

export function deleteOfficer(id) {

}
