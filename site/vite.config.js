import { defineConfig } from 'vite';
import { readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function serviceWorker() {
  return {
    name: 'sidecar-ledger-service-worker',
    apply: 'build',
    async writeBundle(options) {
      // Vite removes empty entry chunks after generateBundle. Read the final
      // output directory so addAll never includes a phantom URL that would
      // abort installation of the whole offline shell.
      const outputDir = options.dir;
      const assets = (await readdir(resolve(outputDir, 'assets')))
        .map((file) => `/assets/${file}`)
        .sort();
      const shell = [
        '/',
        '/index.html',
        '/demo/',
        '/demo/index.html',
        '/privacy/',
        '/privacy/index.html',
        '/terms/',
        '/terms/index.html',
        '/404/index.html',
        '/ceramic-sidecars.webp',
        '/sidecar-ledger-card.jpg',
        '/apple-touch-icon.png',
        '/favicon.svg',
        ...assets
      ];
      const cache = `sidecar-ledger-shell-${Array.from(JSON.stringify(shell)).reduce((hash, character) => (Math.imul(31, hash) + character.charCodeAt(0)) >>> 0, 0).toString(36)}`;
      await writeFile(resolve(outputDir, 'sw.js'), `const CACHE = ${JSON.stringify(cache)};
const SHELL = ${JSON.stringify(shell)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match('/'))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
    return response;
  })));
});
`);
    }
  };
}

export default defineConfig({
  root: resolve(import.meta.dirname),
  publicDir: 'public',
  plugins: [serviceWorker()],
  build: {
    outDir: resolve(import.meta.dirname, '../dist/site'),
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        demo: resolve(import.meta.dirname, 'demo/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
        notFound: resolve(import.meta.dirname, '404/index.html')
      }
    }
  }
});
