"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

export default function Navbar() {
  const path = usePathname();

  const links = [
    { href: "/characters", label: "Search" },
    { href: "/custom",     label: "My Characters" },
    { href: "/chat",       label: "AI Chat" },
  ];

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Home */}
        <Link href="/characters" className="text-2xl font-bold">
          Rick & Morty AI
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={path === link.href ? "default" : "ghost"}
                size="sm"
                className="px-3"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
        {/* Logout */}
        <div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}