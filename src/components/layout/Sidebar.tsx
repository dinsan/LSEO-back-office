"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/campaigns", label: "Campaigns" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-ink text-white md:min-h-screen md:w-56 md:shrink-0">
      <div className="px-5 py-5 text-lg font-semibold tracking-tight">Shelfwise</div>
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {links.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "rounded px-3 py-2 text-sm transition-colors",
                active ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
