"use client";

import Link from "next/link";
import { useState } from "react";
import { BriefcaseBusiness, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/new-application", label: "New Application", icon: BriefcaseBusiness },
];

function NavigationLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {navigationItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 lg:block">
        <Link href="/" className="mb-10 flex items-center gap-2 px-3 text-lg font-semibold tracking-tight text-slate-950">
          <span className="flex size-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          FitMatch AI
        </Link>
        <NavigationLinks onNavigate={() => undefined} />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-950">
          <span className="flex size-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          FitMatch AI
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        >
          {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </header>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"
          />
          <aside id="mobile-navigation" className="fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white p-4 shadow-lg lg:hidden">
            <NavigationLinks onNavigate={() => setIsOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
