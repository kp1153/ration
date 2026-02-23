import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) redirect("/");

  async function logout() {
    "use server";
    const c = await cookies();
    c.delete("session");
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-52 bg-green-800 text-white flex flex-col p-4 gap-2">
        <h2 className="text-xl font-bold mb-4 text-center">🏪 राशन</h2>
        {[
          { href: "/dashboard", label: "📊 डैशबोर्ड" },
          { href: "/grahak", label: "👤 ग्राहक" },
          { href: "/stock", label: "📦 स्टॉक" },
          { href: "/bikri", label: "🛒 बिक्री" },
          { href: "/report", label: "📈 रिपोर्ट" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="py-2 px-3 rounded hover:bg-green-600 transition"
          >
            {item.label}
          </Link>
        ))}
        <form action={logout} className="mt-auto">
          <button className="w-full py-2 px-3 bg-red-600 rounded hover:bg-red-700">
            🚪 लॉगआउट
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}