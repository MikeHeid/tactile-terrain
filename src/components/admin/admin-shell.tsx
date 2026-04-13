"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Images,
  Home,
  Mail,
  Users,
  FileText,
  Cpu,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/gallery", icon: Images, label: "Gallery" },
  { href: "/admin/homepage", icon: Home, label: "Homepage" },
  { href: "/admin/technology", icon: Cpu, label: "Technology" },
  { href: "/admin/inquiries", icon: Mail, label: "Inquiries" },
  { href: "/admin/team", icon: Users, label: "Team" },
  { href: "/admin/content", icon: FileText, label: "Site Content" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-surface/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <Link href="/" className="text-sm text-accent hover:text-accent-hover transition-colors">
            ← Back to site
          </Link>
          <h2 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] mt-2">
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent border-r-2 border-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
