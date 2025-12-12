import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Page 3D en plein écran sans layout
  const is3DPage = router.pathname === '/substation-3d' 
    || router.pathname === '/substation-3d-test'
    || router.pathname === '/substation-3d-auto'
    || router.pathname === '/substation-3d-spline'
    || router.pathname === '/substation-3d-test-simple';
  
  if (is3DPage) {
    return <Component {...pageProps} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex pt-[60px] flex-1">
        <Sidebar />
        <main className="flex-1 ml-[180px] pt-8 px-8 pb-12 bg-white overflow-x-hidden">
          <Component {...pageProps} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

