"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GrahakClient({ grahakList, addGrahak }) {
  const router = useRouter();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ naam: "", mobile: "", pata: "", prakar: "footkar" });
  const [search, setSearch] = useState("");

  function startEdit(g) {
    setEdit(g.id);
    setForm({ naam: g.naam, mobile: g.mobile || "", pata: g.pata || "", prakar: g.prakar });
  }

  async function saveEdit(id) {
    await fetch("/api/grahak", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    setEdit(null);
    router.refresh();
  }

  async function deleteGrahak(id, naam) {
    if (!confirm(naam + " को हटाएं?")) return;
    await fetch("/api/grahak", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const filtered = grahakList.filter(g =>
    g.naam.toLowerCase().includes(search.toLowerCase()) ||
    (g.mobile && g.mobile.includes(search))
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">ग्राहक</h1>
      <form action={addGrahak} className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col gap-3">
        <input name="naam" placeholder="नाम*" required className="border rounded-lg p-3 w-full" />
        <input name="mobile" placeholder="मोबाइल" className="border rounded-lg p-3 w-full" />
        <input name="pata" placeholder="पता" className="border rounded-lg p-3 w-full" />
        <div className="flex gap-3">
          <select name="prakar" className="border rounded-lg p-3 flex-1">
            <option value="footkar">फुटकर</option>
            <option value="thok">थोक</option>
          </select>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">जोड़ें</button>
        </div>
      </form>
      <div className="bg-white p-3 rounded-xl shadow mb-4">
        <input placeholder="नाम या मोबाइल से खोजें" value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg p-3 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map(g => (
          <div key={g.id} className="bg-white rounded-xl shadow p-4">
            {edit === g.id ? (
              <div className="flex flex-col gap-2">
                <input value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} className="border rounded-lg p-2 w-full" placeholder="नाम" />
                <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="border rounded-lg p-2 w-full" placeholder="मोबाइल" />
                <input value={form.pata} onChange={e => setForm({ ...form, pata: e.target.value })} className="border rounded-lg p-2 w-full" placeholder="पता" />
                <select value={form.prakar} onChange={e => setForm({ ...form, prakar: e.target.value })} className="border rounded-lg p-2 w-full">
                  <option value="footkar">फुटकर</option>
                  <option value="thok">थोक</option>
                </select>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => saveEdit(g.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1">सेव</button>
                  <button onClick={() => setEdit(null)} className="bg-gray-200 px-4 py-2 rounded-lg flex-1">रद्द</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link href={"/grahak/" + g.id} className="text-blue-600 font-bold text-base hover:underline">{g.naam}</Link>
                    <div className="text-sm text-gray-500 mt-0.5">{g.mobile || "-"}</div>
                    {g.pata && <div className="text-sm text-gray-400">{g.pata}</div>}
                  </div>
                  <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (g.prakar === "thok" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                    {g.prakar === "thok" ? "थोक" : "फुटकर"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit(g)} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm flex-1">बदलें</button>
                  <button onClick={() => deleteGrahak(g.id, g.naam)} className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm flex-1">हटाएं</button>
                  <Link href={"/grahak/" + g.id} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm flex-1 text-center">उधार</Link>
                </div>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-10">कोई ग्राहक नहीं मिला</div>
        )}
      </div>
    </div>
  );
}
