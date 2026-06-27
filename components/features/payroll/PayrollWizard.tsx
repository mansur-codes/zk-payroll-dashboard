"use client";

import { useMemo, useCallback } from "react";
import {
  CheckCircle,
  Circle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { usePayrollWizardStore } from "@/stores/payrollWizard";
import { MOCK_EMPLOYEES, MOCK_PAYROLL_RUNS } from "@/lib/api/mockData";
import type { PayrollWizardStep } from "@/types";

const STEPS: { key: PayrollWizardStep; label: string }[] = [
  { key: "review", label: "Review" },
  { key: "proof", label: "Proof Generation" },
  { key: "confirm", label: "Confirmation" },
  { key: "submit", label: "Submission" },
];

function stepIndex(step: PayrollWizardStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

function PayrollWizard() {
  const {
    currentStep,
    employeeIds,
    totalAmount,
    proofStatus,
    proofError,
    submissionStatus,
    submissionError,
    transactionHash,
    nextStep,
    prevStep,
    setEmployeeIds,
    setTotalAmount,
    setProofStatus,
    setProofError,
    setSubmissionStatus,
    setSubmissionError,
    setTransactionHash,
    reset,
  } = usePayrollWizardStore();

  const selectedEmployees = useMemo(
    () => MOCK_EMPLOYEES.filter((e) => employeeIds.includes(e.id)),
    [employeeIds],
  );

  const handleStartPayroll = useCallback(() => {
    setEmployeeIds(MOCK_EMPLOYEES.map((e) => e.id));
    setTotalAmount(MOCK_EMPLOYEES.reduce((sum, e) => sum + e.salary, 0));
  }, [setEmployeeIds, setTotalAmount]);

  const handleGenerateProof = useCallback(async () => {
    setProofStatus("generating");
    setProofError(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2;
    if (success) {
      setProofStatus("success");
      toast.success("Proof generated successfully");
      nextStep();
    } else {
      setProofStatus("error");
      setProofError(
        "Proof generation failed: circuit constraint mismatch. Please retry.",
      );
      toast.error("Proof generation failed", {
        description: "Circuit constraint mismatch.",
      });
    }
  }, [setProofStatus, setProofError, nextStep]);

  const handleSubmit = useCallback(async () => {
    setSubmissionStatus("submitting");
    setSubmissionError(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.15;
    if (success) {
      setSubmissionStatus("success");
      setTransactionHash(`0x${Date.now().toString(16)}abc`);
      toast.success("Payroll submitted successfully", {
        description: "Transaction submitted to the Stellar network.",
      });
      nextStep();
    } else {
      setSubmissionStatus("error");
      setSubmissionError(
        "Submission failed: network timeout. The transaction may still be processing.",
      );
      toast.error("Submission failed", {
        description: "Network timeout. The transaction may still be processing.",
      });
    }
  }, [setSubmissionStatus, setSubmissionError, setTransactionHash, nextStep]);

  const idx = stepIndex(currentStep);

  return (
    <section aria-labelledby="payroll-wizard-heading" className="space-y-6">
      <h2 id="payroll-wizard-heading" className="text-lg font-semibold text-gray-900">
        Execute Payroll
      </h2>

      <nav aria-label="Payroll execution progress" className="flex items-center">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center gap-2">
              {i < idx ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : i === idx ? (
                <Loader2
                  className={`w-5 h-5 ${
                    currentStep === "proof" || currentStep === "submit"
                      ? "text-indigo-600 animate-spin"
                      : "text-indigo-600"
                  }`}
                />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <span
                className={`text-sm font-medium ${
                  i <= idx ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-px mx-3 ${
                  i < idx ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {currentStep === "review" && (
          <ReviewStep
            employeeIds={employeeIds}
            selectedEmployees={selectedEmployees}
            totalAmount={totalAmount}
            onStart={handleStartPayroll}
            onNext={nextStep}
          />
        )}
        {currentStep === "proof" && (
          <ProofStep
            status={proofStatus}
            error={proofError}
            onGenerate={handleGenerateProof}
            onRetry={handleGenerateProof}
            onBack={prevStep}
          />
        )}
        {currentStep === "confirm" && (
          <ConfirmStep
            employeeIds={employeeIds}
            selectedEmployees={selectedEmployees}
            totalAmount={totalAmount}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        )}
        {currentStep === "submit" && (
          <SubmitStep
            status={submissionStatus}
            error={submissionError}
            transactionHash={transactionHash}
            onRetry={handleSubmit}
            onReset={reset}
          />
        )}
      </div>
    </section>
  );
}

function ReviewStep({
  employeeIds,
  selectedEmployees,
  totalAmount,
  onStart,
  onNext,
}: {
  employeeIds: string[];
  selectedEmployees: { id: string; name: string; salary: number }[];
  totalAmount: number;
  onStart: () => void;
  onNext: () => void;
}) {
  if (employeeIds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          No payroll run configured. Start a new payroll run to proceed.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Start Payroll Run
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Payroll Review</h3>
      <p className="text-sm text-gray-600">
        Review the employees and amounts included in this payroll run before
        generating the ZK proof.
      </p>
      <div className="border rounded-lg divide-y">
        {selectedEmployees.map((emp) => (
          <div key={emp.id} className="px-4 py-3 flex justify-between">
            <span className="text-sm text-gray-900">{emp.name}</span>
            <span className="text-sm font-medium text-gray-900">
              ${emp.salary.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-sm font-semibold text-gray-900">
          Total: ${totalAmount.toLocaleString()}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ProofStep({
  status,
  error,
  onGenerate,
  onRetry,
  onBack,
}: {
  status: "idle" | "generating" | "success" | "error";
  error: string | null;
  onGenerate: () => void;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">ZK Proof Generation</h3>
      <p className="text-sm text-gray-600">
        A zero-knowledge proof will be generated locally in the browser to
        prove the validity of this payroll run without revealing individual
        salary details.
      </p>

      {status === "idle" && (
        <div className="text-center py-6">
          <button
            type="button"
            onClick={onGenerate}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Generate Proof
          </button>
        </div>
      )}

      {status === "generating" && (
        <div className="text-center py-6 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm text-gray-600">
            Generating ZK proof... This may take a few moments.
          </p>
          <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-6 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-md bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}

function ConfirmStep({
  selectedEmployees,
  totalAmount,
  onBack,
  onSubmit,
}: {
  employeeIds: string[];
  selectedEmployees: { id: string; name: string; salary: number }[];
  totalAmount: number;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Confirm &amp; Submit</h3>
      <p className="text-sm text-gray-600">
        The ZK proof has been generated successfully. Review the final details
        and submit the payroll transaction to the network.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">
            Proof verified successfully
          </p>
          <p className="text-sm text-green-700 mt-1">
            Commitment hash ready for on-chain submission.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Employees</span>
          <span className="font-medium text-gray-900">
            {selectedEmployees.length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-medium text-gray-900">
            ${totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Submit Payroll
        </button>
      </div>
    </div>
  );
}

function SubmitStep({
  status,
  error,
  transactionHash,
  onRetry,
  onReset,
}: {
  status: "idle" | "submitting" | "success" | "error";
  error: string | null;
  transactionHash: string | null;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Submission</h3>

      {status === "submitting" && (
        <div className="text-center py-8 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm text-gray-600">
            Submitting payroll transaction to Stellar network...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center py-8 space-y-3">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h4 className="text-lg font-semibold text-gray-900">
            Payroll Submitted
          </h4>
          <p className="text-sm text-gray-600">
            The transaction has been submitted to the network.
          </p>
          {transactionHash && (
            <p className="font-mono text-xs text-gray-500 break-all">
              Tx: {transactionHash}
            </p>
          )}
          <button
            type="button"
            onClick={onReset}
            className="mt-4 px-6 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Start New Payroll
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-8 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h4 className="text-lg font-semibold text-red-700">Submission Failed</h4>
          <p className="text-sm text-red-600">{error}</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-md bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Submission
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollWizard;
