module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://10.0.0.193:8000/api/:path*' // Redirects API requests to your backend
      }
    ]
  },
  images: {
    domains: ['10.0.0.193'],  // Add the IP address or domain serving the images
  },
}
