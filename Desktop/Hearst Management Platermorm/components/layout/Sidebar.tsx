'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { getMenuIcon } from './MenuIcons';
import styles from './Sidebar.module.css';

const menuItems = [
  { label: 'Overview', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Portfolio', path: '/mandates' },
  { label: 'Execution', path: '/execution' },
  { label: 'Compliance', path: '/risk' },
  { label: 'Reports', path: '/reports' },
  { label: 'Admin', path: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();

  const sidebarClasses = [
    styles.sidebar,
    isCollapsed && !isMobile ? styles.sidebarCollapsed : '',
    isMobile && !isMobileOpen ? styles.sidebarHidden : '',
    isMobile && isMobileOpen ? styles.sidebarOpen : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Bouton toggle fixe pour mobile */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={styles.mobileToggleButton}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      )}
      {isMobile && isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 49,
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            // Ne pas fermer si on clique sur le bouton toggle
            if ((e.target as HTMLElement).closest('.mobileToggleButton')) {
              return;
            }
            setIsMobileOpen(false);
          }}
        />
      )}
      <aside className={sidebarClasses}>
        <div className={styles.sidebarContent}>
          {/* Logo */}
          <div className={styles.logo}>
            {isCollapsed && !isMobile ? (
              <img
                src="/HEARST_LOGO%20(2).png"
                alt="Logo"
                width={32}
                height={32}
                className={styles.logoImageCollapsed}
                style={{ display: 'block' }}
              />
            ) : (
              <div className={styles.logoWrapper}>
                <img
                  src="/HEARST_LOGO.png"
                  alt="Hearst Logo"
                  className={styles.logoHGreen}
                  style={{ display: 'block' }}
                />
              </div>
            )}
          </div>

          {/* Menu section - Toggle button and Navigation centered */}
          <div className={styles.menuSection}>
            {/* Toggle button - Desktop only */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={styles.toggleButton}
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? '→' : '←'}
              </button>
            )}

            {/* Navigation */}
            <nav className={styles.nav}>
            <ul className={styles.navList}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = getMenuIcon(item.label);
                return (
                  <li key={item.path} className={styles.navItem}>
                    <Link
                      href={item.path}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                    >
                      <span className={styles.navIcon}>
                        <IconComponent size={20} />
                      </span>
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
