"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Stethoscope, Search, Users, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/surgeons", label: "Surgeons", icon: Stethoscope },
  { href: "/match", label: "Match", icon: Search },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/surgeon-profiles", label: "Profiles", icon: ClipboardCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-burgundy flex flex-col">
      <div className="p-6 pb-4">
        <Image
          src="/images/pirk-logo.png"
          alt="Pirk"
          width={80}
          height={30}
          className="brightness-0 invert opacity-90"
        />
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-[10px] text-white/30 uppercase tracking-widest">
        Pirk v1.0
      </div>
    </aside>
  );
}
