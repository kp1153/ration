const fs = require('fs');

const waText = encodeURIComponent("नमस्ते जी, आपका उधार बाकी है। कृपया जल्द चुका दें। - राशन दुकान");

fs.writeFileSync('app/(dashboard)/grahak/[id]/page.js', `import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function GrahakDetailPage({ params }) {
  const { id } = await params;

  const grahakRes = await db.execute({ sql: "SELECT * FROM grahak WHERE id=?", args: [id] });
  if (!grahakRes.rows.length) notFound();
  const g = grahakRes.rows[0];

  const udharRes = await db.execute({ sql: "SELECT * FROM udhar WHERE grahak_id=? ORDER BY tarik DESC", args: [id] });
  const bikriRes = await db.execute({ sql: "SELECT b.*, GROUP_CONCAT(s.naam || ' x' || bi.matra) as items FROM bikri b LEFT JOIN bikri_item bi ON b.id=bi.bikri_id LEFT JOIN stock s ON bi.stock_id=s.id WHERE b.grahak_id=? GROUP BY b.id ORDER BY b.id DESC LIMIT 20", args: [id] });

  async function vasooli(formData) {
    "use server";
    const udhar_id = formData.get("udhar_id");
    const rakam = formData.get("rakam");
    if (rakam) {
      await db.execute({ sql: "INSERT INTO udhar (grahak_id, raqam, tarik, vasooli) VALUES (?,?,date('now'),1)", args: [id, -parseFloat(rakam)] });
    } else {
      await db.execute({ sql: "UPDATE udhar SET vasooli=1 WHERE id=?", args: [udhar_id] });
    }
  }

  const kul_udhar = udharRes.rows.filter(u => !u.vasooli).reduce((s, u) => s + u.raqam, 0);
  const waLink = "https://wa.me/91" + g.mobile + "?text=" + encodeURIComponent("नमस्ते " + g.naam + " जी, आपका Rs." + kul_udhar + " उधार बाकी है। कृपया जल्द चुका दें। - राशन दुकान");

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-1">{g.naam}</h1>
        <p className="text-gray-500 text-sm">{g.mobile || "मोबाइल नहीं"} | {g.pata || "पता नहीं"}</p>
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (g.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
            {g.prakar === "thok" ? "थोक" : "फुटकर"}
          </span>
          <span className="text-red-600 font-bold">बाकी उधार: Rs.{kul_udhar}</span>
        </div>
        {kul_udhar > 0 && g.mobile && (
          <a href={waLink} target="_blank" className="mt-3 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full">
            WhatsApp याद दिलाएं
          </a>
        )}
      </div>

      {kul_udhar > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">वसूली करें</h2>
          <form action={vasooli} className="flex gap-3">
            <input name="rakam" type="number" placeholder="रकम डालें" required className="border rounded-lg p-3 flex-1" />
            <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold">वसूल करें</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow">
        <h2 className="text-base font-semibold p-4 border-b">उधार इतिहास</h2>
        <div className="flex flex-col divide-y">
          {udharRes.rows.length === 0 && <div className="text-center text-gray-400 py-6">कोई उधार नहीं</div>}
          {udharRes.rows.map(u => (
            <div key={u.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold">Rs.{u.raqam}</div>
                <div className="text-sm text-gray-500">{u.tarik}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (u.vasooli ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  {u.vasooli ? "वसूल" : "बाकी"}
                </span>
                {!u.vasooli && (
                  <form action={vasooli}>
                    <input type="hidden" name="udhar_id" value={u.id} />
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">वसूल</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <h2 className="text-base font-semibold p-4 border-b">बिक्री इतिहास</h2>
        <div className="flex flex-col divide-y">
          {bikriRes.rows.length === 0 && <div className="text-center text-gray-400 py-6">कोई बिक्री नहीं</div>}
          {bikriRes.rows.map(b => (
            <div key={b.id} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="text-sm text-gray-500">{b.tarik}</div>
                <div className="font-bold text-green-700">Rs.{b.kul_raqam}</div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{b.items}</div>
              <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (b.bhugtan === "nakad" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                {b.bhugtan === "nakad" ? "नकद" : "उधार"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`, 'utf8');

console.log("हो गया");