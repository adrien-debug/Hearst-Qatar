import { redirect } from 'next/navigation'

// Redirection côté serveur vers la vue d'ensemble
export default function HomePage() {
  redirect('/overview')
}
