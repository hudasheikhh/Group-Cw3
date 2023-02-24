var cacheName = "lessons-v1";
var cacheFiles = [
    "index.html",
    "Style.css",
    "product.js",
    "lessonstore.webmanifest",
    "images",
];

self.addEventListener("install", (e) => { //self here refers to the window object in JavaScript(thebrowserwindow).
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("[Service Worker] Caching all the files");
            return cache.addAll(cacheFiles);
        })
    );
});

// cache the third-party files
self.addEventListener("fetch", function(e) { //FetchEvent.respondWith method intercepts all fetch request
    e.respondWith(
        caches.match(e.request).then(function(r) {
            // Download the file if it is not in the cache,
            return (
                r ||
                fetch(e.request).then(function(response) { // fetch(e.request) if the file is not in the cache, we use another fetch request to download it.               
                    // add the new file to cache
                    return caches.open(cacheName).then(function(cache) { //   caches.open(cacheName).then stores the response in the cache so it will be available there next time it is requested.
                        cache.put(e.request, response.clone()); //response.clone its for third party file being cloned one by one as per the request and added to cache.
                        return response;
                    });
                })
            );
        })
    );
});