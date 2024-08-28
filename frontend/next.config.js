module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}:path*`, // Dynamické nastavení API URL
      }
    ]
  },
  images: {
    domains: ['10.0.0.6'],  // Přidání domény do povolených
  },
}
