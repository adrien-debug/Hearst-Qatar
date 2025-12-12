import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSidebar } from '../contexts/SidebarContext';

export default function Sidebar() {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');
  const { isExpanded, setIsExpanded } = useSidebar();

  useEffect(() => {
    setPathname(router.pathname);
  }, [router.pathname]);

  const navItems = [
    { href: '/', label: 'Overview', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { href: '/hardware', label: 'Hardware', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { href: '/substation-3d-auto', label: '3D View', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
  ];

  const sidebarWidth = isExpanded 
    ? 'w-0 md:w-[180px]' 
    : 'w-0 md:w-[80px]';

  return (
    <aside className={`${sidebarWidth} bg-[#0a0b0d] min-h-screen fixed left-0 top-0 border-r border-white/5 z-50 flex flex-col transition-all duration-300 hidden md:flex`}>
      {/* Logo aligné avec le centre du header */}
      <div className={`fixed top-0 left-0 ${sidebarWidth} h-[60px] bg-[#0a0b0d] z-50 border-b border-white/5 flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
        {isExpanded ? (
          <Image
            src="/HEARST_LOGO.png"
            alt="Hearst Logo"
            width={168}
            height={48}
            className="object-contain"
            priority
            unoptimized
          />
        ) : (
          <Image
            src="/HEARST_LOGO (2).png"
            alt="Hearst Logo"
            width={24}
            height={16}
            className="object-contain"
            priority
            unoptimized
          />
        )}
      </div>
      
      {/* Bouton pour ouvrir/fermer le menu */}
      <div className={`fixed top-[60px] left-0 ${sidebarWidth} flex items-center justify-center py-3 border-b border-white/5 transition-all duration-300`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          title={isExpanded ? 'Réduire le menu' : 'Ouvrir le menu'}
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Menu centré verticalement */}
      <div className="flex-1 flex items-center justify-center pt-[120px] pb-[60px]">
        <nav className={`flex flex-col ${isExpanded ? 'items-start space-y-0 w-full px-4' : 'items-center space-y-4'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center ${isExpanded ? 'justify-start space-x-3 w-full px-4 py-3 rounded-lg' : 'justify-center w-12 h-12 rounded-lg'} transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#8AFD81]/10 text-[#8AFD81]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${isExpanded ? 'w-0.5 h-full' : 'w-1 h-8'} bg-[#8AFD81] ${isExpanded ? '' : 'rounded-r-full'}`}></div>
                )}
                <span className={`transition-colors ${isActive ? 'text-[#8AFD81]' : 'text-white/50 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className={`font-normal text-sm tracking-wide ${isActive ? 'text-[#8AFD81] font-medium' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

