// middleware.js — Vercel Edge Middleware
// Runs at the edge network before incoming requests to protected photo directories.
// Purpose:
//   1. Block automated scrapers and harvesters from bulk downloading member & event photos.
//   2. Prevent unauthorized third-party websites from hotlinking images directly onto their pages.

export const config = {
  // Only protect photo folders, NEVER static code bundles in /assets/
  matcher: [
    '/team-photos/:path*',
    '/eventspictures/:path*',
  ],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const referer = request.headers.get('referer') || '';
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Scraper / Harvester bot blocking
  const SCRAPER_BOTS = [
    'scrapy',
    'python-requests',
    'curl/',
    'wget/',
    'httrack',
    'webcopier',
    'sitesnagger',
    'teleportpro',
    'webstripper',
    'offline',
    'libwww',
    'java/',
    'go-http',
    'petalbot',
    'semrushbot',
    'ahrefsbot',
    'mj12bot',
    'dotbot',
    'blexbot',
    'ia_archiver',
    'bytespider',
    'gptbot',
    'ccbot',
  ];

  const uaLower = userAgent.toLowerCase();
  const isScraper = SCRAPER_BOTS.some((bot) => uaLower.includes(bot));

  if (isScraper) {
    return new Response('Access Denied: Automated photo scraping is not permitted.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 2. Hotlink protection: check Referer header if present
  // (Empty referer is allowed for direct browser access, privacy-mode browsers, bookmarking)
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererHost = refererUrl.hostname.toLowerCase();
      const currentHost = url.hostname.toLowerCase();

      // Allow if referer is same host
      const isSameHost = refererHost === currentHost;

      // Allow if referer is local development
      const isLocalhost = refererHost === 'localhost' || refererHost === '127.0.0.1';

      // Allow any Vercel domain (production or preview branch deployments)
      const isVercel = refererHost.endsWith('.vercel.app') || refererHost === 'vercel.app';

      // Allow known legitimate domains (e.g., custom domain or college portals)
      const isCustomDomain = refererHost.includes('vitap') || refererHost.includes('acm');

      if (!isSameHost && !isLocalhost && !isVercel && !isCustomDomain) {
        // Block external hotlinking
        return new Response('Hotlinking not permitted — © ACM VIT-AP Student Chapter', {
          status: 403,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch {
      // Unparseable referer — allow through gracefully
    }
  }

  // Allow standard request to proceed
  return undefined;
}
