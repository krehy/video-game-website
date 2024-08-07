module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://10.0.0.115:8000/api/:path*' // Přesměruje API požadavky na váš backend
        }
      ]
    }
  }
  