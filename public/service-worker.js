const cacheName = 'v1';

const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(cacheName);
  await cache.put(e.request, resClone);
  return res;
};

const mediaCache = async (e) => {
  if (e.request.method === 'GET' && e.request.url.match(/\.(jpg|jpeg|png|gif|mp4|webm)$/)) {
    const response = await cacheClone(e);
    return response;
  }
  // retorna a resposta original (sem salvar no cache) para qualquer outra requisição
  return fetch(e.request);
};

self.addEventListener('fetch', (e) => {
  e.respondWith(
    mediaCache(e)
      .catch(() => caches.match(e.request))
      .then((res) => res)
  );
});

self.addEventListener('install', () => {
  console.log('service worker installed');
});

self.addEventListener('activate', () => {
  console.log('service worker activated');
});