import DashboardLayout from '@/components/layout/DashboardLayout';
import ExecutionsTable from '@/components/execution/ExecutionsTable';

export default function ExecutionPage() {
  return (
    <DashboardLayout>
      <ExecutionsTable />
    </DashboardLayout>
  );
}



