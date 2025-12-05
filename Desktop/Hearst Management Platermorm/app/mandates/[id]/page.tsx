import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MandateDetail from '@/components/mandates/MandateDetail';
import { getMandateById } from '@/lib/mock-mandates';

interface MandateDetailPageProps {
  params: {
    id: string;
  };
}

export default function MandateDetailPage({ params }: MandateDetailPageProps) {
  const mandate = getMandateById(params.id);

  if (!mandate) {
    notFound();
  }

  return (
    <DashboardLayout>
      <MandateDetail mandate={mandate} />
    </DashboardLayout>
  );
}



