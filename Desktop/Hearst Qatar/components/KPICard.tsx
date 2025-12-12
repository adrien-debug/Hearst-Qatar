interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function KPICard({ title, value, unit, icon, trend, trendValue }: KPICardProps) {
  const trendColor = {
    up: 'text-[#8AFD81]',
    down: 'text-red-600',
    neutral: 'text-[#64748b]',
  }[trend || 'neutral'];

  return (
    <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all duration-200 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-[#64748b] opacity-60">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-bold text-[#0b1120] tracking-tight">
          {typeof value === 'number' ? value.toLocaleString('en-US') : value}
        </p>
        {unit && <span className="text-lg text-[#64748b] font-medium tracking-wide">{unit}</span>}
      </div>
      {trendValue && (
        <p className={`text-xs mt-2 ${trendColor} font-medium`}>
          {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
        </p>
      )}
    </div>
  );
}

