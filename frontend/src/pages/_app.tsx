// pages/_app.tsx
import '../app/globals.css';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
