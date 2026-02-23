import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { grahak_id, prakar, bhugtan, items } = await request.json();
  const tarik = new Date().toISOString().split("T")[0];

  let kul = 0;
  const billItems = [];

  for (const item of items) {
    const s = await db.execute({ sql: "SELECT * FROM stock WHERE id=?", args: [item.stock_id] });
    const stock = s.rows[0];
    const mulya = prakar === "thok" ? stock.thok_mulya : stock.footkar_mulya;
    const matra = parseFloat(item.matra);
    const total = mulya * matra;
    kul += total;
    billItems.push({ naam: stock.naam, ikal: stock.ikal, matra, mulya, total });
  }

  const bikri = await db.execute({
    sql: "INSERT INTO bikri (grahak_id, tarik, prakar, kul_raqam, bhugtan) VALUES (?,?,?,?,?)",
    args: [grahak_id, tarik, prakar, kul, bhugtan],
  });
  const bikri_id = bikri.lastInsertRowid;

  for (const item of items) {
    const s = await db.execute({ sql: "SELECT * FROM stock WHERE id=?", args: [item.stock_id] });
    const stock = s.rows[0];
    const mulya = prakar === "thok" ? stock.thok_mulya : stock.footkar_mulya;
    const matra = parseFloat(item.matra);
    await db.execute({
      sql: "INSERT INTO bikri_item (bikri_id, stock_id, matra, mulya) VALUES (?,?,?,?)",
      args: [bikri_id, item.stock_id, matra, mulya],
    });
    await db.execute({
      sql: "UPDATE stock SET matra = matra - ? WHERE id=?",
      args: [matra, item.stock_id],
    });
  }

  if (bhugtan === "udhar") {
    await db.execute({
      sql: "INSERT INTO udhar (grahak_id, bikri_id, raqam, tarik) VALUES (?,?,?,?)",
      args: [grahak_id, bikri_id, kul, tarik],
    });
  }

  return NextResponse.json({ ok: true, bill: { kul, tarik, items: billItems } });
}