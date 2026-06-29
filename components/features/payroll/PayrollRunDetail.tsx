"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Shield,
  FileCode,
  LinkIcon,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { MOCK_PAYROLL_RUNS, MOCK_EMPLOYEES } from "@/lib/api/mockData";
import type { PayrollRun } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  verified: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  verified: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

function PayrollRunDetail() {
  const router = useRouter();
  const params = useParams();
  const runId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const run = useMemo(() => {
    return MOCK_PAYROLL_RUNS.find((r) => r.id === runId) ?? null;
  }, [runId]);

  const employeesInRun = useMemo(() => {
    if (!run) return [];
    return MOCK_EMPLOYEES.filter((e) => run.employeeIds.includes(e.id));
  }, [run]);

  if (isLoading) {
    return (
      <section aria-label="Loading payroll run details" className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!run) {
    return (
      <section aria-labelledby="run-not-found-heading" className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 id="run-not-found-heading" className="text-lg font-semibold text-gray-900 mb-1">
            Payroll Run Not Found
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The payroll run with ID &ldquo;{runId}&rdquo; could not be found.
          </p>
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Transaction History
          </button>
        </div>
      </section>
    );
  }

  const StatusIcon = STATUS_ICONS[run.status] ?? Clock;

  return (
    <section aria-labelledby="payroll-run-detail-heading" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            History
          </button>
          <span className="text-gray-300" aria-hidden="true">/</span>
          <h2
            id="payroll-run-detail-heading"
            className="text-lg font-semibold text-gray-900"
          >
            Payroll Run {run.id}
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[run.status]}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
        </span>
      </div>

      {/* Run metadata */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h3 className="text-sm font-semibold text-gray-900">Run Metadata</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Timestamp</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(run.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Employees</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {run.employeeCount} employees
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Total Amount</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${run.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FileCode className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">ZK Proof</span>
            </div>
            <p className="text-sm font-mono text-gray-900 truncate" title={run.proof}>
              {run.proof
                ? `${run.proof.slice(0, 12)}...${run.proof.slice(-8)}`
                : "—"}
            </p>
          </div>
        </div>

        {run.transactionHash && (
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Transaction:</span>
            <span className="font-mono text-xs text-gray-900 truncate">
              {run.transactionHash}
            </span>
          </div>
        )}

        {run.executedAt && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              Executed at {new Date(run.executedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Privacy notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-indigo-800">Privacy Preserved</h3>
          <p className="text-sm text-indigo-700 mt-1">
            Individual salary amounts are never displayed. This view shows
            only participation status per employee. Zero-knowledge proofs
            verify correctness without revealing sensitive data.
          </p>
        </div>
      </div>

      {/* Employee-level results */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            Employee Results
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Participation status for each employee in this payroll run.
            Individual salary amounts are protected by ZK proofs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">
              Employee participation results for payroll run {run.id}
            </caption>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                  Salary
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                  Commitment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employeesInRun.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                    {emp.email && (
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {emp.department ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    {run.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Included
                      </span>
                    ) : run.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <EyeOff className="w-3 h-3" />
                      Private
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500">
                      {emp.salaryCommitment.slice(0, 10)}...
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employeesInRun.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No employee records found for this payroll run.
          </div>
        )}

        <div className="px-4 sm:px-6 py-3 border-t text-xs text-gray-500">
          {employeesInRun.length} employee{employeesInRun.length !== 1 ? "s" : ""} in this run
        </div>
      </div>
    </section>
  );
}

export default PayrollRunDetail;
