/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // For Firebase Auth profile images
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Experimental features for better compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  // Fix for undici and other Node.js modules in client builds
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        events: false,
      }
    }

    // Completely ignore undici and other problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false,
      'firebase-admin': false,
    }

    // More aggressive external handling
    const originalExternals = config.externals || []
    config.externals = [
      ...originalExternals,
      ({ context, request }, callback) => {
        if (request === 'undici' || request.includes('undici')) {
          return callback(null, 'commonjs undici')
        }
        if (
          request === 'firebase-admin' ||
          request.includes('firebase-admin')
        ) {
          return callback(null, 'commonjs firebase-admin')
        }
        callback()
      },
    ]

    // Handle ES modules correctly and ignore problematic modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

    return config
  },
}

module.exports = nextConfig
