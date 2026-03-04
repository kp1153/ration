import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { id, naam, mobile, pata, prakar } = await request.json();
  await db.execute({
    sql: "UPDATE grahak SET naam=?, mobile=?, pata=?, prakar=? WHERE id=?",
    args: [naam, mobile, pata, prakar, id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await db.execute({ sql: "DELETE FROM grahak WHERE id=?", args: [id] });
  return NextResponse.json({ ok: true });
}