self.addEventListener('install', function(event) {
  console.log("Service worker successfully installed")
});

function getMediaQuality() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
      return "_medium";
    }

    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return "_low";
      case '3g':
        return "_medium";
      case '4g':
        return "_high";
      default:
        return "_low";
    }
}

function saveToCache(request, response) {
  if(!response || response.status !== 200 || response.type !== 'basic') {
    return response;
  }

  const responseToCache = response.clone();

  caches.open("imageQualityCache")
    .then(function(cache) {
      cache.put(request, responseToCache);
    });

  return response;
}

self.addEventListener('fetch', function(event) {
  if (/\.jpg$|.png$|.webp$/.test(event.request.url)) {
    const quality = getMediaQuality();
    const url = event.request.url.replace(/(\.[\w\d_-]+)$/i, getMediaQuality() + '$1');

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }

          return fetch(url).then(saveToCache.bind(this, event.request))
      })
    );
  }
});
