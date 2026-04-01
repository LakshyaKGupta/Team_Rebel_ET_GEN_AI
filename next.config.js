/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PostgreSQL is used in production (Vercel/Supabase).
  // better-sqlite3 is NOT listed here — it's a native module incompatible with Vercel serverless.
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude native SQLite bindings from the bundle entirely
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3', '@prisma/adapter-better-sqlite3', '@prisma/adapter-libsql', '@libsql/client');
    }
    return config;
  },
};

module.exports = nextConfig;
