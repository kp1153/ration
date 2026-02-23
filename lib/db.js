import { createClient } from "@libsql/client/http";

export const db = createClient({
  url: "https://ration-kamtatiwari.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE4Mjc4NjYsImlkIjoiMjk3NTdmNTMtYWQ0MC00NTljLWFlMzUtY2U2NDNmMGM1NjA3IiwicmlkIjoiYmM5OGE2NzctODQyOC00Y2Q2LTlkZDMtMzY3YzVkZmI4OWQxIn0.WWyUGtfkK-hoJYcWohSu0OTm-o90VRomR38KXUASyQtiJqOZOvHY2pEYF9bfmXaLkP3OxOIeOBsKrfe5ha3gBA",
});

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS grahak (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      naam TEXT NOT NULL,
      mobile TEXT,
      pata TEXT,
      prakar TEXT DEFAULT 'footkar'
    );
    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      naam TEXT NOT NULL,
      matra REAL NOT NULL DEFAULT 0,
      ikal TEXT NOT NULL,
      thok_mulya REAL,
      footkar_mulya REAL
    );
    CREATE TABLE IF NOT EXISTS bikri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grahak_id INTEGER REFERENCES grahak(id),
      tarik TEXT NOT NULL,
      prakar TEXT NOT NULL,
      kul_raqam REAL NOT NULL,
      bhugtan TEXT DEFAULT 'udhar'
    );
    CREATE TABLE IF NOT EXISTS bikri_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bikri_id INTEGER REFERENCES bikri(id),
      stock_id INTEGER REFERENCES stock(id),
      matra REAL NOT NULL,
      mulya REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS udhar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grahak_id INTEGER REFERENCES grahak(id),
      bikri_id INTEGER,
      raqam REAL NOT NULL,
      tarik TEXT NOT NULL,
      vasooli INTEGER DEFAULT 0
    );
  `);
}