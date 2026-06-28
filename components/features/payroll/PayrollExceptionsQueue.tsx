"use client";

import { useMemo } from "react";
import { AlertCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { MOCK_TRANSACTIONS, MOCK_EMPLOYEES } from "@/lib/api/mockData";
import type { PayrollTransaction } from "@/types";

type ExceptionItem = {
  tx: PayrollTransaction;
  employeeNames: string[];
  reasonCode: string;
  nextStep: string;
};

const REASON_CODES: Record<PayrollTransaction["status"], string> = {
  pending: "Awaiting ZK proof generation",
  failed: "Transaction submission failed",
  verified: "",
};

const NEXT_STEPS: Record<PayrollTransaction["status"], string> = {
  pending: "Trigger proof generation or check wallet connectivity",
  failed: "Review transaction hash and retry via payroll wizard",
  verified: "",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  failed: XCircle,
};

const STATUS_CLASSES: Record<string, string> = {
  pending: "text-yellow-600",
  failed: "text-red-600",
};

export default function PayrollExceptionsQueue() {
  const exceptions = useMemo<ExceptionItem[]>(() => {
    return MOCK_TRANSACTIONS.filter(
      (tx) => tx.status === "pending" || tx.status === "failed",
    ).map((tx) => ({
      tx,
      employeeNames: MOCK_EMPLOYEES.slice(0, tx.employeeCount).map((e) => e.name),
      reasonCode: REASON_CODES[tx.status],
      nextStep: NEXT_STEPS[tx.status],
    }));
  }, []);

  if (exceptions.length === 0) {
    return (
      <section
        aria-labelledby="exceptions-heading"
        className="rounded-lg bg-white p-6 shadow-sm"
      >
        <h2 id="exceptions-heading" className="text-base font-semibold text-gray-900">
          Payroll exceptions
        </h2>
        <p className="mt-3 text-sm text-gray-500">No exceptions — all payroll items are clear.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="exceptions-heading" className="rounded-lg bg-white p-6 shadow-sm">
      <h2 id="exceptions-heading" className="mb-4 text-base font-semibold text-gray-900">
        Payroll exceptions{" "}
        <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          {exceptions.length}
        </span>
      </h2>

      <ul className="space-y-3" aria-label="exceptions queue">
        {exceptions.map(({ tx, employeeNames, reasonCode, nextStep }) => {
          const Icon = STATUS_ICONS[tx.status] ?? AlertCircle;
          const colorClass = STATUS_CLASSES[tx.status] ?? "text-gray-600";

          return (
            <li
              key={tx.id}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colorClass}`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Payroll run {tx.id}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                        tx.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    ${tx.totalAmount.toLocaleString()} · {tx.employeeCount} employee(s) ·{" "}
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                  {employeeNames.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {employeeNames.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-7 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                <span className="font-medium">Reason: </span>
                {reasonCode}
              </div>

              <div className="ml-7 flex items-center gap-1 text-xs text-indigo-600">
                <ArrowRight className="h-3 w-3" aria-hidden />
                <span>{nextStep}</span>
              </div>

              <div className="ml-7">
                <a
                  href="/payroll"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Go to payroll wizard →
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
