import { db } from "@/lib/db";

export default async function StockPage() {
  async function addItem(formData) {
    "use server";
    await db.execute({
      sql: "INSERT INTO stock (naam, matra, ikal, thok_mulya, footkar_mulya) VALUES (?,?,?,?,?)",
      args: [
        formData.get("naam"),
        formData.get("matra"),
        formData.get("ikal"),
        formData.get("thok_mulya"),
        formData.get("footkar_mulya"),
      ],
    });
  }

  const { rows } = await db.execute("SELECT * FROM stock ORDER BY naam");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">स्टॉक</h1>
      <form action={addItem} className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">
        <input name="naam" placeholder="आइटम नाम*" required className="border rounded p-2 flex-1 min-w-28" />
        <input name="matra" type="number" placeholder="मात्रा*" required className="border rounded p-2 w-24" />
        <select name="ikal" className="border rounded p-2">
          <option value="kg">किलो</option>
          <option value="litre">लीटर</option>
          <option value="piece">नग</option>
        </select>
        <input name="thok_mulya" type="number" placeholder="थोक भाव" className="border rounded p-2 w-28" />
        <input name="footkar_mulya" type="number" placeholder="फुटकर भाव" className="border rounded p-2 w-28" />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ जोड़ें</button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-yellow-50">
            <tr>
              {["आइटम", "मात्रा", "इकाई", "थोक भाव", "फुटकर भाव"].map((h) => (
                <th key={h} className="p-3 text-left text-sm font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className={`border-t ${s.matra < 5 ? "bg-red-50" : ""}`}>
                <td className="p-3 font-medium">{s.naam}</td>
                <td className="p-3 font-bold">{s.matra}</td>
                <td className="p-3">{s.ikal}</td>
                <td className="p-3">₹{s.thok_mulya || "—"}</td>
                <td className="p-3">₹{s.footkar_mulya || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}