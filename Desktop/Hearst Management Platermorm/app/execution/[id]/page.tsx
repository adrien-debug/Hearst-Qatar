import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExecutionDetail from '@/components/execution/ExecutionDetail';
import { getExecutionById } from '@/lib/mock-executions';

interface ExecutionDetailPageProps {
  params: {
    id: string;
  };
}

export default function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const execution = getExecutionById(params.id);

  if (!execution) {
    notFound();
  }

  return (
    <DashboardLayout>
      <ExecutionDetail execution={execution} />
    </DashboardLayout>
  );
}



