interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  color?: string;
  showValue?: boolean;
}

export default function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  unit = '',
  color = '#8AFD81',
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{value.toFixed(1)}</span>
            {unit && <span className="text-xs text-white/60">{unit}</span>}
          </div>
        )}
      </div>
      {label && (
        <p className="text-xs text-white/70 uppercase tracking-wider mt-2 text-center">{label}</p>
      )}
    </div>
  );
}
