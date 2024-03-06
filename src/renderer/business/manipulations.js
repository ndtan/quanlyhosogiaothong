import {getProfile} from "./profiles";
import {getOfficer} from "./officers";
import {getPlace} from "./places";

export function getManipulations(params) {
  return window.electron.DB.all("SELECT *, datetime(manipulated_at, 'unixepoch', 'localtime') as manipulated_at, datetime(return_at, 'unixepoch', 'localtime') as return_at FROM manipulations WHERE return_by_id is null ORDER BY id desc", params);
}

export function getManipulationsReturn(params) {
  return window.electron.DB.all("SELECT *, datetime(manipulated_at, 'unixepoch', 'localtime') as manipulated_at, datetime(return_at, 'unixepoch', 'localtime') as return_at FROM manipulations WHERE return_by_id is not null ORDER BY return_at desc LIMIT 100");
}

export function getManipulationsByProfileId(profile_id) {
  return window.electron.DB.all("SELECT *, datetime(manipulated_at, 'unixepoch', 'localtime') as manipulated_at, datetime(return_at, 'unixepoch', 'localtime') as return_at FROM manipulations WHERE profile_id = $profile_id ORDER BY id", {profile_id});
}

export async function createManipulation(profile_id, data) {
  const profile = await getProfile(profile_id);
  if (!profile) throw "Không tìm thấy cán bộ khai thác hồ sơ";
  if (profile.last_action && profile.last_action !== 'return') throw "Hồ sơ đang được khai thác bởi một cán bộ khác";
  data.profile_id = profile_id;
  data.plate = profile.plate;
  data.plain_plate = profile.plain_plate;
  if (!data.manipulated_by_id) throw "Vui lòng chọn cán bộ khai thác hồ sơ";
  const officer_manipulated = await getOfficer(data.manipulated_by_id);
  if (!officer_manipulated) throw "Không tìm thấy cán bộ khai thác hồ sơ";
  data.manipulated_by = officer_manipulated.name;
  if (data.place_id) {
    const place = await getPlace(data.place_id);
    data.place = place.name;
  }
  const keys = Object.keys(data);
  const sql = `INSERT INTO manipulations(${keys.join(',')}) VALUES (${keys.map(k=>'$'+k).join(',')})`;
  const info = await window.electron.DB.run(sql, data);
  // update trang thai ho so
  const infoUpdate = await window.electron.DB.run("UPDATE profiles SET last_action = $last_action WHERE id=$id",
    {id: profile_id, last_action: data.action});
  return info;
}

export function getManipulation(id) {

}

export function getManipulationByProfileIdForReturn(profile_id) {
  return window.electron.DB.get("SELECT *, datetime(manipulated_at, 'unixepoch', 'localtime') as manipulated_at, datetime(return_at, 'unixepoch', 'localtime') as return_at FROM manipulations WHERE profile_id=$profile_id AND return_by_id is null", {profile_id});
}

export function updateManipulation(id, data) {

}

export function deleteManipulation(id) {

}

export async function returnProfile(profile_id, return_by_id, return_at) {
  const manipulation = await getManipulationByProfileIdForReturn(profile_id);
  if (!manipulation) throw "Hồ sơ chưa được đề nghị khai thác hoặc đã được bổ sung";
  const officer = await getOfficer(return_by_id);
  if (!officer) throw "Không tìm thấy cán bộ bổ sung";
  const info = await window.electron.DB.run("UPDATE manipulations SET return_by_id=$return_by_id,return_by=$return_by,return_at=unixepoch($return_at, 'utc') WHERE id=$id",
    {id: manipulation.id, return_by_id, return_by: officer.name, return_at});
  const infoUpdate = await window.electron.DB.run("UPDATE profiles SET last_action = $last_action WHERE id=$id",
    {id: profile_id, last_action: 'return'});
  return info;
}
