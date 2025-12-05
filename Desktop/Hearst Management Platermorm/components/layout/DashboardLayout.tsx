'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { SidebarProvider, useSidebar } from './SidebarContext';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { isCollapsed, isMobile } = useSidebar();
  
  // Calculer la largeur du sidebar : 80px si collapsed, 220px sinon, 0px sur mobile
  const sidebarWidth = isMobile ? 0 : (isCollapsed ? 80 : 220);
  
  return (
    <div className={styles.container}>
      <Sidebar />
      <Topbar />
      <main 
        className={styles.main}
        style={{
          marginLeft: `${sidebarWidth}px`,
          maxWidth: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
