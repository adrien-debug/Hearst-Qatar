import type { Metadata } from 'next'
import './globals.css'
import './responsive-headers.css'

export const metadata: Metadata = {
  title: 'Hearth Management Platform',
  description: 'Digital Asset Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



