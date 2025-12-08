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
          className={`${styles.mobileToggleButton} ${isMobileOpen ? styles.mobileToggleButtonOpen : ''}`}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.mobileToggleIcon}
          >
            <path
              d={isMobileOpen ? "M18 6L6 18M6 6L18 18" : "M3 12H21M3 6H21M3 18H21"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.mobileToggleIconPath}
            />
          </svg>
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
                src="/HEARST_LOGO (2).png"
                alt="Logo"
                className={styles.logoImageCollapsed}
                style={{ display: 'block' }}
              />
            ) : (
              <img
                src="/HEARST_LOGO.png"
                alt="Hearst Logo"
                className={styles.logoHGreen}
                style={{ display: 'block' }}
              />
            )}
          </div>

          {/* Toggle button - Desktop only, discreetly placed */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`${styles.toggleButton} ${isCollapsed ? styles.toggleButtonCollapsed : ''}`}
              aria-label="Toggle sidebar"
            >
              <svg
                width="4"
                height="12"
                viewBox="0 0 4 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.toggleIcon}
              >
                <circle cx="2" cy="2" r="1" fill="currentColor" />
                <circle cx="2" cy="6" r="1" fill="currentColor" />
                <circle cx="2" cy="10" r="1" fill="currentColor" />
              </svg>
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
      </aside>
    </>
  );
}
