"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Settings,
  History,
  Shield,
  Play,
  Building2,
  Landmark,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/payroll/execute", icon: Play, label: "Execute Payroll" },
  { href: "/history", icon: History, label: "History" },
  { href: "/treasury", icon: Landmark, label: "Treasury" },
  { href: "/compliance", icon: Shield, label: "Compliance" },
  { href: "/setup", icon: Building2, label: "Company Setup" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <nav aria-label="Main navigation">
      {NAV_LINKS.map(({ href, icon: Icon, label }) => (
        <a
          key={href}
          href={href}
          onClick={onClick}
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        >
          <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button – visible only below md */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Mobile drawer + overlay – only mounted when open */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-xl font-bold text-gray-800">ZK Payroll</h1>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">ZK Payroll</h1>
        </div>
        <NavLinks />
      </div>
    </>
  );
}

export default Sidebar;
