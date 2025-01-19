import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextUIProvider } from '@nextui-org/react';
import Header from '../components/Header';
import BackgroundIcons from '../components/BackgroundIcons';
import Footer from '../components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import '../app/globals.css';
import '@fontsource/teko/700.css';
import Script from 'next/script';
import { SocketProvider } from '../contexts/SocketContext';
import { GameProvider } from '../contexts/GameContext';
import Partners from '../components/Footer/Partners';

declare global {
  interface Window {
    gtag: (
      command: string,
      trackingId: string,
      config?: Record<string, any>
    ) => void;
    sssp: {
      getAds: (ads: Array<{ zoneId: number, id: string, width: number, height: number }>) => void;
    };
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isYazyRoute = router.pathname.startsWith('/yazy'); // Kontrola, zda jsme na /yazy stránkách

  useEffect(() => {
    document.documentElement.lang = 'cs';
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', 'G-Z8V6EDBQ1W', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    // Načtení hlavního skriptu pro reklamy ze Seznamu
    const script = document.createElement('script');
    script.src = 'https://ssp.seznam.cz/static/js/ssp.js';
    script.async = true;
    script.onload = () => {
      if (window.sssp) {
        window.sssp.getAds([{
          "zoneId": 347257,
          "id": "ssp-zone-347257",
          "width": 728,
          "height": 90
        }]);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const Content = (
    <div className="relative p-4" style={{ backgroundColor: '#251f68', minHeight: '100vh', paddingTop: '256px' }}>
      <BackgroundIcons />
      <main className="relative z-10 max-w-4xl mx-auto p-4 bg-black shadow-md rounded" style={{ zIndex: '0', marginTop: '110px', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
        
      </main>
      
      <Partners></Partners>
    </div>
  );

  return (
    <NextUIProvider>
      <Header />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-Z8V6EDBQ1W`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z8V6EDBQ1W', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {isYazyRoute ? (
        <SocketProvider>
          <GameProvider>
            {Content}
            
          </GameProvider>
        </SocketProvider>
      ) : (
        Content
      )}
      
      <Footer />

      {/* Reklama pevně připevněná ke spodní části obrazoky */}
      <div
        id="ssp-zone-347257"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '728px',
          maxWidth: '100%',
          height: '90px',
          boxSizing: 'border-box',
          zIndex: 1000,
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      ></div>

      <style jsx>{`
        @media (max-width: 768px) {
          #ssp-zone-347257 {
            width: 320px;
            height: 50px;
          }
        }
      `}</style>
    </NextUIProvider>
  );
}

export default MyApp;
