import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollRunDetail, {
  findPayrollRun,
} from "@/components/features/payroll/PayrollRunDetail";

interface PayrollRunPageProps {
  params: { id: string };
}

function PayrollRunPage({ params }: PayrollRunPageProps) {
  const run = findPayrollRun(params.id);
  if (!run) notFound();

  return (
    <DashboardLayout>
      <PayrollRunDetail run={run} />
    </DashboardLayout>
  );
}

export default PayrollRunPage;
