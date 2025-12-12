import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Sidebar() {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(router.pathname);
  }, [router.pathname]);

  const navItems = [
    { href: '/', label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { href: '/hardware', label: 'Hardware', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { href: '/substation-3d-auto', label: '3D View', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
  ];

  return (
    <aside className="w-[180px] bg-[#0a0b0d] min-h-screen fixed left-0 top-0 border-r border-white/5 z-50">
      {/* Logo aligné avec le centre du header */}
      <div className="fixed top-0 left-0 w-[180px] h-[60px] bg-[#0a0b0d] z-50 border-b border-white/5 flex items-center justify-center">
        <Image
          src="/HEARST_LOGO.png"
          alt="Hearst Logo"
          width={168}
          height={48}
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      <div className="p-0 pb-10 pt-[60px]">
        <nav className="space-y-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'text-[#8AFD81]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8AFD81]"></div>
                )}
                <span className={`${isActive ? 'text-[#8AFD81]' : 'text-white/50'} transition-colors`}>
                  {item.icon}
                </span>
                <span className={`font-normal text-sm tracking-wide ${isActive ? 'text-[#8AFD81] font-medium' : 'text-white/60'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

