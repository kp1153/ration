"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BikriClient({ grahakList, stockList, recentBikri }) {
  const router = useRouter();
  const [items, setItems] = useState([{ stock_id: "", matra: "" }]);
  const [grahak_id, setGrahakId] = useState("");
  const [prakar, setPrakar] = useState("footkar");
  const [bhugtan, setBhugtan] = useState("nakad");
  const [bill, setBill] = useState(null);

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

  async function handleSale(e) {
    e.preventDefault();
    const res = await fetch("/api/bikri", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grahak_id, prakar, bhugtan, items }),
    });
    const data = await res.json();
    if (data.ok && data.bill) {
      setBill(data.bill);
    }
  }

  function printBill() {
    if (!bill || !bill.items) return;
    const w = window.open("", "_blank");
    const g = grahakList.find((g) => g.id == grahak_id);
    const rows = bill.items
      .map(
        (item) =>
          `<tr><td>${item.naam}</td><td>${item.matra} ${item.ikal}</td><td>₹${item.mulya}</td><td>₹${item.total}</td></tr>`
      )
      .join("");
    w.document.write(`
      <html><head><title>रसीद</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .total { font-size: 1.2em; font-weight: bold; margin-top: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
      </style>
      </head><body>
      <h2>🏪 राशन दुकान</h2>
      <p><b>ग्राहक:</b> ${g?.naam}</p>
      <p><b>तारीख:</b> ${bill.tarik}</p>
      <p><b>प्रकार:</b> ${prakar === "thok" ? "थोक" : "फुटकर"}</p>
      <table>
        <thead><tr><th>आइटम</th><th>मात्रा</th><th>भाव</th><th>रकम</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="total">कुल: ₹${bill.kul}</p>
      <p><b>भुगतान:</b> ${bhugtan === "nakad" ? "नकद" : "उधार"}</p>
      <p class="footer">धन्यवाद!</p>
      </body></html>
    `);
    w.document.close();
    w.print();
    setBill(null);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">बिक्री</h1>
      {bill ? (
        <div className="bg-white p-6 rounded-xl shadow max-w-lg">
          <h2 className="text-xl font-bold mb-4 text-green-700">✅ बिक्री हो गई — कुल ₹{bill.kul}</h2>
          <div className="flex gap-3">
            <button onClick={printBill} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              🖨️ रसीद प्रिंट करें
            </button>
            <button onClick={() => { setBill(null); router.refresh(); }} className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">
              नई बिक्री
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSale} className="bg-white p-4 rounded-xl shadow mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <select value={grahak_id} onChange={(e) => setGrahakId(e.target.value)} required className="border rounded p-2 flex-1 min-w-36">
              <option value="">ग्राहक चुनें*</option>
              {grahakList.map((g) => <option key={g.id} value={g.id}>{g.naam}</option>)}
            </select>
            <select value={prakar} onChange={(e) => setPrakar(e.target.value)} className="border rounded p-2">
              <option value="footkar">फुटकर</option>
              <option value="thok">थोक</option>
            </select>
            <select value={bhugtan} onChange={(e) => setBhugtan(e.target.value)} className="border rounded p-2">
              <option value="nakad">नकद</option>
              <option value="udhar">उधार</option>
            </select>
          </div>

          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={item.stock_id} onChange={(e) => updateItem(i, "stock_id", e.target.value)} required className="border rounded p-2 flex-1">
                <option value="">आइटम चुनें*</option>
                {stockList.map((s) => <option key={s.id} value={s.id}>{s.naam} ({s.matra} {s.ikal})</option>)}
              </select>
              <input type="number" step="0.1" placeholder="मात्रा*" value={item.matra} onChange={(e) => updateItem(i, "matra", e.target.value)} required className="border rounded p-2 w-24" />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 font-bold text-xl">✕</button>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <button type="button" onClick={addItem} className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">+ आइटम जोड़ें</button>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">बेचें</button>
          </div>
        </form>
      )}

      <h2 className="text-lg font-semibold mb-2">हाल की बिक्री</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>{["ग्राहक", "तारीख", "प्रकार", "कुल रकम", "भुगतान"].map((h) => <th key={h} className="p-3 text-left text-sm font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {recentBikri.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.naam}</td>
                <td className="p-3">{b.tarik}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${b.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{b.prakar === "thok" ? "थोक" : "फुटकर"}</span></td>
                <td className="p-3 font-bold">₹{b.kul_raqam}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${b.bhugtan === "nakad" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.bhugtan === "nakad" ? "नकद" : "उधार"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}