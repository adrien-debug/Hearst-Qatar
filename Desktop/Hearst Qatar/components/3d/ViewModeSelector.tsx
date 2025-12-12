export type ViewMode = 'overview' | 'substation' | 'powerblock' | 'transformer' | 'container';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

/**
 * Sélecteur de mode de vue pour naviguer rapidement dans la scène
 */
export default function ViewModeSelector({ currentMode, onModeChange }: ViewModeSelectorProps) {
  const modes: { value: ViewMode; label: string; icon: string }[] = [
    { value: 'overview', label: 'Vue d\'ensemble', icon: '🌐' },
    { value: 'substation', label: 'Substation', icon: '⚡' },
    { value: 'powerblock', label: 'Power Block', icon: '🔌' },
    { value: 'transformer', label: 'Transformateur', icon: '🔋' },
    { value: 'container', label: 'Container', icon: '📦' },
  ];

  return (
    <div className="flex gap-2 p-2 bg-white/90 rounded-lg shadow-lg">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={`px-4 py-2 rounded transition-all ${
            currentMode === mode.value
              ? 'bg-blue-500 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title={mode.label}
        >
          <span className="mr-2">{mode.icon}</span>
          <span className="text-sm">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
