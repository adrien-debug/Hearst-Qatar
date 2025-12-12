import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-[180px] right-0 h-[60px] bg-[#0a0b0d] z-40 border-b border-white/5">
        <div className="flex items-center justify-center gap-3 px-6 h-full relative overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-normal text-white/80 hover:text-white/100 bg-transparent border-none rounded cursor-pointer transition-all duration-200">
              Global<span className="text-white/60 text-[10px]">▼</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-normal text-white/80 hover:text-white/100 bg-transparent border-none rounded cursor-pointer transition-all duration-200">
              YTD<span className="text-white/60 text-[10px]">▼</span>
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10 flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px] font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

