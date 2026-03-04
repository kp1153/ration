"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";

export default function BikriClient({ grahakList, stockList, recentBikri }) {
  const router = useRouter();
  const billRef = useRef(null);
  const [items, setItems] = useState([{ stock_id: "", matra: "" }]);
  const [grahak_id, setGrahakId] = useState("");
  const [prakar, setPrakar] = useState("footkar");
  const [bhugtan, setBhugtan] = useState("nakad");
  const [bill, setBill] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [search, setSearch] = useState("");

  function addItem() {
    setItems([...items, { stock_id: "", matra: "" }]);
  }

  function removeItem(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function updateItem(i, key, val) {
    const updated = [...items];
    updated[i][key] = val;
    setItems(updated);
  }

  const filteredStock = stockList.filter(s =>
    s.naam.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSale(e) {
    e.preventDefault();
    const res = await fetch("/api/bikri", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grahak_id, prakar, bhugtan, items }),
    });
    const data = await res.json();
    if (data.ok && data.bill) setBill(data.bill);
  }

  async function printBill() {
    if (!billRef.current) return;
    setPrinting(true);
    await new Promise(r => setTimeout(r, 100));
    const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png");
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>रसीद</title>
      <style>
        body { margin: 0; padding: 0; }
        img { max-width: 80mm; display: block; margin: 0 auto; }
        @media print { body { margin: 0; } }
      </style>
      </head><body>
      <img src="${img}" />
      <script>window.onload = function(){ window.print(); window.close(); }<\/script>
      </body></html>
    `);
    w.document.close();
    setPrinting(false);
    setBill(null);
    router.refresh();
  }

  const grahak = grahakList.find(g => g.id == grahak_id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🛒 बिक्री</h1>

      {bill ? (
        <div>
          {/* रसीद */}
          <div ref={billRef} style={{ width: "280px", padding: "12px", fontFamily: "Arial", fontSize: "13px", background: "#fff" }}>
            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>🪙 राशन दुकान</div>
            <div style={{ textAlign: "center", fontSize: "11px", color: "#555", marginBottom: "8px" }}>————————————————</div>
            <div><b>ग्राहक:</b> {grahak?.naam}</div>
            <div><b>तारीख:</b> {bill.tarik}</div>
            <div><b>प्रकार:</b> {prakar === "thok" ? "थोक" : "फुटकर"}</div>
            <div><b>भुगतान:</b> {bhugtan === "nakad" ? "नकद" : "उधार"}</div>
            <div style={{ margin: "8px 0", borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc", padding: "6px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ccc" }}>
                    <th style={{ textAlign: "left", paddingBottom: "4px" }}>आइटम</th>
                    <th style={{ textAlign: "right" }}>मात्रा</th>
                    <th style={{ textAlign: "right" }}>भाव</th>
                    <th style={{ textAlign: "right" }}>रकम</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ paddingTop: "3px" }}>{item.naam}</td>
                      <td style={{ textAlign: "right" }}>{item.matra}{item.ikal}</td>
                      <td style={{ textAlign: "right" }}>₹{item.mulya}</td>
                      <td style={{ textAlign: "right" }}>₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontWeight: "bold", fontSize: "15px", textAlign: "right", marginTop: "6px" }}>कुल: ₹{bill.kul}</div>
            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "11px", color: "#888" }}>धन्यवाद! फिर आइए 🙏</div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={printBill} disabled={printing} className="bg-blue-600 text-white px-6 py-3 rounded-lg flex-1 font-semibold">
              {printing ? "तैयार हो रहा है..." : "🖨️ रसीद प्रिंट करें"}
            </button>
            <button onClick={() => { setBill(null); router.refresh(); }} className="bg-gray-200 px-6 py-3 rounded-lg flex-1">
              नई बिक्री
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSale} className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-4">

          {/* ग्राहक और प्रकार */}
          <select value={grahak_id} onChange={e => setGrahakId(e.target.value)} required className="border rounded-lg p-3 w-full">
            <option value="">ग्राहक चुनें*</option>
            {grahakList.map(g => (
              <option key={g.id} value={g.id}>{g.naam} {g.mobile ? `(${g.mobile})` : ""}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <select value={prakar} onChange={e => setPrakar(e.target.value)} className="border rounded-lg p-3 flex-1">
              <option value="footkar">फुटकर</option>
              <option value="thok">थोक</option>
            </select>
            <select value={bhugtan} onChange={e => setBhugtan(e.target.value)} className="border rounded-lg p-3 flex-1">
              <option value="nakad">नकद</option>
              <option value="udhar">उधार</option>
            </select>
          </div>

          {/* आइटम खोज */}
          <input
            placeholder="🔍 आइटम खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg p-3 w-full"
          />

          {/* आइटम लिस्ट */}
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                value={item.stock_id}
                onChange={e => updateItem(i, "stock_id", e.target.value)}
                required
                className="border rounded-lg p-3 flex-1"
              >
                <option value="">आइटम चुनें*</option>
                {(search ? filteredStock : stockList).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.naam} ({s.matra} {s.ikal}) — ₹{prakar === "thok" ? s.thok_mulya : s.footkar_mulya}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.1"
                placeholder="मात्रा*"
                value={item.matra}
                onChange={e => updateItem(i, "matra", e.target.value)}
                required
                className="border rounded-lg p-3 w-24"
              />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 font-bold text-2xl px-1">✕</button>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <button type="button" onClick={addItem} className="bg-gray-100 px-4 py-3 rounded-lg flex-1">+ आइटम जोड़ें</button>
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg flex-1 font-semibold">बेचें</button>
          </div>
        </form>
      )}

      {/* हाल की बिक्री */}
      <h2 className="text-lg font-semibold mb-3">हाल की बिक्री</h2>
      <div className="flex flex-col gap-3">
        {recentBikri.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start justify-between mb-1">
              <div className="font-bold">{b.naam}</div>
              <div className="font-bold text-green-700">₹{b.kul_raqam}</div>
            </div>
            <div className="text-sm text-gray-500 mb-2">{b.tarik}</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {b.prakar === "thok" ? "थोक" : "फुटकर"}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.bhugtan === "nakad" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {b.bhugtan === "nakad" ? "नकद" : "उधार"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}