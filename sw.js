
const cacheKey = 'mySampleCacheKey_v2';

// Specify allowed cache keys
const cacheAllowList = ['mySampleCacheKey_v2'];

// installation
self.addEventListener('install', (event) => {
    console.log('Worker is installing.');
    event.waitUntil(
        caches.open(cacheKey)
            .then((cache) => {
                console.log('cache opened');
                // Add all the assets in the array to the 'myCache'
                // `Cache` instance for later use.
                return cache.addAll([
                    '/', // from root folder
                    '/main.js', // from root folder
                    '/css/style.css', // everything from /css folder
                ]);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Worker is activating.');

    // Get all the currently active `Cache` instances.
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                // Delete all caches that aren't in the allow list:
                return Promise.all(
                    keys.map((key) => {
                        if (!cacheAllowList.includes(key)) {
                            return caches.delete(key);
                        }
                    }));
            })
    );
});


// CODE: always-hit-cache
// self.addEventListener('fetch', (event) => {
//     console.log('funcational event: fetch');
//     console.log('TEST: ', event.request);

//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 // cache hit ~ return response
//                 if (response) {
//                     return response;
//                 }
//                 return fetch(event.request)
//                     //fallback to cache anyway
//                     .catch(() => caches.match(event.request));
//             })
//     );
// });

/**
 * Issue in above approach (CODE: always-hit-cache - commented above):
 * we are telling our service worker to respond always from cache storage.
 * but what if we update any file on server e.g. added new content in HTML/added new CSS styles etc.
 * even though we never gonnna hit the server as we always respnding through cache.
 * 
 * One Solution (CODE: always-hit-network-first-else-cache):
 * we are telling our service worker to respond from server.
 * but when offline respond from cache instead.
 */

// CODE: always-hit-network-first-else-cache
self.addEventListener('fetch', (event) => {
    console.log('funcational event: fetch');
    console.log('TEST: ', event.request);

    event.respondWith(
        fetch(event.request)
            .then(response => {
                console.log('caching response.');
                const cacheResponse = response.clone();
                caches.open(cacheKey)
                    .then(cache => cache.put(event.request, cacheResponse));
                return response;
            })
            //fallback to cache
            .catch(() => caches.match(event.request))
    );
});
