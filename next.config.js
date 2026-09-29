/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // The newsroom used to have three listing pages. There is one now, and
      // the type is a query parameter - but /statements and /articles are the
      // addresses people were given, so they keep working.
      { source: '/statements', destination: '/news?type=STATEMENT', permanent: false },
      { source: '/articles', destination: '/news?type=ARTICLE', permanent: false },
    ]
  },

  // Add rewrites for your API routes if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 