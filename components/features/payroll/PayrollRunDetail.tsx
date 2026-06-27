"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { MOCK_EMPLOYEES, MOCK_PAYROLL_RUNS } from "@/lib/api/mockData";
import type { PayrollRun } from "@/types/models";
import {
  classifyRun,
  formatPayrollDate,
  getRunDate,
  RUN_KIND_STYLES,
  type RunScheduleKind,
} from "@/lib/payroll/scheduleUtils";

interface PayrollRunDetailProps {
  run: PayrollRun;
}

function StatusIcon({ kind }: { kind: RunScheduleKind }) {
  if (kind === "completed") {
    return <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />;
  }
  if (kind === "failed") {
    return <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />;
  }
  return <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />;
}

function PayrollRunDetail({ run }: PayrollRunDetailProps) {
  const kind = classifyRun(run);
  const styles = RUN_KIND_STYLES[kind];
  const runDate = getRunDate(run);
  const employees = MOCK_EMPLOYEES.filter((e) => run.employeeIds.includes(e.id));
  const txHash = run.transactionHash ?? run.txHash;

  return (
    <section aria-labelledby="payroll-run-detail-heading" className="space-y-6">
      <div>
        <Link
          href="/payroll/schedule"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to schedule
        </Link>
      </div>

      <header className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${styles.badge}`}
            >
              <StatusIcon kind={kind} />
            </div>
            <div>
              <h1
                id="payroll-run-detail-heading"
                className="text-xl font-semibold text-gray-900"
              >
                Payroll run · {formatPayrollDate(runDate)}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Run ID: {run.id}</p>
              <span
                className={`inline-flex mt-2 px-2 py-1 text-xs font-medium rounded-full border ${styles.badge}`}
              >
                {styles.label}
              </span>
            </div>
          </div>
          {kind === "scheduled" && (
            <Link
              href="/payroll/execute"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
            >
              Process payroll
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <article className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-600">Total amount</h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${run.totalAmount.toLocaleString()}
          </p>
        </article>
        <article className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-600">Employees</h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">{run.employeeCount}</p>
        </article>
      </div>

      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Run details</h2>
        </div>
        <dl className="divide-y divide-gray-100">
          <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
            <dt className="text-sm text-gray-500">Scheduled date</dt>
            <dd className="text-sm font-medium text-gray-900">{formatPayrollDate(runDate)}</dd>
          </div>
          <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
            <dt className="text-sm text-gray-500">Status</dt>
            <dd className="text-sm font-medium text-gray-900 capitalize">{run.status}</dd>
          </div>
          {run.executedAt && (
            <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
              <dt className="text-sm text-gray-500">Executed at</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatPayrollDate(new Date(run.executedAt))}
              </dd>
            </div>
          )}
          <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
            <dt className="text-sm text-gray-500">Transaction hash</dt>
            <dd className="text-sm font-medium text-gray-900 font-mono break-all">
              {txHash ?? "—"}
            </dd>
          </div>
          <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
            <dt className="text-sm text-gray-500">ZK proof</dt>
            <dd className="text-sm font-medium text-gray-900 font-mono break-all">
              {run.proof || "Pending generation"}
            </dd>
          </div>
        </dl>
      </article>

      {employees.length > 0 && (
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Included employees</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                <span className="text-sm text-gray-600">
                  ${employee.salary.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </article>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/history"
          className="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View transaction history
        </Link>
      </div>
    </section>
  );
}

export function findPayrollRun(id: string, runs = MOCK_PAYROLL_RUNS): PayrollRun | undefined {
  return runs.find((run) => run.id === id);
}

export default PayrollRunDetail;
