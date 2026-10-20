import * as SQLite from 'expo-sqlite';
let db = null;

export const initDb = async() => {
  try {
     if(db) return db;
      db = await SQLite.openDatabaseAsync("AI_MENTOR");
      return db;
  } catch (error) {
     console.log("error on init db ",error)
  }
}