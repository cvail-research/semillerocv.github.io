/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1) Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    unoptimized: true, // para export estático, pero aquí ya no usamos output: 'export'
  },

  // 2) Flags generales de Next.js
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  //swcMinify: true,

  // Nota: hemos eliminado `output: 'export'` para poder usar i18n
  output: 'export',
  //basePath: "/2025",
  //assetPrefix: "/2025",
  trailingSlash: true,
};

module.exports = nextConfig;
