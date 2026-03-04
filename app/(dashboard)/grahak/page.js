import { db } from "@/lib/db";
import GrahakClient from "./GrahakClient";

export default async function GrahakPage() {
  async function addGrahak(formData) {
    "use server";
    await db.execute({
      sql: "INSERT INTO grahak (naam, mobile, pata, prakar) VALUES (?,?,?,?)",
      args: [formData.get("naam"), formData.get("mobile"), formData.get("pata"), formData.get("prakar")],
    });
  }

  const { rows } = await db.execute("SELECT * FROM grahak ORDER BY naam");

  return <GrahakClient grahakList={rows} addGrahak={addGrahak} />;
}