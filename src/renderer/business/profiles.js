import {getOfficer} from "./officers";

export function getProfiles(params = {}, sort = {}, filter = {}) {
  let sql = "SELECT *, date(created_at, 'unixepoch', 'localtime') as created_at FROM profiles WHERE 1";
  const sqlParams = {};
  const plain_plate = params.plate?.trim().length > 0 ? params.plate.replace(/[^a-zA-Z0-9 ]/g, '') : null;
  if (plain_plate) {
    sql += " AND plain_plate = $plain_plate";
    sqlParams.plain_plate = plain_plate;
  }
  if (params.created_by_id >= 1) {
    sql += " AND created_by_id = $created_by_id";
    sqlParams.created_by_id = params.created_by_id;
  }
  if (sort.id) sql += " ORDER BY id " + sort.id;
  if (params.pageSize >= 0) {
    sql += " LIMIT $limit";
    sqlParams.limit = params.pageSize;
  }
  if (params.current >= 0) {
    sql += " OFFSET $offset";
    sqlParams.offset = (params.current-1)*params.pageSize;
  }
  return window.electron.DB.all(sql, sqlParams);
}

export async function createProfile(data) {
  data.plain_plate = data.plate?.replace(/[^a-zA-Z0-9 ]/g, '');
  const officer = await getOfficer(data.created_by_id);
  data.created_by = officer.name;
  return window.electron.DB.run(
    "INSERT INTO profiles(plate,plain_plate,content,created_by_id,created_by,created_at) \
    VALUES ($plate,$plain_plate,$content,$created_by_id,$created_by,unixepoch($created_at, 'localtime'))", data);
}

export function getProfile(id) {
  return window.electron.DB.get("SELECT *, date(created_at, 'unixepoch', 'localtime') as created_at FROM profiles WHERE id=$id", {id});
}

export function getProfileByPlate(plate) {
  const plain_plate = plate?.replace(/[^a-zA-Z0-9 ]/g, '');
  return window.electron.DB.get("SELECT *, date(created_at, 'unixepoch', 'localtime') as created_at FROM profiles WHERE plain_plate=$plain_plate", {plain_plate});
}

export function updateProfile(id, data) {

}

export function deleteProfile(id) {

}
