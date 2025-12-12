import { colorTokens } from '../config/design-tokens';

interface EquipmentCardProps {
  title: string;
  subtitle?: string;
  details: { label: string; value: string | number }[];
  status?: 'OK' | 'Warning' | 'Off' | 'In Service' | 'Maintenance' | 'Standby';
  onClick?: () => void;
}

export default function EquipmentCard({ title, subtitle, details, status, onClick }: EquipmentCardProps) {
  const statusColors = {
    OK: `bg-[${colorTokens.primary.accent}] shadow-[0_0_8px_rgba(138,253,129,0.4)]`,
    'In Service': `bg-[${colorTokens.primary.accent}] shadow-[0_0_8px_rgba(138,253,129,0.4)]`,
    Warning: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    Maintenance: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    Off: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    Standby: 'bg-gray-400',
  };

  const statusColor = statusColors[status || 'OK'];

  return (
    <div
      className={`group relative bg-white rounded-[8px] p-4 border border-[${colorTokens.border.light}] hover:border-[${colorTokens.primary.accent}]/30 hover:shadow-md transition-all duration-200 shadow-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      
      <div className="relative flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className={`text-[${colorTokens.text.primary}] font-bold text-base leading-tight tracking-tight`}>{title}</h4>
          {subtitle && (
            <p className={`text-xs text-[${colorTokens.text.secondary}] mt-1 leading-tight font-medium`}>{subtitle}</p>
          )}
        </div>
        {status && (
          <div className={`flex items-center gap-1.5 flex-shrink-0 ml-3 px-2 py-1 rounded-[8px] bg-[${colorTokens.background.lightGray}] border border-[${colorTokens.border.light}]`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
            <span className={`text-xs text-[${colorTokens.text.secondary}] font-semibold whitespace-nowrap`}>{status}</span>
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
                  <span className={`px-2 bg-white text-[${colorTokens.primary.accent}] text-xs font-bold`}>
                    {detail.value}
                  </span>
                </div>
              </div>
            );
          }
          
          return (
            <div key={index} className="flex justify-between items-baseline gap-3">
              <span className={`text-xs text-[${colorTokens.text.secondary}] leading-tight font-medium`}>{detail.label}</span>
              <span className={`text-[${colorTokens.text.primary}] font-bold text-sm text-right leading-tight whitespace-nowrap`}>
                {detail.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

