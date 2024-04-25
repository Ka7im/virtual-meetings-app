/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    if (process.env.NEXT_OUTPUT_MODE !== 'export' || !config.module) {
      return config
    }
    config.module.rules?.push({
      test: /src\/WSServer/,
      loader: 'ignore-loader',
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
}

export default nextConfig
