import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function GrahakDetailPage({ params }) {
  const { id } = await params;

  const grahakRes = await db.execute({ sql: "SELECT * FROM grahak WHERE id=?", args: [id] });
  if (!grahakRes.rows.length) notFound();
  const g = grahakRes.rows[0];

  const udharRes = await db.execute({
    sql: "SELECT * FROM udhar WHERE grahak_id=? ORDER BY tarik DESC",
    args: [id],
  });

  async function vasooli(formData) {
    "use server";
    const udhar_id = formData.get("udhar_id");
    await db.execute({ sql: "UPDATE udhar SET vasooli=1 WHERE id=?", args: [udhar_id] });
  }

  const kul_udhar = udharRes.rows.filter((u) => !u.vasooli).reduce((s, u) => s + u.raqam, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{g.naam}</h1>
      <p className="text-gray-500 mb-1">{g.mobile} | {g.pata}</p>
      <p className="mb-4">
        <span className={`px-2 py-1 rounded text-sm ${g.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
          {g.prakar === "thok" ? "थोक" : "फुटकर"}
        </span>
        <span className="ml-3 text-red-600 font-semibold">बाकी उधार: ₹{kul_udhar}</span>
      </p>

      {kul_udhar > 0 && g.mobile && (
        <a
          href={`https://wa.me/${g.mobile}?text=${encodeURIComponent(`नमस्ते ${g.naam} भाई साहब, आपका ₹${kul_udhar} उधार बाकी है। कृपया जल्द चुका दें। — राशन दुकान`)}`}
          target="_blank"
          className="inline-block mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          📱 WhatsApp पर याद दिलाएं
        </a>
      )}

      <h2 className="text-lg font-semibold mb-2">उधार इतिहास</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-50">
            <tr>{["तारीख", "रकम", "स्थिति", "वसूली"].map((h) => <th key={h} className="p-3 text-left text-sm font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {udharRes.rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.tarik}</td>
                <td className="p-3 font-semibold">₹{u.raqam}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${u.vasooli ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.vasooli ? "वसूल" : "बाकी"}
                  </span>
                </td>
                <td className="p-3">
                  {!u.vasooli && (
                    <form action={vasooli}>
                      <input type="hidden" name="udhar_id" value={u.id} />
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">वसूल करें</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}