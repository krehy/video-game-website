
// src/pages/_app.tsx
import '../app/globals.css';
import '@fontsource/teko/700.css';
import Header from '../components/Header';
import BackgroundIcons from '../components/BackgroundIcons';
import { NextUIProvider } from '@nextui-org/react';

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Header />
      <div className="relative p-4" style={{ backgroundColor: '#251f68', minHeight: '100vh', paddingTop: '256px' }}>
        <BackgroundIcons />
        <main className="relative z-10 max-w-4xl mx-auto p-4 bg-black shadow-md rounded" style={{ zIndex: '0', marginTop: '110px', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Component {...pageProps} />
        </main>
      </div>
    </NextUIProvider>
  );
}

export default MyApp;
