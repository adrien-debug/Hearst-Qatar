'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-content)',
      color: 'var(--color-text-primary)',
      padding: 'var(--spacing-8)'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-display)',
          color: 'var(--color-text-primary)',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--spacing-4)'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: 'var(--font-size-section-title)',
          color: 'var(--color-text-primary)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)'
        }}>
          Page non trouvée
        </h2>
        <p style={{
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-6)',
          lineHeight: 'var(--line-height-relaxed)'
        }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.push('/overview')}
            style={{
              padding: 'var(--spacing-4) var(--spacing-6)',
              backgroundColor: 'var(--color-primary-hearst-green)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-default)',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-body)',
              transition: 'var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Aller à l'accueil
          </button>
          <Link
            href="/overview"
            style={{
              padding: 'var(--spacing-4) var(--spacing-6)',
              backgroundColor: 'transparent',
              color: 'var(--color-primary-hearst-green)',
              border: '2px solid var(--color-primary-hearst-green)',
              borderRadius: 'var(--radius-default)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-body)',
              transition: 'var(--transition-base)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(46, 204, 113, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Vue d'ensemble
          </Link>
        </div>
      </div>
    </div>
  )
}
