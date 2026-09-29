import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Deliberately minimal. The incremental cache that this config usually wires up
// to R2 or KV exists to serve ISR/SSG revalidation, and this app has neither:
// every dynamic page is getServerSideProps, and the public ones already declare
// their own `Cache-Control: s-maxage=...` (see pages/news.tsx and the two post
// templates), which Cloudflare's CDN honours directly. Adding an R2 cache here
// would be a second, unused caching layer.
//
// If an ISR page is ever added, revisit this - it will silently not cache
// without an incrementalCache configured here.
export default defineCloudflareConfig({});
