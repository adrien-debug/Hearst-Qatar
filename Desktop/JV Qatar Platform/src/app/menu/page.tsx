'use client'

import { siteConfig } from '@/lib/siteConfig'
import Link from 'next/link'
import HomeIcon from '@/components/icons/HomeIcon'
import PlugIcon from '@/components/icons/PlugIcon'
import ContainerIcon from '@/components/icons/ContainerIcon'
import ChartIcon from '@/components/icons/ChartIcon'

export default function MenuPage() {
  const menuSections = [
    {
      title: 'Overview',
      items: [
        {
          title: 'Overview',
          description: 'Complete and simplified view of the entire architecture',
          href: '/overview',
          iconComponent: HomeIcon
        },
        {
          title: 'Home',
          description: 'Global view of the installation with electrical architecture',
          href: '/',
          iconComponent: HomeIcon
        }
      ]
    },
    {
      title: 'Power Blocks',
      items: siteConfig.blocks.map((block) => ({
        title: block.name,
        description: `${block.numContainers} containers • ${block.targetPowerMW} MW • ${block.numTransformers} transformers`,
        href: `/blocks/${block.id}`,
        iconComponent: PlugIcon
      }))
    },
    {
      title: 'Technical Information',
      items: [
        {
          title: 'Hardware',
          description: `Type: ${siteConfig.containerSpec.type} • Power: ${siteConfig.containerSpec.totalPowerMW} MW • Dimensions and distribution`,
          href: '/conteneurs',
          iconComponent: ContainerIcon,
          disabled: false
        },
        {
          title: 'Tableau de Bord',
          description: 'Overview of site statistics and metrics',
          href: '/dashboard',
          iconComponent: ChartIcon,
          disabled: false
        }
      ]
    }
  ]

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--structure-header-height))',
      backgroundColor: 'var(--color-bg-content)',
      color: 'var(--color-text-primary)',
      padding: 'var(--spacing-8) var(--spacing-6)'
    }}>
      {/* Header */}
      <header style={{
        marginBottom: 'var(--spacing-8)',
        paddingBottom: 'var(--spacing-6)'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-display)',
          lineHeight: 'var(--line-height-display)',
          color: 'var(--color-text-primary)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-3)',
          letterSpacing: 'var(--letter-spacing-tight)'
        }}>
          Menu
        </h1>
        <p style={{
          fontSize: 'var(--font-size-body-minor)',
          color: 'var(--color-text-secondary)',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 'var(--line-height-relaxed)'
        }}>
          Quick access to all platform sections
        </p>
      </header>

      {/* Menu Sections */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)'
      }}>
        {menuSections.map((section, sectionIndex) => (
          <section key={sectionIndex}>
            <h2 style={{
              fontSize: 'var(--font-size-section-title)',
              lineHeight: 'var(--line-height-section-title)',
              marginBottom: 'var(--spacing-4)',
              color: 'var(--color-text-primary)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {section.title}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--spacing-5)'
            }}>
              {section.items.map((item, itemIndex) => {
                const isDisabled = 'disabled' in item && item.disabled

                const cardStyle = {
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'transparent',
                  border: '1px solid #E0E0E0',
                  borderRadius: 'var(--radius-default)',
                  boxShadow: 'var(--shadow-md)',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'var(--transition-base)',
                  opacity: isDisabled ? 0.6 : 1,
                  position: 'relative' as const,
                  overflow: 'hidden' as const
                }

                if (isDisabled) {
                  return (
                    <div
                      key={itemIndex}
                      style={cardStyle}
                    >
                    {/* Icon */}
                    <div style={{
                      marginBottom: 'var(--spacing-4)',
                      display: 'inline-block',
                      color: 'var(--color-primary-hearst-green)'
                    }}>
                      {item.iconComponent && (
                        <item.iconComponent 
                          size={48} 
                          color="var(--color-primary-hearst-green)"
                        />
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: 'var(--font-size-subsection-title)',
                      lineHeight: 'var(--line-height-subsection-title)',
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: 'var(--font-size-body)',
                      lineHeight: 'var(--line-height-normal)',
                      color: 'var(--color-text-secondary)',
                      margin: 0
                    }}>
                      {item.description}
                    </p>

                    {/* Hover indicator */}
                    {!isDisabled && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: 'var(--gradient-primary)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'var(--transition-base)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleX(1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleX(0)'
                      }}
                      />
                    )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    onClick={(e: any) => {
                      if (item.href === '#') {
                        e.preventDefault()
                      }
                    }}
                    style={cardStyle}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.backgroundColor = 'rgba(46, 204, 113, 0.05)'
                      e.currentTarget.style.borderColor = 'var(--color-primary-hearst-green)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#E0E0E0'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      marginBottom: 'var(--spacing-4)',
                      display: 'inline-block',
                      color: 'var(--color-primary-hearst-green)'
                    }}>
                      {item.iconComponent && (
                        <item.iconComponent 
                          size={48} 
                          color="var(--color-primary-hearst-green)"
                        />
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: 'var(--font-size-subsection-title)',
                      lineHeight: 'var(--line-height-subsection-title)',
                      marginBottom: 'var(--spacing-2)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: 'var(--font-size-body)',
                      lineHeight: 'var(--line-height-normal)',
                      color: 'var(--color-text-secondary)',
                      margin: 0
                    }}>
                      {item.description}
                    </p>

                    {/* Hover indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'var(--gradient-primary)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'var(--transition-base)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(0)'
                    }}
                    />
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <footer style={{
        marginTop: 'var(--spacing-12)',
        paddingTop: 'var(--spacing-5)',
        borderTop: '1px solid #E0E0E0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <div>
          <div style={{
            fontSize: 'var(--font-size-display)',
            color: 'var(--color-primary-hearst-green)',
              fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {siteConfig.totalPowerMW} MW
          </div>
          <div style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)'
          }}>
            Puissance Totale
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 'var(--font-size-display)',
            color: 'var(--color-primary-hearst-green)',
              fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {siteConfig.blocks.length}
          </div>
          <div style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)'
          }}>
            Power Blocks
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 'var(--font-size-display)',
            color: 'var(--color-primary-hearst-green)',
              fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {siteConfig.blocks.reduce((sum, b) => sum + b.numContainers, 0)}
          </div>
          <div style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)'
          }}>
            Total Containers
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 'var(--font-size-display)',
            color: 'var(--color-primary-hearst-green)',
              fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-2)'
          }}>
            {siteConfig.gridConnection.gridVoltageKV} kV
          </div>
          <div style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)'
          }}>
            Grid Voltage
          </div>
        </div>
      </footer>
    </div>
  )
}
