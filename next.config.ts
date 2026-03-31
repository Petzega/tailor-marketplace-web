import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 1. Aumentamos el límite de peso para permitir la subida de fotos
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // 👇 2. Agregamos Cloudinary para que la tienda pública pueda mostrar las fotos
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;