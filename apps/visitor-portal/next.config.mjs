import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM: tự tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.BACKEND_URL;

const nextConfig = {
  // Fix Next.js workspace root inference warning when multiple lockfiles exist
  // Point tracing to the monorepo root (Museum-Manager)
  outputFileTracingRoot: path.join(__dirname, '..', '..'),
  async rewrites() {
    // Dev proxy: if BACKEND_URL provided, forward /api/* to backend to avoid 404/CORS
    if (!BACKEND_URL) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, 'src'),
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
