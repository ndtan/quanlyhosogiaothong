import Database from 'better-sqlite3';
import {app} from "electron";
import path from 'path';
import {readFileSync, existsSync, mkdirSync} from "node:fs";

function createDatabase(dbFolder, dbFile) {
  console.log("Creating folder " + dbFolder);
  if (!existsSync(dbFolder)) mkdirSync(dbFolder,{ recursive: true });
  const dbPath = path.join(dbFolder, dbFile);
  console.log("Creating database at " + dbPath);
  const db = new Database(dbPath, { verbose: console.log, fileMustExist: false });
  db.pragma('journal_mode = WAL');
  migrateDatabase(db);
  console.log("Database created");
  return db;
}

function migrateDatabase(db) {
  console.log("Migrating database");
  const tables = db.prepare("SELECT * FROM main.sqlite_master WHERE type = $type").all({type: 'table'});
  const migrationsPath = app.isPackaged ? path.join(__dirname, '..', '..', '..', 'migrations')
    : path.join(__dirname, '..', '..', 'migrations');
  if (tables.length === 0) {
    const database = readFileSync(path.join(migrationsPath, 'database.sql'), 'utf8');
    console.log('Migrating database', database);
    db.exec(database);
    const places = readFileSync(path.join(migrationsPath, 'places.sql'), 'utf8');
    console.log('Migrating places', places);
    db.exec(places);
  } else {
    const profiles_rename_action_return = readFileSync(path.join(migrationsPath, 'profiles_rename_action_return.sql'), 'utf8');
    console.log('Renaming last action return to Da bo sung', profiles_rename_action_return);
    db.exec(profiles_rename_action_return);
  }
  console.log("Database migrated");
  return db;
}

let db;

function connectDB() {
  if (db) return db;
  const dbFolder = app.isPackaged ? path.join(process.env.APPDATA, 'QuanLyHoSoGiaoThong', 'database') : path.join(__dirname, '..', '..');
  const dbFile = 'QuanLyHoSoGiaoThong.sqlite3';
  const dbPath = path.join(dbFolder, dbFile);
  console.log("Connecting to database at " + dbPath);
  try {
    db = new Database(dbPath, { verbose: console.log, fileMustExist: true });
    db.pragma('journal_mode = WAL');
    migrateDatabase(db);
    console.log("Database connected");
  } catch (e) {
    db = createDatabase(dbFolder, dbFile);
  }
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


