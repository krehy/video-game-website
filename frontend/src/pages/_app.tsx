// src/pages/_app.tsx
import '../app/globals.css';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div style={{backgroundColor:'red'}} className="mx-auto p-4">
        <main className="max-w-4xl mx-auto p-4 bg-black shadow-md rounded">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
