
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