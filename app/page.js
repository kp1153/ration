"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const pass = e.target.password.value;
    if (pass === "Maqbool2@") {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ password: pass }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) router.push("/dashboard");
      else setError(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">🏪 राशन दुकान</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="पासवर्ड डालें"
              className="w-full border rounded-lg p-3 text-lg pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-gray-500 text-xl"
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">पासवर्ड गलत है</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            लॉगिन करें
          </button>
        </form>
      </div>
    </div>
  );
}