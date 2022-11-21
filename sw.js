const cacheVersion = 'v1.1.0'

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheVersion);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheVersion);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/battletech-roller/',
      '/battletech-roller/index.html',
      '/battletech-roller/simple.css',
      '/battletech-roller/style.css',
      '/battletech-roller/main.js',
      '/battletech-roller/presets.js',
      '/battletech-roller/img/d6-1.svg',
      '/battletech-roller/img/d6-2.svg',
      '/battletech-roller/img/d6-3.svg',
      '/battletech-roller/img/d6-4.svg',
      '/battletech-roller/img/d6-5.svg',
      '/battletech-roller/img/d6-6.svg',
      '/battletech-roller/img/icon/android-chrome-192x192.png',
      '/battletech-roller/img/icon/android-chrome-512x512.png',
      '/battletech-roller/img/icon/apple-touch-icon.png',
      '/battletech-roller/img/icon/favicon-16x16.png',
      '/battletech-roller/img/icon/favicon-32x32.png',
      '/battletech-roller/img/icon/favicon.ico',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/battletech-roller/img/icon/apple-touch-icon.png',
    })
  );
});
