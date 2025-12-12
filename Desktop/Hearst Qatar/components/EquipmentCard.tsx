interface EquipmentCardProps {
  title: string;
  subtitle?: string;
  details: { label: string; value: string | number }[];
  status?: 'OK' | 'Warning' | 'Off' | 'In Service' | 'Maintenance' | 'Standby';
  onClick?: () => void;
}

export default function EquipmentCard({ title, subtitle, details, status, onClick }: EquipmentCardProps) {
  const statusColors = {
    OK: 'bg-[#8AFD81] shadow-[0_0_8px_rgba(138,253,129,0.4)]',
    'In Service': 'bg-[#8AFD81] shadow-[0_0_8px_rgba(138,253,129,0.4)]',
    Warning: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    Maintenance: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    Off: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    Standby: 'bg-gray-400',
  };

  const statusColor = statusColors[status || 'OK'];

  return (
    <div
      className={`group relative bg-white rounded-lg p-4 border border-[#e2e8f0]/80 hover:border-[#8AFD81]/60 hover:shadow-lg hover:shadow-[#8AFD81]/5 transition-all duration-300 shadow-sm backdrop-blur-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Effet de brillance subtil au hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-[#0b1120] font-bold text-base leading-tight tracking-tight">{title}</h4>
          {subtitle && (
            <p className="text-xs text-[#64748b] mt-1 leading-tight font-medium">{subtitle}</p>
          )}
        </div>
        {status && (
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-3 px-2 py-1 rounded-full bg-[#f8f9fa] border border-[#e2e8f0]">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
            <span className="text-xs text-[#64748b] font-semibold whitespace-nowrap">{status}</span>
          </div>
        )}
      </div>
      <div className="relative space-y-1.5 pt-1.5 border-t border-[#f1f5f9]">
        {details.map((detail, index) => {
          // Détection d'un séparateur (label commençant par ━)
          const isSeparator = typeof detail.label === 'string' && detail.label.startsWith('━');
          
          if (isSeparator) {
            return (
              <div key={index} className="relative my-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2e8f0]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-[#8AFD81] text-xs font-bold">
                    {detail.value}
                  </span>
                </div>
              </div>
            );
          }
          
          return (
            <div key={index} className="flex justify-between items-baseline gap-3">
              <span className="text-[#64748b] text-xs leading-tight font-medium">{detail.label}</span>
              <span className="text-[#0b1120] font-bold text-sm text-right leading-tight whitespace-nowrap">
                {detail.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

