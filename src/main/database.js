import Database from 'better-sqlite3';
import {app} from "electron";
import path from "path";

function connectDB() {
  const dbPath = app.isPackaged
    ? path.join(__dirname, 'quanlyhosogiaothong.sqlite3')
    : path.join(__dirname, '../../quanlyhosogiaothong.sqlite3');
  console.log("Connecting to database at " + dbPath);
  const db = new Database(dbPath, { verbose: console.log, fileMustExist: false });
  db.pragma('journal_mode = WAL');
  console.log("Database connected");
  return db;
}

export function DBAll(sql, params = {}) {
  const db = connectDB();
  return db.prepare(sql).all(params);
}

export function DBGet(sql, params = {}) {
  const db = connectDB();
  return db.prepare(sql).get(params);
}

export function DBRun(sql, params) {
  const db = connectDB();
  return db.prepare(sql).run(params);
}


