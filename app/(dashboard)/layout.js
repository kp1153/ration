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

  const navItems = [
    { href: "/dashboard", label: "डैशबोर्ड", icon: "📊" },
    { href: "/grahak",    label: "ग्राहक",    icon: "👤" },
    { href: "/stock",     label: "स्टॉक",     icon: "📦" },
    { href: "/bikri",     label: "बिक्री",    icon: "🛒" },
    { href: "/report",    label: "रिपोर्ट",   icon: "📈" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* मोबाइल टॉप बार */}
      <header className="md:hidden flex items-center justify-between bg-green-800 text-white px-4 py-3 sticky top-0 z-50">
        <span className="text-lg font-bold">🪙 राशन</span>
        <form action={logout}>
          <button className="text-sm bg-red-600 px-3 py-1 rounded">🚪 बाहर</button>
        </form>
      </header>

      <div className="flex flex-1">
        {/* डेस्कटॉप साइडबार */}
        <aside className="hidden md:flex w-52 bg-green-800 text-white flex-col p-4 gap-2 min-h-screen sticky top-0">
          <h2 className="text-xl font-bold mb-4 text-center">🪙 राशन</h2>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 px-3 rounded hover:bg-green-600 transition"
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <form action={logout} className="mt-auto">
            <button className="w-full py-2 px-3 bg-red-600 rounded hover:bg-red-700">
              🚪 लॉगआउट
            </button>
          </form>
        </aside>

        {/* मुख्य कंटेंट */}
        <main className="flex-1 p-4 pb-24 md:pb-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* मोबाइल बॉटम नेव */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center py-2 text-gray-600 hover:text-green-700 text-xs gap-1"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}