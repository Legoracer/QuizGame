/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    async redirects() {
      return [
        {
          source: '/game',
          destination: '/',
          permanent: true,
        },

        {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*', // Proxy to Backend
            permanent: true
        }
      ]
    },
  }