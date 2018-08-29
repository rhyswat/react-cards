/*
 Cookbook-based service worker.
 Based on https://serviceworke.rs/strategy-network-or-cache.html
 
 A more verbose example: https://googlechrome.github.io/samples/service-worker/basic/

 NB: DO NOT CHANGE THE NAME OF THIS FILE
*/

import _ from 'lodash';
import localforage from 'localforage';
import SyncAPI from './api/SyncAPI';
import { StorageKey } from './helpers/BackgroundSync';

// fetch timeouts in ms
const NETWORK_TIMEOUT = 5000;

// cache names
const PRECACHE = 'deck-of-cards-precache';
const RUNTIME = 'deck-of-cards-runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'static/css/*',
  'static/js/*',
  'static/media/*',
  '*.json',
  'favicon.ico',
];

// A list of URL patterns for runtime caching.
// We decide whether to go cache-first of network-first
// in the 'fetch' event handler.
const RUNTIME_CACHE_FIRST_URLS = [
  /^https:\/\/deckofcardsapi\.com\/static\/img\/.+\.png$/
]

const RUNTIME_NETWORK_FIRST_URLS = [
  /^https:\/\/deckofcardsapi\.com\/api\/deck\/.+\/draw/
]

/**
 * The install handler takes care of precaching the resources we always need.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

/**
 * The activate handler takes care of cleaning up old caches.
 */
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

/**
 * Handle synchronisation to the back end.
 * This will be triggered when we are online and 
 * when we COME BACK ONLINE after being offline.
 */
self.addEventListener('sync', (event) => {

  if (event.tag !== 'hand-of-cards') {
    return;
  }

  let api = new SyncAPI();
  let sequence = localforage.getItem(StorageKey).then((deck) => {
    console.log('sync from local storage:', deck);
    return api.sync(deck);
  }).then(response => {
    console.log('sync server response:', response);
  }).catch(err => {
    console.warn('ah shucks', err);
  });

  event.waitUntil(sequence);
});

/**
 * Fetch -- this is where the cache vs. network logic goes
 * based on the event request URL.
 * 
 * Note that URLs that don't interact with the cache
 * are ignored and fetched from the network as normal
 * by the browser, including potential 404s.
 */
self.addEventListener('fetch', (evt) => {

  if (isCacheFirst(evt.request.url)) {
    return evt.respondWith(
      fromCache(evt.request).catch(() => {
        return fromNetwork(evt.request).then(response => {
          return putInCache(evt.request, response);
        });
      })
    );
  }

  if (isNetworkFirst(evt.request.url)) {
    return evt.respondWith(
      fromNetwork(evt.request).then(response => {
        return putInCache(evt.request, response);
      }).catch(() => {
        return fromCache(evt.request);
      })
    );
  }
})

// ---- HELPERS -----

function isCacheFirst(url) {
  return _.filter(RUNTIME_CACHE_FIRST_URLS, p => p.test(url)).length > 0;
}

function isNetworkFirst(url) {
  return _.filter(RUNTIME_NETWORK_FIRST_URLS, p => p.test(url)).length > 0;
}

function fromNetwork(request, timeout) {
  timeout = timeout || NETWORK_TIMEOUT;
  return new Promise((resolve, reject) => {
    let timeoutId = setTimeout(reject, timeout);

    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
}

function fromCache(request) {
  return fromPrecache(request).catch(() => {
    return fromRuntimeCache(request)
  });
}

function fromPrecache(request) {
  return caches.open(PRECACHE)
    .then((cache) => {
      return cache.match(request);
    }).then((matching) => {
      return matching || Promise.reject('no match in precache');
    });
}

function fromRuntimeCache(request) {
  return caches.open(RUNTIME)
    .then((cache) => {
      return cache.match(request);
    }).then((matching) => {
      return matching || Promise.reject('no match in runtinme cache');
    });
}

function putInCache(request, response) {
  return caches.open(RUNTIME).then(cache => {
    return cache.put(request, response.clone()).then(() => {
      console.log('cached', request.url);
      return response;
    });
  });
}