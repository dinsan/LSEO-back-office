"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Download,
  Upload,
  Settings,
  LogOut,
  Bell,
  GitBranch,
  Zap,
  Grid3x3,
  Package,
  Tag,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const mainLinks = [
  { href: "/", label: "Overview", icon: Grid3x3, badge: null },
  { href: "/products", label: "Products", icon: Package, badge: 12 },
  { href: "/categories", label: "Categories", icon: Tag, badge: null },
  { href: "/campaigns", label: "Campaigns", icon: Lightbulb, badge: 3 },
];

const toolsLinks = [
  { href: "/reports", label: "View Reports", icon: BarChart3, badge: null },
  { href: "/export", label: "Export Data", icon: Download, badge: null },
  { href: "/import", label: "Import Files", icon: Upload, badge: null },
];

const settingsLinks = [
  { href: "/settings/workflow", label: "Workflow", icon: Zap, badge: null },
  { href: "/settings/repository", label: "Repository", icon: GitBranch, badge: null },
  { href: "/settings", label: "Settings", icon: Settings, badge: null },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | null;
  isActive: boolean;
}

function NavItem({ href, label, icon: Icon, badge, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
        isActive
          ? "bg-brand text-white shadow-md"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== null && badge !== undefined && (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({
  title,
  links,
  pathname,
}: {
  title: string;
  links: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | null }>;
  pathname: string;
}) {
  return (
    <div>
      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-white/50">
        {title}
      </h3>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon, badge }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              badge={badge}
              isActive={isActive}
            />
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={clsx(
        "bg-ink text-white transition-all duration-300 md:min-h-screen md:w-64 md:shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">LSEO</h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-1 hover:bg-white/10 md:hidden"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-6">
            {/* Main Navigation */}
            <NavSection title="Main" links={mainLinks} pathname={pathname} />

            {/* Tools Section */}
            <NavSection title="Tools" links={toolsLinks} pathname={pathname} />

            {/* Settings Section */}
            <NavSection title="Settings & Admin" links={settingsLinks} pathname={pathname} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* User Section */}
        <div className="space-y-3 border-b border-white/10 px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center text-sm font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">John Doe</p>
              <p className="truncate text-xs text-white/50">john@example.com</p>
            </div>
            <Bell className="h-4 w-4 text-white/50 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 px-3 py-4">
          <Link
            href="/settings/account"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white w-full justify-start">
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
