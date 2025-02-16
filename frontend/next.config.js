module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Dynamické nastavení API URL
      },
    ];
  },
  images: {
    domains: ['127.0.0.1', '10.0.0.12', 'localhost', 'scontent.cdninstagram.com', 'instagram.fprg1-1.fna.fbcdn.net'], // Přidání domén do povolených
  },
  env: {
    // Přidání dalších proměnných prostředí, pokud je potřeba
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  reactStrictMode: true, // Povolení přísného režimu Reactu
  trailingSlash: true,
};
