import { create } from "zustand";

export interface HelpContent {
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  tips?: string[];
}

interface HelpDrawerStore {
  isOpen: boolean;
  currentPage: string | null;
  content: HelpContent | null;
  openHelp: (page: string, content: HelpContent) => void;
  closeHelp: () => void;
}

export const useHelpDrawer = create<HelpDrawerStore>((set) => ({
  isOpen: false,
  currentPage: null,
  content: null,
  openHelp: (page, content) =>
    set({ isOpen: true, currentPage: page, content }),
  closeHelp: () => set({ isOpen: false, currentPage: null, content: null }),
}));

export const HELP_CONTENT: Record<string, HelpContent> = {
  payroll: {
    title: "Payroll Processing Help",
    description: "Learn how to initiate and manage payroll runs.",
    sections: [
      {
        heading: "Getting Started",
        content:
          "To start a payroll run, navigate to the Payroll section and click Start Payroll. Select the employees to include and verify the amounts.",
      },
      {
        heading: "Proof Generation",
        content:
          "The system generates a zero-knowledge proof to ensure payroll integrity without revealing sensitive data. This process may take a few moments.",
      },
      {
        heading: "Submission",
        content:
          "After proof generation, review the final summary and confirm to submit the payroll on-chain.",
      },
    ],
    tips: [
      "Always review employee list before initiating payroll",
      "Ensure sufficient wallet balance for transaction fees",
      "Keep your wallet connected throughout the process",
    ],
  },
  compliance: {
    title: "Compliance & Auditing Help",
    description: "Understand compliance features and audit procedures.",
    sections: [
      {
        heading: "View Keys",
        content:
          "Generate view keys to grant auditors read-only access to payroll records without compromising security.",
      },
      {
        heading: "Audit Logs",
        content:
          "All transactions and changes are logged and can be accessed for compliance verification.",
      },
      {
        heading: "Recovery",
        content:
          "Use the recovery mechanism to correct payroll discrepancies. This creates an immutable record of corrections.",
      },
    ],
    tips: [
      "Rotate view keys regularly for security",
      "Document all recovery actions for audit purposes",
      "Review compliance reports monthly",
    ],
  },
  filters: {
    title: "Saved Filters Help",
    description: "Create and manage filters to organize your data.",
    sections: [
      {
        heading: "Creating Filters",
        content:
          "Click the filter icon and set your criteria. Save the filter with a descriptive name for future use.",
      },
      {
        heading: "Managing Filters",
        content:
          "Access saved filters from the filter menu. Edit or delete filters as needed.",
      },
    ],
  },
  export: {
    title: "Export Center Help",
    description: "Export data in various formats for analysis and reporting.",
    sections: [
      {
        heading: "Export Formats",
        content: "Choose from CSV, JSON, or PDF formats depending on your needs.",
      },
      {
        heading: "Export Options",
        content:
          "Select date ranges and fields to include in your export for customized reports.",
      },
    ],
  },
  print: {
    title: "Printable Reports Help",
    description: "Generate formatted reports ready for printing.",
    sections: [
      {
        heading: "Report Types",
        content:
          "Select from payroll summary, employee details, or compliance reports.",
      },
      {
        heading: "Printing",
        content:
          "Use your browser print function (Ctrl+P or Cmd+P) to save as PDF or print directly.",
      },
    ],
  },
};
