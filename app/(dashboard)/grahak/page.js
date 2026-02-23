import { db } from "@/lib/db";
import Link from "next/link";

export default async function GrahakPage() {
  async function addGrahak(formData) {
    "use server";
    const naam = formData.get("naam");
    const mobile = formData.get("mobile");
    const pata = formData.get("pata");
    const prakar = formData.get("prakar");
    await db.execute({
      sql: "INSERT INTO grahak (naam, mobile, pata, prakar) VALUES (?,?,?,?)",
      args: [naam, mobile, pata, prakar],
    });
  }

  const { rows } = await db.execute("SELECT * FROM grahak ORDER BY id DESC");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ग्राहक</h1>
      <form action={addGrahak} className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">
        <input name="naam" placeholder="नाम*" required className="border rounded p-2 flex-1 min-w-32" />
        <input name="mobile" placeholder="मोबाइल" className="border rounded p-2 flex-1 min-w-32" />
        <input name="pata" placeholder="पता" className="border rounded p-2 flex-1 min-w-32" />
        <select name="prakar" className="border rounded p-2">
          <option value="footkar">फुटकर</option>
          <option value="thok">थोक</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + जोड़ें
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              {["नाम", "मोबाइल", "पता", "प्रकार", "उधार"].map((h) => (
                <th key={h} className="p-3 text-left text-sm font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/grahak/${g.id}`} className="text-blue-600 hover:underline font-medium">
                    {g.naam}
                  </Link>
                </td>
                <td className="p-3">{g.mobile || "—"}</td>
                <td className="p-3">{g.pata || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${g.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {g.prakar === "thok" ? "थोक" : "फुटकर"}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/grahak/${g.id}`} className="text-red-500 text-sm">देखें →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}