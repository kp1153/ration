const fs = require('fs');

fs.writeFileSync('app/(dashboard)/report/page.js', `import { db, initDB } from "@/lib/db";

export default async function ReportPage({ searchParams }) {
  await initDB();
  const params = await searchParams;
  const from = params.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
  const to = params.to || new Date().toISOString().split("T")[0];

  const [thok, footkar, udhar, top, mahina, kamStock, dateFilter] = await Promise.all([
    db.execute("SELECT SUM(kul_raqam) as total FROM bikri WHERE prakar='thok'"),
    db.execute("SELECT SUM(kul_raqam) as total FROM bikri WHERE prakar='footkar'"),
    db.execute("SELECT SUM(raqam) as total FROM udhar WHERE vasooli=0"),
    db.execute("SELECT g.naam, SUM(u.raqam) as udhar FROM udhar u JOIN grahak g ON u.grahak_id=g.id WHERE u.vasooli=0 GROUP BY g.id ORDER BY udhar DESC LIMIT 5"),
    db.execute("SELECT strftime('%Y-%m', tarik) as mahina, SUM(kul_raqam) as total, COUNT(*) as count FROM bikri GROUP BY mahina ORDER BY mahina DESC LIMIT 12"),
    db.execute("SELECT * FROM stock WHERE matra < 5 ORDER BY matra ASC"),
    db.execute({ sql: "SELECT b.*, g.naam FROM bikri b LEFT JOIN grahak g ON b.grahak_id=g.id WHERE b.tarik BETWEEN ? AND ? ORDER BY b.tarik DESC", args: [from, to] }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">रिपोर्ट</h1>

      {kamStock.rows.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <h2 className="font-bold text-red-700 mb-2">कम स्टॉक</h2>
          <div className="flex flex-wrap gap-2">
            {kamStock.rows.map(s => (
              <span key={s.id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                {s.naam} - {s.matra} {s.ikal} बचा
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <div className="bg-purple-100 text-purple-700 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold">Rs.{thok.rows[0].total || 0}</div>
          <div className="text-sm mt-1">कुल थोक बिक्री</div>
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold">Rs.{footkar.rows[0].total || 0}</div>
          <div className="text-sm mt-1">कुल फुटकर बिक्री</div>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow">
          <div className="text-2xl font-bold">Rs.{udhar.rows[0].total || 0}</div>
          <div className="text-sm mt-1">कुल उधार बाकी</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">तारीख के हिसाब से बिक्री</h2>
        <form className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium w-8">से:</label>
            <input type="date" name="from" defaultValue={from} className="border rounded-lg p-2 flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium w-8">तक:</label>
            <input type="date" name="to" defaultValue={to} className="border rounded-lg p-2 flex-1" />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">देखें</button>
        </form>
        <div className="flex flex-col gap-3">
          {dateFilter.rows.length === 0 ? (
            <div className="text-center text-gray-400 py-6">इस अवधि में कोई बिक्री नहीं</div>
          ) : (
            dateFilter.rows.map(b => (
              <div key={b.id} className="border rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold">{b.naam}</div>
                  <div className="font-bold text-green-700">Rs.{b.kul_raqam}</div>
                </div>
                <div className="text-sm text-gray-500 mb-2">{b.tarik}</div>
                <div className="flex gap-2">
                  <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (b.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                    {b.prakar === "thok" ? "थोक" : "फुटकर"}
                  </span>
                  <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (b.bhugtan === "nakad" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                    {b.bhugtan === "nakad" ? "नकद" : "उधार"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="font-semibold p-4 border-b">महीनेवार बिक्री</h2>
        <div className="flex flex-col divide-y">
          {mahina.rows.map(m => (
            <div key={m.mahina} className="flex items-center justify-between p-4">
              <div className="font-medium">{m.mahina}</div>
              <div className="text-right">
                <div className="font-bold text-green-600">Rs.{m.total}</div>
                <div className="text-xs text-gray-500">{m.count} बार</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {top.rows.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h2 className="font-semibold p-4 border-b">सबसे ज्यादा उधार वाले ग्राहक</h2>
          <div className="flex flex-col divide-y">
            {top.rows.map(r => (
              <div key={r.naam} className="flex items-center justify-between p-4">
                <div className="font-medium">{r.naam}</div>
                <div className="font-bold text-red-600">Rs.{r.udhar}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`, 'utf8');

console.log("हो गया");