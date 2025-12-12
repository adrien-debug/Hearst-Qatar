import Link from 'next/link';
import { useSidebar } from '../contexts/SidebarContext';

export default function Header() {
  const { isExpanded } = useSidebar();
  const leftMargin = isExpanded 
    ? 'left-0 md:left-[180px]' 
    : 'left-0 md:left-[80px]';

  return (
    <>
      <header className={`fixed top-0 ${leftMargin} right-0 h-[60px] bg-[#0a0b0d] z-40 border-b border-white/5 transition-all duration-300`}>
        <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 h-full relative overflow-x-hidden overflow-y-hidden">
          <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
            <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-normal text-white/80 hover:text-white/100 bg-transparent border-none rounded cursor-pointer transition-all duration-200 whitespace-nowrap">
              Global<span className="text-white/60 text-[9px] sm:text-[10px]">▼</span>
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-normal text-white/80 hover:text-white/100 bg-transparent border-none rounded cursor-pointer transition-all duration-200 whitespace-nowrap">
              YTD<span className="text-white/60 text-[9px] sm:text-[10px]">▼</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-white/10 flex-shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px] sm:text-[11px] font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

