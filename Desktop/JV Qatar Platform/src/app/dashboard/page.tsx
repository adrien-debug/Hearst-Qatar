'use client'

import { useState, useEffect } from 'react'
import ElectricityTracking from '@/components/ElectricityTracking'
import BitcoinMiningTracking from '@/components/BitcoinMiningTracking'
import { getCurrentElectricityMetrics, getCurrentMiningMetrics } from '@/lib/mockData'
import LightningIcon from '@/components/icons/LightningIcon'
import PlugIcon from '@/components/icons/PlugIcon'
import ContainerIcon from '@/components/icons/ContainerIcon'

type TabType = 'electricity' | 'mining'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('electricity')
  const [electricityMetrics, setElectricityMetrics] = useState(getCurrentElectricityMetrics())
  const [miningMetrics, setMiningMetrics] = useState(getCurrentMiningMetrics())

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setElectricityMetrics(getCurrentElectricityMetrics())
      setMiningMetrics(getCurrentMiningMetrics())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // KPIs pour Électricité
  const electricityKPIs = [
    {
      label: 'Puissance Consommée',
      description: 'Énergie utilisée en ce moment',
      value: `${electricityMetrics.totalPowerMW} MW`,
      icon: LightningIcon,
      color: '#1E8449'
    },
    {
      label: 'Tension du Réseau',
      description: 'Niveau de tension électrique',
      value: `${electricityMetrics.voltageKV} kV`,
      icon: PlugIcon,
      color: '#1E8449'
    },
    {
      label: 'Courant Électrique',
      description: 'Intensité du courant',
      value: `${electricityMetrics.currentA} A`,
      icon: LightningIcon,
      color: '#1E8449'
    },
    {
      label: 'Efficacité Énergétique',
      description: 'Rendement du système',
      value: `${electricityMetrics.efficiencyPercent}%`,
      icon: PlugIcon,
      color: '#1E8449'
    },
    {
      label: 'Coût par Heure',
      description: 'Dépense électrique actuelle',
      value: `$${electricityMetrics.costPerHourUSD.toFixed(2)}`,
      icon: LightningIcon,
      color: '#1E8449'
    }
  ]

  // KPIs pour Bitcoin Mining
  const miningKPIs = [
    {
      label: 'Puissance de Calcul',
      description: 'Vitesse de minage (Hashrate)',
      value: `${miningMetrics.hashrateTHs} TH/s`,
      subValue: 'Térahashes par seconde',
      icon: LightningIcon,
      color: '#1E8449',
      status: 'excellent'
    },
    {
      label: 'Revenus du Jour',
      description: 'Gains générés aujourd\'hui',
      value: `$${miningMetrics.dailyRevenueUSD.toLocaleString()}`,
      subValue: `${miningMetrics.dailyRevenueBTC.toFixed(4)} BTC`,
      icon: LightningIcon,
      color: '#1E8449',
      status: 'good'
    },
    {
      label: 'Conteneurs en Fonction',
      description: 'Machines de minage actives',
      value: `${miningMetrics.activeContainers} / 64`,
      subValue: `${Math.round((miningMetrics.activeContainers / 64) * 100)}% opérationnels`,
      icon: ContainerIcon,
      color: '#1E8449',
      status: miningMetrics.activeContainers >= 63 ? 'excellent' : 'good'
    },
    {
      label: 'Température',
      description: 'Température moyenne des machines',
      value: `${miningMetrics.avgTemperature}°C`,
      subValue: miningMetrics.avgTemperature < 30 ? 'Optimal' : 'Attention',
      icon: LightningIcon,
      color: '#1E8449',
      status: miningMetrics.avgTemperature < 30 ? 'excellent' : 'warning'
    },
    {
      label: 'Efficacité Énergétique',
      description: 'Consommation par unité de calcul',
      value: `${miningMetrics.efficiencyJTH} J/TH`,
      subValue: 'Joules par Térahash',
      icon: LightningIcon,
      color: '#1E8449',
      status: 'good'
    }
  ]

  const currentKPIs = activeTab === 'electricity' ? electricityKPIs : miningKPIs

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--structure-header-height))',
      backgroundColor: 'var(--color-bg-content)',
      color: 'var(--color-text-primary)'
    }}>
      {/* Bande noire avec KPIs */}
      <div style={{
        backgroundColor: '#0A0A0A',
        padding: '24px 48px',
        borderBottom: '1px solid #1E8449'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          {currentKPIs.map((kpi, index) => {
            const IconComponent = kpi.icon
            return (
              <div
                key={index}
                style={{
                  padding: '24px',
                  backgroundColor: '#121212',
                  border: `1px solid ${kpi.color}40`,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  boxShadow: `0 4px 12px ${kpi.color}15`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${kpi.color}80`
                  e.currentTarget.style.boxShadow = `0 6px 16px ${kpi.color}25`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${kpi.color}40`
                  e.currentTarget.style.boxShadow = `0 4px 12px ${kpi.color}15`
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {('status' in kpi) && (kpi as any).status && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: (kpi as any).status === 'excellent' 
                      ? '#2ECC71' 
                      : (kpi as any).status === 'good'
                      ? '#27AE60'
                      : '#58D68D',
                    boxShadow: `0 0 8px ${(kpi as any).status === 'excellent' 
                      ? '#2ECC71' 
                      : (kpi as any).status === 'good'
                      ? '#27AE60'
                      : '#58D68D'}40`
                  }} />
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    flex: 1
                  }}>
                    <div style={{
                      fontSize: '28px',
                      color: kpi.color,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-family-primary)',
                      letterSpacing: '-0.5px'
                    }}>
                      {kpi.value}
                    </div>
                    {('subValue' in kpi) && (kpi as any).subValue && (
                      <div style={{
                        fontSize: '12px',
                        color: '#CCCCCC',
                        fontWeight: 400,
                        fontFamily: 'var(--font-family-primary)',
                        opacity: 0.9
                      }}>
                        {(kpi as any).subValue}
                      </div>
                    )}
                  </div>
                  <IconComponent size={32} color={kpi.color} />
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  paddingTop: '8px',
                  borderTop: '1px solid #1E1E1E'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontFamily: 'var(--font-family-primary)',
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase'
                  }}>
                    {kpi.label}
                  </div>
                  {kpi.description && (
                    <div style={{
                      fontSize: '11px',
                      color: '#999999',
                      fontWeight: 400,
                      fontFamily: 'var(--font-family-primary)',
                      lineHeight: 1.4
                    }}>
                      {kpi.description}
                    </div>
                  )}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)`,
                  borderRadius: '0 0 8px 8px'
                }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Menu Onglets */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '0 48px',
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        gap: '0',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => setActiveTab('electricity')}
          style={{
            padding: '16px 24px',
            fontSize: '12px',
            fontWeight: 500,
            color: activeTab === 'electricity' 
              ? '#1A1A1A' 
              : '#666666',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'electricity' 
              ? '2px solid #1E8449' 
              : '2px solid transparent',
            cursor: 'pointer',
            marginBottom: '-2px',
            position: 'relative',
            fontFamily: 'var(--font-family-primary)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'electricity') {
              e.currentTarget.style.color = '#1A1A1A'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'electricity') {
              e.currentTarget.style.color = '#666666'
            }
          }}
        >
          Électricité
        </button>
        <button
          onClick={() => setActiveTab('mining')}
          style={{
            padding: '16px 24px',
            fontSize: '12px',
            fontWeight: 500,
            color: activeTab === 'mining' 
              ? '#1A1A1A' 
              : '#666666',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'mining' 
              ? '2px solid #1E8449' 
              : '2px solid transparent',
            cursor: 'pointer',
            marginBottom: '-2px',
            position: 'relative',
            fontFamily: 'var(--font-family-primary)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'mining') {
              e.currentTarget.style.color = '#1A1A1A'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'mining') {
              e.currentTarget.style.color = '#666666'
            }
          }}
        >
          Bitcoin Mining
        </button>
      </div>

      {/* Contenu Graphiques */}
      <div style={{
        padding: '32px 48px',
        maxWidth: '1600px',
        margin: '0 auto',
        backgroundColor: '#FAFAFA'
      }}>
        {activeTab === 'electricity' && <ElectricityTracking />}
        {activeTab === 'mining' && <BitcoinMiningTracking />}
      </div>
    </div>
  )
}
