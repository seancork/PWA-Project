//PWA - Service Worker
var cacheFiles = [
  '/',
  './index.html',
  './search2.html',
  './styles.css',
  './images/spinner.gif',
  './icons/error.png',
  './images/sun.png',
  './images/sun_small.png',
  './images/very_small_sun.png',
  './icons/search.png',
  './js/menu.js',
  'https://fonts.googleapis.com/css2?family=Tangerine&display=swap'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open("PWACache").then(function(cache) {
      return cache.addAll(cacheFiles); //cache App Shell Files
    })
  );
});



const cachedFetch = request => request.method != 'GET' ? 

  fetch(request) : 
  caches.open("PWACache").then(cache =>
    cache.match(request).then(resp => {
      if(!!resp) {
        return resp;
      } else {
        return fetch(request).then(response => {

          //don't cache movie object 
            if (/\movieObj.js$/.test(request.url) == false) {  
          cache.put(request, response.clone());
             }
         return response

        })
      }
    })
  )

self.addEventListener('fetch', event => event.respondWith(
    cachedFetch(event.request)
  )
)