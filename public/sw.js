const CACHE_PREFIX = 'big-trip-cache';
const CACHE_VER = 'v15';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const CACHE_PATHS = [
  '/',
  '/index.html',
  '/bundle.js',
  '/css/style.css',
  '/fonts/Montserrat-Bold.woff2',
  '/fonts/Montserrat-ExtraBold.woff2',
  '/fonts/Montserrat-Medium.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/fonts/Montserrat-SemiBold.woff2',
  '/img/header-bg.png',
  '/img/header-bg@2x.png',
  '/img/logo.png',
  '/img/icons/bus.png',
  '/img/icons/check-in.png',
  '/img/icons/drive.png',
  '/img/icons/flight.png',
  '/img/icons/restaurant.png',
  '/img/icons/ship.png',
  '/img/icons/sightseeing.png',
  '/img/icons/taxi.png',
  '/img/icons/train.png',
  '/img/icons/transport.png',
];
const IGNORE_CACHE_PATH = 'sockjs-node';

const handleCacheKey = (key) => {
  if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
    return caches.delete(key);
  }

  return null;
};

const isNotNull = (key) => key !== null;

const createCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  return await cache.addAll(CACHE_PATHS);
};

const updateCache = async () => {
  const keys = await caches.keys();
  return await Promise.all(keys.map(handleCacheKey).filter(isNotNull));
};

const fetchAndCache = async (request) => {
  const response = await fetch(request);

  if (!response ||
    response.status !== HTTP_STATUS_OK ||
    response.type !== RESPONSE_SAFE_TYPE) {
    return response;
  }

  const clonedResponse = response.clone();
  const cache = caches.open(CACHE_NAME);
  await cache.put(request, clonedResponse);

  return response;
};

const respondWithCache = async (request) => {
  const cachedResponse = await caches.match(request);
  return cachedResponse ? cachedResponse : fetchAndCache(request);
};

self.addEventListener('install', (evt) => evt.waitUntil(createCache()));

self.addEventListener('activate', (evt) => evt.waitUntil(updateCache()));

self.addEventListener('fetch', (evt) => {
  const { request } = evt;

  if (request.url.includes(IGNORE_CACHE_PATH)) {
    return;
  }

  evt.respondWith(respondWithCache(request));
});
