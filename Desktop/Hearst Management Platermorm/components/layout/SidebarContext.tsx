'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  
  // Sauvegarder les valeurs originales du body
  const bodyStylesRef = useRef<{
    overflow: string;
    paddingRight: string;
    position: string;
    width: string;
    top: string;
  } | null>(null);
  
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        try {
          window.removeEventListener('resize', checkMobile);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return;
    
    if (isMobileOpen && isMobile) {
      // Sauvegarder les valeurs originales seulement si elles n'ont pas déjà été sauvegardées
      if (!bodyStylesRef.current) {
        bodyStylesRef.current = {
          overflow: document.body.style.overflow || '',
          paddingRight: document.body.style.paddingRight || '',
          position: document.body.style.position || '',
          width: document.body.style.width || '',
          top: document.body.style.top || '',
        };
        scrollPositionRef.current = window.scrollY;
      }
      
      // Calculer la largeur de la barre de défilement pour compenser
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Appliquer les styles pour bloquer le scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      
      // Compenser la disparition de la barre de défilement pour éviter le décalage
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restaurer les styles quand le menu est fermé
      if (bodyStylesRef.current) {
        const savedStyles = bodyStylesRef.current;
        const savedScrollY = scrollPositionRef.current;
        
        // Restaurer tous les styles
        document.body.style.overflow = savedStyles.overflow;
        document.body.style.paddingRight = savedStyles.paddingRight;
        document.body.style.position = savedStyles.position;
        document.body.style.width = savedStyles.width;
        document.body.style.top = savedStyles.top;
        
        // Restaurer la position de scroll
        window.scrollTo(0, savedScrollY);
        
        // Réinitialiser la référence
        bodyStylesRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (!isMobileOpen && bodyStylesRef.current) {
        const savedStyles = bodyStylesRef.current;
        const savedScrollY = scrollPositionRef.current;
        
        if (typeof document !== 'undefined' && document.body) {
          try {
            document.body.style.overflow = savedStyles.overflow;
            document.body.style.paddingRight = savedStyles.paddingRight;
            document.body.style.position = savedStyles.position;
            document.body.style.width = savedStyles.width;
            document.body.style.top = savedStyles.top;
            
            window.scrollTo(0, savedScrollY);
            bodyStylesRef.current = null;
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
      }
    };
  }, [isMobileOpen, isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobile,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

