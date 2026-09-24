"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
];

export function NavBar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="mx-auto flex max-w-6xl gap-4 px-3 py-4 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={cn(
            "px-3 py-2 rounded-md hover:bg-slate-100",
            isActive(link.href) && "bg-slate-100 text-blue-600"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
