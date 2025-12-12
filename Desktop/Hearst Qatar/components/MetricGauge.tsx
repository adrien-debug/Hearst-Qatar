interface MetricGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  size?: number;
  showPercentage?: boolean;
}

export default function MetricGauge({
  value,
  max,
  label,
  unit = '',
  color = '#8AFD81',
  size = 200,
  showPercentage = true,
}: MetricGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const angle = (percentage / 100) * 180 - 90; // -90 to start from left

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg width={size} height={size / 2} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M 20 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M 20 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference / 2}
            strokeDashoffset={offset / 2}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Value display */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-3xl font-bold text-white mb-1">{value.toFixed(1)}</p>
          {unit && <p className="text-sm text-white/60">{unit}</p>}
          {showPercentage && (
            <p className="text-xs text-white/50 mt-1">{percentage.toFixed(1)}%</p>
          )}
        </div>
      </div>
      <p className="text-xs text-white/70 uppercase tracking-wider mt-4 text-center">{label}</p>
    </div>
  );
}
