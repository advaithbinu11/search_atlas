"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Clock, Compass, GitBranch, LayoutDashboard, ListTree, Menu, PanelLeftClose, PanelLeftOpen, Search, Upload, X,
} from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/queries", label: "Queries", icon: Search },
  { href: "/rewording", label: "Rewording", icon: GitBranch },
  { href: "/rhythm", label: "Rhythm", icon: Clock },
  { href: "/destinations", label: "Destinations", icon: Compass },
  { href: "/sessions", label: "Sessions", icon: ListTree },
  { href: "/import", label: "Import", icon: Upload },
];

export function Shell({ children, dataThrough, searches }: { children: React.ReactNode; dataThrough: string | null; searches: number }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const nav = (compact: boolean) => (
    <nav aria-label="Primary" className="flex-1 space-y-1 px-3 py-4">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={compact ? label : undefined}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={`relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
              active ? "bg-raised text-fg" : "text-muted hover:bg-raised hover:text-fg"
            } ${compact ? "justify-center px-0" : ""}`}
          >
            {active && <span aria-hidden className="absolute left-0 top-2 h-6 w-0.5 rounded bg-accent" />}
            <Icon size={20} aria-hidden className={active ? "text-accent" : ""} />
            <span className={compact ? "sr-only" : ""}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const footer = (compact: boolean) =>
    compact ? null : (
      <div className="border-t border-line px-5 py-4 text-xs text-muted">
        <p>{dataThrough ? `Data through ${dataThrough}` : "No data loaded"}</p>
        <p className="tabular mt-0.5">{searches} searches</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-page-glow bg-no-repeat">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>

      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-bg/80 backdrop-blur md:flex ${
          collapsed ? "w-sidebar-collapsed" : "w-sidebar"
        }`}
      >
        <div className={`flex h-16 items-center ${collapsed ? "justify-center" : "justify-between px-5"}`}>
          {!collapsed && <span className="gradient-text text-lg font-bold">Search Atlas</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid h-9 w-9 place-items-center rounded-md text-muted hover:bg-raised hover:text-fg"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        {nav(collapsed)}
        {footer(collapsed)}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button aria-label="Close menu" className="absolute inset-0 bg-bg/70" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-sidebar flex-col border-r border-line bg-surface">
            <div className="flex h-16 items-center justify-between px-5">
              <span className="gradient-text text-lg font-bold">Search Atlas</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-md text-muted hover:bg-raised">
                <X size={18} />
              </button>
            </div>
            {nav(false)}
            {footer(false)}
          </aside>
        </div>
      )}

      <div className={collapsed ? "md:pl-[var(--sidebar-collapsed)]" : "md:pl-[var(--sidebar-expanded)]"}>
        <header className="flex h-16 items-center gap-3 px-4 md:hidden">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-md border border-line text-muted">
            <Menu size={20} />
          </button>
          <span className="gradient-text text-lg font-bold">Search Atlas</span>
        </header>
        <main id="main" className="mx-auto w-full max-w-content px-4 pb-16 pt-4 md:px-6 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
