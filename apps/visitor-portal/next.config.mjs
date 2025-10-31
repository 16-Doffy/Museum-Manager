import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM: tự tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Proxy API calls to avoid CORS during development
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.BACKEND_API_ORIGIN?.replace(/\/$/, '') + '/api/v1/:path*' || 'http://localhost:3001/api/v1/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, 'src'),
      '@museum-manager/ui-core/client': path.resolve(__dirname, 'src/shims/ui-core-client.tsx'),
    };

    // Exclude server-side packages that shouldn't be bundled in client-side code
    config.resolve.fallback = {
      ...config.resolve.fallback,
      express: false,
      connect: false,
      batch: false,
    };

    // Add "use client" directive to ui-core components that use React hooks
    config.module.rules.push({
      test: /node_modules\/@museum-manager\/ui-core\/dist\/es\/components\/ui\/theme-provider\/vite\/theme-provider\.js$/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: '^',
          replace: '"use client";\n',
          flags: 'g',
        },
      },
    });

    return config;
  },
};

export default nextConfig;
