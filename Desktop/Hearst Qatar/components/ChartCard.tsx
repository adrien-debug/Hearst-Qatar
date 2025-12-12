interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-white rounded-[8px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <h3 className="text-base font-semibold text-[#0b1120] mb-5 tracking-tight">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}




