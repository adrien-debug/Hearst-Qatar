import { useSidebar } from '../contexts/SidebarContext';

export default function Footer() {
  const { isExpanded } = useSidebar();
  const leftMargin = isExpanded 
    ? 'left-0 md:left-[180px]' 
    : 'left-0 md:left-[80px]';

  const versions = [
    { label: 'Next.js', version: '14.0.0' },
    { label: 'React', version: '18.2.0' },
    { label: 'App', version: '1.0.0' },
  ];

  return (
    <footer className={`fixed bottom-0 ${leftMargin} right-0 bg-[#0a0b0d] border-t border-white/5 z-40 transition-all duration-300`}>
      <div className="w-full">
        <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-[10px] sm:text-xs text-white/50">
            {versions.map((v, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-white/30 font-medium tracking-wide">{v.label}</span>
                <span className="text-[#8AFD81] font-semibold">{v.version}</span>
                {index < versions.length - 1 && (
                  <span className="text-white/15 mx-1">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
