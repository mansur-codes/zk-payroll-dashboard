import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PayrollRunDetail from "@/components/features/payroll/PayrollRunDetail";
import { MOCK_PAYROLL_RUNS } from "@/lib/api/mockData";

describe("Payroll Run Detail", () => {
  it("renders scheduled run details with process action", () => {
    const run = MOCK_PAYROLL_RUNS.find((r) => r.id === "tx_003")!;
    render(<PayrollRunDetail run={run} />);

    expect(screen.getByRole("heading", { name: /payroll run/i })).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /process payroll/i })).toHaveAttribute(
      "href",
      "/payroll/execute",
    );
  });

  it("renders completed run without process action", () => {
    const run = MOCK_PAYROLL_RUNS.find((r) => r.id === "tx_001")!;
    render(<PayrollRunDetail run={run} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /process payroll/i })).not.toBeInTheDocument();
    expect(screen.getByText("abc123def456")).toBeInTheDocument();
  });

  it("links back to the schedule page", () => {
    render(<PayrollRunDetail run={MOCK_PAYROLL_RUNS[0]} />);

    expect(screen.getByRole("link", { name: /back to schedule/i })).toHaveAttribute(
      "href",
      "/payroll/schedule",
    );
  });
});
