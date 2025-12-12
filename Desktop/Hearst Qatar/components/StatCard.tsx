interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-white rounded border border-gray-200 p-4 transition-colors hover:border-gray-300 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wide mb-0.5">{title}</p>
          {subtitle && <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-400 opacity-50">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</span>
        <span className="text-sm text-gray-500 font-normal">{unit}</span>
      </div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-[10px] mt-1.5 ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {trend === 'up' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            ) : trend === 'down' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            )}
          </svg>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
