'use client';

import React, { useState } from 'react';
import { useSidebar } from './SidebarContext';

const countries = ['Global', 'Qatar', 'Bahrain', 'UAE'];
const periods = ['Today', '7d', '30d', 'YTD'];

export default function Topbar() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[3]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const { isCollapsed, isMobile } = useSidebar();
  
  // Calculer la position left : 80px si collapsed, 220px sinon, 0px sur mobile
  const sidebarWidth = isMobile ? 0 : (isCollapsed ? 80 : 220);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: `${sidebarWidth}px`,
      backgroundColor: 'var(--color-bg)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 40,
      height: isMobile ? '66px' : '74px',
      transition: 'left 0.3s ease'
    }} className={isMobile ? 'mobile-topbar' : ''}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '8px' : '16px',
        padding: isMobile ? '12px 16px 12px 64px' : '16px 24px',
        height: '100%'
      }}>
        {/* Asset Management */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            color: 'white',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 400,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            Asset Management
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '8px' : '16px'
        }}>
        {/* Country Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowCountryDropdown(!showCountryDropdown);
              setShowPeriodDropdown(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '6px 12px' : '8px 16px',
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
              fontWeight: 500,
              color: 'rgba(138, 253, 129, 0.9)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138, 253, 129, 0.15)';
              e.currentTarget.style.color = 'rgba(138, 253, 129, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(138, 253, 129, 0.9)';
            }}
          >
            {selectedCountry}
            <span style={{ color: 'rgba(138, 253, 129, 0.7)', fontSize: isMobile ? '0.6875rem' : '0.75rem' }}>▼</span>
          </button>
          {showCountryDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '8px',
              width: isMobile ? '140px' : '160px',
              backgroundColor: 'white',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              {countries.map((country, index) => (
                <button
                  key={country}
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-main)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    borderRadius: index === 0 ? '8px 8px 0 0' : index === countries.length - 1 ? '0 0 8px 8px' : '0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Period Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowPeriodDropdown(!showPeriodDropdown);
              setShowCountryDropdown(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '6px 12px' : '8px 16px',
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
              fontWeight: 500,
              color: 'rgba(138, 253, 129, 0.9)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138, 253, 129, 0.15)';
              e.currentTarget.style.color = 'rgba(138, 253, 129, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(138, 253, 129, 0.9)';
            }}
          >
            {selectedPeriod}
            <span style={{ color: 'rgba(138, 253, 129, 0.7)', fontSize: isMobile ? '0.6875rem' : '0.75rem' }}>▼</span>
          </button>
          {showPeriodDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '8px',
              width: isMobile ? '110px' : '128px',
              backgroundColor: 'white',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              {periods.map((period, index) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowPeriodDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-main)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    borderRadius: index === 0 ? '8px 8px 0 0' : index === periods.length - 1 ? '0 0 8px 8px' : '0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '16px',
          borderLeft: '1px solid rgba(138, 253, 129, 0.2)'
        }}>
          <div style={{
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 600
          }}>
            JD
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
