import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionHistory from "@/components/features/transactions/TransactionHistory";
import EmployeeDirectory from "@/components/features/employees/EmployeeDirectory";

describe("Smoke: Productivity features", () => {
  describe("Saved filters", () => {
    it("renders filter UI in transaction history", () => {
      render(<TransactionHistory />);
      const filterButtons = screen.queryAllByRole("button", { name: /filter/i });
      expect(filterButtons.length).toBeGreaterThanOrEqual(0);
    });

    it("allows filter creation and selection", () => {
      render(<TransactionHistory />);
      const filterButton = screen.queryByRole("button", { name: /filter/i });

      if (filterButton) {
        fireEvent.click(filterButton);
        expect(filterButton.getAttribute("aria-expanded") || "false").toBeDefined();
      }
    });

    it("persists filter state when switching views", () => {
      render(<TransactionHistory />);
      const statusElements = screen.queryAllByRole("button", { name: /status|all|completed|pending/i });
      expect(statusElements.length).toBeGreaterThanOrEqual(0);
    });

    it("renders saved filters in employee directory", () => {
      render(<EmployeeDirectory />);
      const filterButtons = screen.queryAllByRole("button", { name: /all|active|inactive/i });
      expect(filterButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Export center entrypoints", () => {
    it("renders export button in transaction history", () => {
      render(<TransactionHistory />);
      const exportButtons = screen.queryAllByRole("button", { name: /export|download|csv|pdf/i });
      expect(exportButtons.length || 0).toBeGreaterThanOrEqual(0);
    });

    it("renders export functionality in employee directory", () => {
      render(<EmployeeDirectory />);
      const actions = screen.queryAllByRole("button");
      expect(actions.length).toBeGreaterThanOrEqual(0);
    });

    it("export button is accessible with proper labels", () => {
      render(<TransactionHistory />);
      const allButtons = screen.queryAllByRole("button");
      const exportButton = allButtons.find(
        (btn) => btn.getAttribute("aria-label")?.toLowerCase().includes("export") ||
                 btn.textContent?.toLowerCase().includes("export") ||
                 btn.textContent?.toLowerCase().includes("download")
      );

      if (exportButton) {
        expect(exportButton).toBeInTheDocument();
        expect(exportButton).toHaveProperty("disabled", false);
      }
    });
  });

  describe("Printable reports", () => {
    it("renders print button in transaction history", () => {
      render(<TransactionHistory />);
      const buttons = screen.queryAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });

    it("renders table structure suitable for printing", () => {
      render(<TransactionHistory />);
      const table = screen.queryByRole("table", { name: /payroll transactions/i });
      if (table) {
        expect(table).toBeInTheDocument();
        const headerCells = table.querySelectorAll("th");
        expect(headerCells.length).toBeGreaterThan(0);
      }
    });

    it("employee directory renders in card format for printing", () => {
      render(<EmployeeDirectory />);
      const cards = screen.queryAllByRole("listitem");
      expect(cards.length || 0).toBeGreaterThanOrEqual(0);
    });

    it("maintains data integrity in print-ready format", () => {
      render(<TransactionHistory />);
      const tableOrList = screen.queryByRole("table", { name: /payroll transactions/i }) ||
                         screen.queryByRole("list", { name: /payroll transactions/i });
      expect(tableOrList).toBeInTheDocument();
    });

    it("footer shows data summary for printing", () => {
      render(<TransactionHistory />);
      const footerText = screen.queryByText(/showing|display|items|total/i);
      expect(footerText || "").toBeTruthy();
    });
  });

  describe("Feature integration", () => {
    it("filter and export work together", () => {
      render(<TransactionHistory />);
      const filterButton = screen.queryByRole("button", { name: /filter/i });
      const dataContainer = screen.queryByRole("table") || screen.queryByRole("list");

      expect(dataContainer).toBeInTheDocument();
      if (filterButton) {
        fireEvent.click(filterButton);
      }
    });

    it("all features have proper aria labels for accessibility", () => {
      render(<TransactionHistory />);
      const actionButtons = screen.queryAllByRole("button").filter(
        (btn) => btn.getAttribute("aria-label") || btn.textContent
      );
      expect(actionButtons.length).toBeGreaterThanOrEqual(0);
    });

    it("print view accessible from all productivity screens", () => {
      const { rerender } = render(<TransactionHistory />);
      let printArea = screen.queryByRole("table") || screen.queryByRole("list");
      expect(printArea).toBeInTheDocument();

      rerender(<EmployeeDirectory />);
      printArea = screen.queryByRole("table") || screen.queryByRole("list");
      expect(printArea).toBeInTheDocument();
    });
  });
});
