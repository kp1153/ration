import { db, initDB } from "@/lib/db";

export default async function ReportPage() {
  await initDB();
  const [thok, footkar, udhar, top, mahina, kamStock] = await Promise.all([
    db.execute("SELECT SUM(kul_raqam) as total FROM bikri WHERE prakar='thok'"),
    db.execute("SELECT SUM(kul_raqam) as total FROM bikri WHERE prakar='footkar'"),
    db.execute("SELECT SUM(raqam) as total FROM udhar WHERE vasooli=0"),
    db.execute("SELECT g.naam, SUM(u.raqam) as udhar FROM udhar u JOIN grahak g ON u.grahak_id=g.id WHERE u.vasooli=0 GROUP BY g.id ORDER BY udhar DESC LIMIT 5"),
    db.execute("SELECT strftime('%Y-%m', tarik) as mahina, SUM(kul_raqam) as total, COUNT(*) as count FROM bikri GROUP BY mahina ORDER BY mahina DESC LIMIT 12"),
    db.execute("SELECT * FROM stock WHERE matra < 5 ORDER BY matra ASC"),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">रिपोर्ट</h1>

      {kamStock.rows.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <h2 className="text-lg font-bold text-red-700 mb-3">⚠️ स्टॉक कम है</h2>
          <div className="flex flex-wrap gap-2">
            {kamStock.rows.map((s) => (
              <span key={s.id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                {s.naam} — {s.matra} {s.ikal} बचा
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "कुल थोक बिक्री", value: `₹${thok.rows[0].total || 0}`, color: "bg-purple-100 text-purple-700" },
          { label: "कुल फुटकर बिक्री", value: `₹${footkar.rows[0].total || 0}`, color: "bg-blue-100 text-blue-700" },
          { label: "कुल उधार बाकी", value: `₹${udhar.rows[0].total || 0}`, color: "bg-red-100 text-red-700" },
        ].map((c) => (
          <div key={c.label} className={`p-5 rounded-xl ${c.color} shadow`}>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">महीनेवार बिक्री</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">महीना</th>
                <th className="p-3 text-left">कुल बिक्री</th>
                <th className="p-3 text-left">लेनदेन</th>
              </tr>
            </thead>
            <tbody>
              {mahina.rows.map((m) => (
                <tr key={m.mahina} className="border-t">
                  <td className="p-3 font-medium">{m.mahina}</td>
                  <td className="p-3 font-bold text-green-600">₹{m.total}</td>
                  <td className="p-3">{m.count} बार</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">सबसे ज्यादा उधार वाले ग्राहक</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="p-3 text-left">ग्राहक</th>
                <th className="p-3 text-left">बाकी उधार</th>
              </tr>
            </thead>
            <tbody>
              {top.rows.map((r) => (
                <tr key={r.naam} className="border-t">
                  <td className="p-3 font-medium">{r.naam}</td>
                  <td className="p-3 font-bold text-red-600">₹{r.udhar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}