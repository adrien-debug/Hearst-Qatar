'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection côté client vers la vue d'ensemble
    router.replace('/overview')
  }, [router])

  // Afficher un loader pendant la redirection
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-content)',
      color: 'var(--color-text-primary)'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 'var(--font-size-section-title)',
          color: 'var(--color-primary-hearst-green)',
          marginBottom: 'var(--spacing-4)'
        }}>
          Chargement...
        </div>
      </div>
    </div>
  )
}
