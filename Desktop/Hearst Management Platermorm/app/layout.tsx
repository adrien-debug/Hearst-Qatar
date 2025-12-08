import type { Metadata, Viewport } from 'next'
import './globals.css'
import './responsive-headers.css'
import ResponsiveRefresh from '@/components/layout/ResponsiveRefresh'

export const metadata: Metadata = {
  title: 'Hearth Management Platform',
  description: 'Digital Asset Management Platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ResponsiveRefresh />
        {children}
      </body>
    </html>
  )
}



