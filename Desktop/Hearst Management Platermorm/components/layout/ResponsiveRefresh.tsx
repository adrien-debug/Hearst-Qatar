'use client';

import { useEffect } from 'react';

export default function ResponsiveRefresh() {
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Dispatch resize event for other components without breaking scroll
        window.dispatchEvent(new Event('resize'));
      }, 150);
    }

    function handleOrientationChange() {
      setTimeout(() => {
        // Only dispatch event, don't manipulate DOM
        window.dispatchEvent(new Event('resize'));
      }, 150);
    }

    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return null;
}
