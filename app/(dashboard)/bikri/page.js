import { db, initDB } from "@/lib/db";
import BikriClient from "./BikriClient";

export default async function BikriPage() {
  await initDB();
  const [grahakRes, stockRes, recentRes] = await Promise.all([
    db.execute("SELECT * FROM grahak ORDER BY naam"),
    db.execute("SELECT * FROM stock ORDER BY naam"),
    db.execute("SELECT b.*, g.naam FROM bikri b LEFT JOIN grahak g ON b.grahak_id=g.id ORDER BY b.id DESC LIMIT 20"),
  ]);

  return (
    <BikriClient
      grahakList={grahakRes.rows}
      stockList={stockRes.rows}
      recentBikri={recentRes.rows}
    />
  );
}