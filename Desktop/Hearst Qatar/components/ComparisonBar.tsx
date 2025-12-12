interface ComparisonBarProps {
  label: string;
  qatarValue: number;
  comparisonValue: number;
  comparisonLabel: string;
  unit: string;
  qatarColor?: string;
  comparisonColor?: string;
  formatValue?: (val: number) => string;
}

export default function ComparisonBar({
  label,
  qatarValue,
  comparisonValue,
  comparisonLabel,
  unit,
  qatarColor = '#8AFD81',
  comparisonColor = '#94a3b8',
  formatValue = (val) => val.toLocaleString('en-US'),
}: ComparisonBarProps) {
  const maxValue = Math.max(qatarValue, comparisonValue);
  const qatarPercentage = (qatarValue / maxValue) * 100;
  const comparisonPercentage = (comparisonValue / maxValue) * 100;
  const advantage = ((comparisonValue - qatarValue) / comparisonValue) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">{label}</span>
        <span className="text-xs text-white/50">{advantage > 0 ? `-${advantage.toFixed(0)}%` : `+${Math.abs(advantage).toFixed(0)}%`}</span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">Qatar</span>
            <span className="text-sm font-semibold text-white">{formatValue(qatarValue)} {unit}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${qatarPercentage}%`, backgroundColor: qatarColor }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">{comparisonLabel}</span>
            <span className="text-sm font-semibold text-white/70">{formatValue(comparisonValue)} {unit}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${comparisonPercentage}%`, backgroundColor: comparisonColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
