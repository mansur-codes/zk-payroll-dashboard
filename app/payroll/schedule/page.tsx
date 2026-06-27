import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollCalendar from "@/components/features/payroll/PayrollCalendar";

function PayrollSchedulePage() {
  return (
    <DashboardLayout>
      <PayrollCalendar />
    </DashboardLayout>
  );
}

export default PayrollSchedulePage;
