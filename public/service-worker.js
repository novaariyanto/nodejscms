const CACHE_NAME = "firstpwa";
const offlineUrl = "/no_internet.html";

var urlsToCache = [
  "/",
  "/no_internet.html",
  "/file/tenor.gif",
  "/css/materialize.css",
  "/css/materialize.min.css",
  "/js/jquery.min.js",
  "/js/materialize.js",
  "/js/readdb.js",
  "/js/simpleslider.min.js",
  "/db.js",
  "/logo.png"
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("fetch", function(event) {

if(event.request.mode === 'navigate' || (event.request.method === 'GET'  && event.request.headers.get('accept').includes('text/html'))){
    event.respondWith(
        fetch(event.request.url).catch(error =>{
            return caches.match(offlineUrl);
        })
    );
}else{
  
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
          }
   
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        })
    );
}
  });
  
  self.addEventListener("active",function(event){
      event.waitUntil(
          caches.keys().then(function(cacheNames){
              return Promise.all(
                  cacheNames.map(function(cacheName){
                      if(cacheName != CACHE_NAME){
                          console.log("Serviceworker: cache "+cacheName+" dihapus !");
                          return caches.delete(cacheName);
                      }
                  })
              )
          })
      )
  });

