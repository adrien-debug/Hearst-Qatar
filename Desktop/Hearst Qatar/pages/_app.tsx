import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

function Layout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isExpanded } = useSidebar();
  
  // Page 3D en plein écran sans layout
  const is3DPage = router.pathname === '/substation-3d' 
    || router.pathname === '/substation-3d-test'
    || router.pathname === '/substation-3d-auto'
    || router.pathname === '/substation-3d-spline'
    || router.pathname === '/substation-3d-test-simple';
  
  if (is3DPage) {
    return <Component {...pageProps} />;
  }

  const leftMargin = isExpanded 
    ? 'ml-0 md:ml-[180px]' 
    : 'ml-0 md:ml-[80px]';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex pt-[60px] flex-1">
        <Sidebar />
        <main className={`flex-1 w-full ${leftMargin} pt-4 sm:pt-8 px-4 sm:px-6 md:px-8 pb-12 md:pb-20 bg-white overflow-x-hidden transition-all duration-300`}>
          <Component {...pageProps} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <SidebarProvider>
      <Layout {...props} />
    </SidebarProvider>
  );
}

