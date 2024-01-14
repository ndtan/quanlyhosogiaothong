import {getProfile} from "./profiles";
import {getOfficer} from "./officers";
import {getPlace} from "./places";

export function getManipulations(params) {

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

export function updateManipulation(id, data) {

}

export function deleteManipulation(id) {

}
