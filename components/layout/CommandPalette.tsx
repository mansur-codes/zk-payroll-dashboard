"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Keyboard, Users, History, FileText, 
  Settings, Landmark, Lock, Play, ShieldAlert, Sparkles 
} from "lucide-react";
import { toast } from "sonner";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Navigation" | "Actions" | "System";
  icon: React.ComponentType<any>;
  action?: () => void;
  route?: string;
  adminOnly?: boolean;
}

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"Admin" | "Employee">("Admin");
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const commands = useMemo<CommandItem[]>(() => [
    {
      id: "nav-dash",
      title: "Go to Dashboard Home",
      description: "Overview of stats, company metrics, and mock proof generator.",
      category: "Navigation",
      icon: Landmark,
      route: "/",
    },
    {
      id: "nav-employees",
      title: "Go to Employee Directory",
      description: "Manage staff, view departments, and adjust salary configurations.",
      category: "Navigation",
      icon: Users,
      route: "/employees",
    },
    {
      id: "nav-history",
      title: "Go to Transaction History",
      description: "Audit records, CSV exports, and printable cryptographic reports.",
      category: "Navigation",
      icon: History,
      route: "/history",
    },
    {
      id: "nav-compliance",
      title: "Go to Compliance View",
      description: "Review ZK privacy status and proof audit logs.",
      category: "Navigation",
      icon: ShieldAlert,
      route: "/compliance",
    },
    {
      id: "nav-treasury",
      title: "Go to Treasury View",
      description: "Inspect on-chain balances and setup multisig parameters.",
      category: "Navigation",
      icon: Settings,
      route: "/treasury",
    },
    {
      id: "action-payroll",
      title: "Create New Payroll Run",
      description: "Generate proofs, approve, and execute on-chain batch payments.",
      category: "Actions",
      icon: Play,
      route: "/payroll/execute",
      adminOnly: true,
    },
    {
      id: "action-print",
      title: "Print Cryptographic Audit Report",
      description: "Generate print-optimized, redacted payroll ledger summary.",
      category: "Actions",
      icon: FileText,
      action: () => {
        onClose();
        setTimeout(() => window.print(), 100);
      },
      adminOnly: true,
    },
    {
      id: "action-proof",
      title: "Trigger Mock ZK Proof Generation",
      description: "Run offline prover to build commitment & validity flags.",
      category: "Actions",
      icon: Sparkles,
      action: () => {
        onClose();
        toast.info("Generating proof context...", {
          description: "Initiated zero-knowledge calculation from command palette.",
        });
      },
    },
  ], [onClose]);

  // Filter commands
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    );
  }, [search, commands]);

  const handleItemSelect = (item: CommandItem) => {
    if (item.adminOnly && role !== "Admin") {
      toast.error("Access Denied", {
        description: "This administrative action requires the Admin role.",
      });
      return;
    }

    if (item.route) {
      router.push(item.route);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="palette-heading"
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[70vh]">
        <div className="px-4 py-3 border-b flex items-center gap-3 bg-gray-50">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions... (e.g. print, payroll)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-400 text-sm py-1.5 focus:ring-0"
          />
          <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-white px-2 py-1 rounded border shadow-sm shrink-0">
            <Keyboard className="w-3 h-3" />
            <span>ESC</span>
          </div>
        </div>

        {/* Role configuration inside the command palette to easily demonstrate role constraints */}
        <div className="px-4 py-2 border-b bg-indigo-50/50 flex items-center justify-between text-xs text-indigo-900">
          <span className="font-medium">Role-Based Access Limit Demo:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Current Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-white border border-indigo-200 text-indigo-900 rounded px-2 py-0.5 font-semibold text-xs outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Employee">Employee (Restricted)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No actions or navigation found matching "{search}"
            </div>
          ) : (
            <div>
              <h4 id="palette-heading" className="sr-only">Command actions list</h4>
              <div className="divide-y divide-gray-50">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  const isLocked = item.adminOnly && role !== "Admin";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemSelect(item)}
                      className={`w-full text-left px-3 py-3 rounded-lg flex items-start gap-3.5 transition-colors focus:outline-none focus:bg-gray-50 ${
                        isLocked ? "opacity-50 cursor-not-allowed hover:bg-red-50/30" : "hover:bg-indigo-50/40"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isLocked ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600"}`}>
                        {isLocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                          <span className="text-[10px] text-gray-400 font-medium px-1.5 py-0.5 rounded-full bg-gray-100">
                            {item.category}
                          </span>
                          {item.adminOnly && (
                            <span className="text-[10px] text-red-600 font-bold px-1.5 py-0.5 rounded-full bg-red-50 border border-red-100 flex items-center gap-0.5">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
