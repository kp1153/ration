import { db, initDB } from "@/lib/db";

export default async function DashboardPage() {
  await initDB();

  const [grahak, udhar, stock, bikri] = await Promise.all([
    db.execute("SELECT COUNT(*) as count FROM grahak"),
    db.execute("SELECT SUM(raqam) as total FROM udhar WHERE vasooli=0"),
    db.execute("SELECT COUNT(*) as count FROM stock"),
    db.execute("SELECT SUM(kul_raqam) as aaj FROM bikri WHERE tarik=date('now')"),
  ]);

  const cards = [
    { label: "कुल ग्राहक",    value: grahak.rows[0].count,              color: "bg-blue-100 text-blue-700" },
    { label: "कुल उधार बाकी", value: `₹${udhar.rows[0].total || 0}`,   color: "bg-red-100 text-red-700" },
    { label: "स्टॉक आइटम",   value: stock.rows[0].count,               color: "bg-yellow-100 text-yellow-700" },
    { label: "आज की बिक्री",  value: `₹${bikri.rows[0].aaj || 0}`,     color: "bg-green-100 text-green-700" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">📊 डैशबोर्ड</h1>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`p-4 rounded-xl ${c.color} shadow`}>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}