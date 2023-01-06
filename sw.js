
const cacheKey = 'mySampleCacheKey';
 
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