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

self.addEventListener('fetch', function(event) {
  if (/\.jpg$|.png$|.webp$/.test(event.request.url)) {
    const url = event.request.url.replace(/(\.[\w\d_-]+)$/i, getMediaQuality() + '$1');
    event.respondWith(fetch(url));
  }
});
