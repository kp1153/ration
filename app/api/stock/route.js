import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { id, naam, matra, ikal, thok_mulya, footkar_mulya } = await request.json();
  await db.execute({
    sql: "UPDATE stock SET naam=?, matra=?, ikal=?, thok_mulya=?, footkar_mulya=? WHERE id=?",
    args: [naam, matra, ikal, thok_mulya, footkar_mulya, id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await db.execute({ sql: "DELETE FROM stock WHERE id=?", args: [id] });
  return NextResponse.json({ ok: true });
}