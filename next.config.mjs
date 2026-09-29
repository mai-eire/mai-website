import path from 'node:path';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Gives `next dev` the same Cloudflare bindings the deployed Worker gets - most
// importantly a local D1 database, so lib/prisma.ts takes one code path in
// development and production rather than two. Without this, `next dev` has no
// DB binding and every query throws.
//
// This is also why the config is .mjs: initOpenNextCloudflareForDev is an ESM
// export and has to be called synchronously as the config loads.
initOpenNextCloudflareForDev();

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
    ];
  },

  images: {
    unoptimized: true,
  },

  // Emotion (via MUI) ships separate builds behind the `edge-light`/`workerd`
  // export conditions. Next's build trace resolves with the Node condition, so
  // it never copies those files - and then the Workers bundler, which *does*
  // resolve with `workerd`, asks for a file that was left behind and the build
  // fails on unresolved imports. The whole scope is traced rather than the three
  // packages named in the first error: those edge-light builds import further
  // @emotion packages that were left behind for the same reason, so naming them
  // one at a time just moves the error along.
  // Prisma's workerd client loads its query compiler with
  // `await import("./query_compiler_fast_bg.wasm?module")`. The `?module`
  // suffix is a Workers convention: the Cloudflare bundler turns it into a
  // WebAssembly.Module, which is the only way to get one on Workers, because
  // compiling wasm from bytes at runtime is blocked there. Webpack has no idea
  // what `?module` means and fails the build on it.
  //
  // So the import is handed to the Cloudflare bundler instead - but resolved to
  // an absolute path first. Left relative, it would be re-resolved against each
  // emitted server chunk's own directory (`.next/server/pages/admin/...`)
  // rather than against the file that wrote it, and every one of those lookups
  // misses. The absolute path never outlives the build: the Cloudflare bundler
  // inlines the wasm into the Worker in the very next step.
  webpack: (config, { isServer }) => {
    if (!isServer) return config;

    const existing = Array.isArray(config.externals)
      ? config.externals
      : [config.externals].filter(Boolean);

    return {
      ...config,
      externals: [
        ...existing,
        ({ context, request }, callback) => {
          if (!request || !request.endsWith('.wasm?module')) return callback();
          const file = path.resolve(context, request.slice(0, -'?module'.length));
          return callback(null, `module ${file}?module`);
        },
      ],
    };
  },

  outputFileTracingIncludes: {
    '/**': ['node_modules/@emotion/**'],
  },
};

export default nextConfig;
