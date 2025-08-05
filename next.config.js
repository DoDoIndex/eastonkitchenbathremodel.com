/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.swell.store',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/shop/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/all-products',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/all-products/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/vinyl-planks',
        destination: '/categories/vinyl-planks',
        permanent: true,
      },
      {
        source: '/vinyl-planks/',
        destination: '/categories/vinyl-planks',
        permanent: true,
      },
      {
        source: '/wall-tiles',
        destination: '/categories/wall-tiles',
        permanent: true,
      },
      {
        source: '/wall-tiles/',
        destination: '/categories/wall-tiles',
        permanent: true,
      },
      {
        source: '/floor-tiles',
        destination: '/categories/floor-tiles',
        permanent: true,
      },
      {
        source: '/floor-tiles/',
        destination: '/categories/floor-tiles',
        permanent: true,
      },
      {
        source: '/pool-tiles',
        destination: '/categories/outdoors-and-pools',
        permanent: true,
      },
      {
        source: '/pool-tiles/',
        destination: '/categories/outdoors-and-pools',
        permanent: true,
      },
      {
        source: '/subway-tiles',
        destination: '/categories/subway-tiles',
        permanent: true,
      },
      {
        source: '/subway-tiles/',
        destination: '/categories/subway-tiles',
        permanent: true,
      },
      {
        source: '/mosaic-tiles',
        destination: '/categories/mosaic-tiles',
        permanent: true,
      },
      {
        source: '/mosaic-tiles/',
        destination: '/categories/mosaic-tiles',
        permanent: true,
      },
      {
        source: '/paver-tiles',
        destination: '/categories/pavers',
        permanent: true,
      },
      {
        source: '/paver-tiles/',
        destination: '/categories/pavers',
        permanent: true,
      },
      {
        source: '/slabs',
        destination: '/categories/slabs',
        permanent: true,
      },
      {
        source: '/slabs/',
        destination: '/categories/slabs',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 