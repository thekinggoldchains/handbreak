import { precacheAndRoute } from "workbox-precaching";
import { CacheFirst } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'
);

precacheAndRoute(self.__WB_MANIFEST, {
  additionalManifestEntries: [
    {url: /^https:\/\/s3-dc2\.mspclouds\.com\//},
  ],
});

// Define a estratégia de cache para vídeos externos
const videoCacheStrategy = new CacheFirst({
  cacheName: 'external-videos-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [206]
    })
  ]
})

registerRoute(
  ({ url }) => url.hostname.includes('s3-dc2.mspclouds.com'),
  videoCacheStrategy
)