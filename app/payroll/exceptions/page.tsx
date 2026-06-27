import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollExceptionsQueue from "@/components/features/payroll/PayrollExceptionsQueue";

function ExceptionsPage() {
  return (
    <DashboardLayout>
      <PayrollExceptionsQueue />
    </DashboardLayout>
  );
}

export default ExceptionsPage;
