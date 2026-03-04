"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const IKAL = ["kg", "litre", "piece", "packet", "dozen"];
const IKAL_LABEL = { kg: "किलो", litre: "लीटर", piece: "नग", packet: "पैकेट", dozen: "दर्जन" };

export default function StockClient({ stockList }) {
  const router = useRouter();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ naam: "", matra: "", ikal: "kg", thok_mulya: "", footkar_mulya: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  function startEdit(s) {
    setEdit(s.id);
    setForm({ naam: s.naam, matra: s.matra, ikal: s.ikal, thok_mulya: s.thok_mulya || "", footkar_mulya: s.footkar_mulya || "" });
  }

  async function saveEdit(id) {
    setLoading(true);
    await fetch("/api/stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    setEdit(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteItem(id, naam) {
    if (!confirm(naam + " हटाएं?")) return;
    await fetch("/api/stock", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const filtered = stockList.filter(s =>
    s.naam.toLowerCase().includes(search.toLowerCase())
  );

  const kamStock = stockList.filter(s => s.matra < 5);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">स्टॉक</h1>
      {kamStock.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 mb-4">
          <div className="font-semibold text-red-700 mb-2">कम स्टॉक:</div>
          <div className="flex flex-wrap gap-2">
            {kamStock.map(s => (
              <span key={s.id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                {s.naam} - {s.matra} {IKAL_LABEL[s.ikal] || s.ikal}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white p-3 rounded-xl shadow mb-4">
        <input placeholder="आइटम खोजें" value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg p-3 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map(s => (
          <div key={s.id} className={"bg-white rounded-xl shadow p-4 " + (s.matra < 5 ? "border-l-4 border-red-400" : "")}>
            {edit === s.id ? (
              <div className="flex flex-col gap-2">
                <input value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} className="border rounded-lg p-2 w-full" placeholder="आइटम नाम" />
                <div className="flex gap-2">
                  <input type="number" step="0.1" value={form.matra} onChange={e => setForm({ ...form, matra: e.target.value })} className="border rounded-lg p-2 flex-1" placeholder="मात्रा" />
                  <select value={form.ikal} onChange={e => setForm({ ...form, ikal: e.target.value })} className="border rounded-lg p-2 flex-1">
                    {IKAL.map(i => <option key={i} value={i}>{IKAL_LABEL[i] || i}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input type="number" value={form.thok_mulya} onChange={e => setForm({ ...form, thok_mulya: e.target.value })} className="border rounded-lg p-2 flex-1" placeholder="थोक भाव" />
                  <input type="number" value={form.footkar_mulya} onChange={e => setForm({ ...form, footkar_mulya: e.target.value })} className="border rounded-lg p-2 flex-1" placeholder="फुटकर भाव" />
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => saveEdit(s.id)} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1">सेव</button>
                  <button onClick={() => setEdit(null)} className="bg-gray-200 px-4 py-2 rounded-lg flex-1">रद्द</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-base">{s.naam}</div>
                    <div className={"text-lg font-bold mt-1 " + (s.matra < 5 ? "text-red-600" : "text-green-700")}>
                      {s.matra} {IKAL_LABEL[s.ikal] || s.ikal}
                    </div>
                  </div>
                  {s.matra < 5 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">कम</span>}
                </div>
                <div className="flex gap-3 text-sm text-gray-600 mb-3">
                  <span>थोक: <b>Rs.{s.thok_mulya || "-"}</b></span>
                  <span>फुटकर: <b>Rs.{s.footkar_mulya || "-"}</b></span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm flex-1">बदलें</button>
                  <button onClick={() => deleteItem(s.id, s.naam)} className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm flex-1">हटाएं</button>
                </div>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-10">कोई आइटम नहीं मिला</div>
        )}
      </div>
    </div>
  );
}
