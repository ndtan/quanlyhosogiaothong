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
  const migrationsPath = app.isPackaged ? path.join(__dirname, '..', '..', '..', 'migrations') : path.join(__dirname, 'migrations');
  const database = readFileSync(path.join(migrationsPath, 'database.sql'), 'utf8');
  console.log('Migrate database', database);
  db.exec(database);
  const places = readFileSync(path.join(migrationsPath, 'places.sql'), 'utf8');
  console.log('Migrate places', places);
  db.exec(places);
  console.log("Database created");
  return db;
}

function connectDB() {
  const dbFolder = app.isPackaged ? path.join(process.env.APPDATA, 'QuanLyHoSoGiaoThong', 'database') : path.join(__dirname, '..', '..');
  const dbFile = 'QuanLyHoSoGiaoThong.sqlite3';
  const dbPath = path.join(dbFolder, dbFile);
  console.log("Connecting to database at " + dbPath);
  let db;
  try {
    db = new Database(dbPath, { verbose: console.log, fileMustExist: true });
    db.pragma('journal_mode = WAL');
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


