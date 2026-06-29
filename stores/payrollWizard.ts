import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PayrollWizardState, PayrollWizardStep } from "@/types";

const STEPS: PayrollWizardStep[] = ["review", "proof", "confirm", "submit"];

interface PayrollWizardStore extends PayrollWizardState {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: PayrollWizardStep) => void;
  setEmployeeIds: (ids: string[]) => void;
  setTotalAmount: (amount: number) => void;
  setProof: (proof: string | null) => void;
  setProofStatus: (status: PayrollWizardState["proofStatus"]) => void;
  setProofError: (error: string | null) => void;
  setSubmissionStatus: (
    status: PayrollWizardState["submissionStatus"],
  ) => void;
  setSubmissionError: (error: string | null) => void;
  setTransactionHash: (hash: string | null) => void;
  reset: () => void;
  hasDraft: () => boolean;
  restoreDraft: () => void;
  clearDraft: () => void;
}

const initialState: PayrollWizardState = {
  currentStep: "review",
  employeeIds: [],
  totalAmount: 0,
  proof: null,
  proofStatus: "idle",
  proofError: null,
  submissionStatus: "idle",
  submissionError: null,
  transactionHash: null,
};

export const usePayrollWizardStore = create<PayrollWizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      nextStep: () =>
        set((state) => {
          const idx = STEPS.indexOf(state.currentStep);
          if (idx < STEPS.length - 1) {
            return { currentStep: STEPS[idx + 1] };
          }
          return {};
        }),
      prevStep: () =>
        set((state) => {
          const idx = STEPS.indexOf(state.currentStep);
          if (idx > 0) {
            return { currentStep: STEPS[idx - 1] };
          }
          return {};
        }),
      goToStep: (step) => set({ currentStep: step }),
      setEmployeeIds: (employeeIds) => set({ employeeIds }),
      setTotalAmount: (totalAmount) => set({ totalAmount }),
      setProof: (proof) => set({ proof }),
      setProofStatus: (proofStatus) => set({ proofStatus }),
      setProofError: (proofError) => set({ proofError }),
      setSubmissionStatus: (submissionStatus) => set({ submissionStatus }),
      setSubmissionError: (submissionError) => set({ submissionError }),
      setTransactionHash: (transactionHash) => set({ transactionHash }),
      reset: () => set({ ...initialState }),
      hasDraft: () => {
        const state = get();
        return state.employeeIds.length > 0 || state.totalAmount > 0;
      },
      restoreDraft: () => {
        const state = get();
        if (state.employeeIds.length > 0 || state.totalAmount > 0) {
          set({ currentStep: "review" });
        }
      },
      clearDraft: () => set({ ...initialState }),
    }),
    {
      name: "zk-payroll-wizard-draft",
      partialize: (state) => ({
        employeeIds: state.employeeIds,
        totalAmount: state.totalAmount,
        currentStep:
          state.currentStep === "submit" ? "review" : state.currentStep,
        proofStatus: "idle",
        proofError: null,
        submissionStatus: "idle",
        submissionError: null,
        proof: null,
      }),
    },
  ),
);
