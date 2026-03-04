import { db, initDB } from "@/lib/db";
import StockClient from "./StockClient";

export default async function StockPage() {
  await initDB();

  async function addItem(formData) {
    "use server";
    await db.execute({
      sql: "INSERT INTO stock (naam, matra, ikal, thok_mulya, footkar_mulya) VALUES (?,?,?,?,?)",
      args: [
        formData.get("naam"),
        formData.get("matra"),
        formData.get("ikal"),
        formData.get("thok_mulya") || null,
        formData.get("footkar_mulya") || null,
      ],
    });
  }

  const { rows } = await db.execute("SELECT * FROM stock ORDER BY naam");

  return (
    <div className="space-y-4">
      <form action={addItem} className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
        <input name="naam" placeholder="आइटम नाम*" required className="border rounded p-2 flex-1 min-w-28" />
        <input name="matra" type="number" step="0.1" placeholder="मात्रा*" required className="border rounded p-2 w-24" />
        <select name="ikal" className="border rounded p-2">
          <option value="kg">किलो</option>
          <option value="litre">लीटर</option>
          <option value="piece">नग</option>
          <option value="packet">पैकेट</option>
          <option value="dozen">दर्जन</option>
        </select>
        <input name="thok_mulya" type="number" placeholder="थोक भाव" className="border rounded p-2 w-28" />
        <input name="footkar_mulya" type="number" placeholder="फुटकर भाव" className="border rounded p-2 w-28" />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ जोड़ें</button>
      </form>
      <StockClient stockList={rows} />
    </div>
  );
}