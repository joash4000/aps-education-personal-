const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
let STATIC_FILES = [
    'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800%7CShadows+Into+Light%7CPlayfair+Display:400',
    '/public/vendor/bootstrap/css/bootstrap.min.css',
    '/public/vendor/fontawesome-free/css/all.min.css',
    '/public/vendor/animate/animate.min.css',
    '/public/vendor/simple-line-icons/css/simple-line-icons.min.css',
    '/public/vendor/owl.carousel/assets/owl.carousel.min.css',
    '/public/vendor/owl.carousel/assets/owl.theme.default.min.css',
    '/public/vendor/magnific-popup/magnific-popup.min.css',
    '/public/css/theme.css',
    '/public/css/theme-elements.css',
    '/public/css/theme-blog.css',
    '/public/css/theme-shop.css',
    '/public/vendor/rs-plugin/css/settings.css',
    '/public/vendor/rs-plugin/css/layers.css',
    '/public/vendor/rs-plugin/css/navigation.css',
    '/public/vendor/circle-flip-slideshow/css/component.css',
    '/public/css/skins/default.css',
    '/public/css/custom.css',
    '/public/vendor/modernizr/modernizr.min.js',
    '/public/js/external.js',
    '/public/vendor/jquery/jquery.min.js',
    '/public/vendor/jquery.appear/jquery.appear.min.js',
    '/public/vendor/jquery.easing/jquery.easing.min.js',
    '/public/vendor/jquery.cookie/jquery.cookie.min.js',
    '/public/vendor/popper/umd/popper.min.js',
    '/public/vendor/bootstrap/js/bootstrap.min.js',
    '/public/vendor/common/common.min.js',
    '/public/vendor/jquery.validation/jquery.validate.min.js',
    '/public/vendor/jquery.easy-pie-chart/jquery.easypiechart.min.js',
    '/public/vendor/jquery.gmap/jquery.gmap.min.js',
    '/public/vendor/jquery.lazyload/jquery.lazyload.min.js',
    '/public/vendor/isotope/jquery.isotope.min.js',
    '/public/vendor/owl.carousel/owl.carousel.min.js',
    '/public/vendor/magnific-popup/jquery.magnific-popup.min.js',
    '/public/vendor/vide/jquery.vide.min.js',
    '/public/vendor/vivus/vivus.min.js',
    '/public/js/theme.js',
    '/public/vendor/rs-plugin/js/jquery.themepunch.tools.min.js',
    '/public/vendor/rs-plugin/js/jquery.themepunch.revolution.min.js',
    '/public/vendor/circle-flip-slideshow/js/jquery.flipshow.min.js',
    '/public/js/views/view.home.js',
    '/public/js/custom.js',
    '/public/js/theme.init.js',
    '/'
];

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('[Service Worker] Installing Service Worker ...');
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function(cache) {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll(STATIC_FILES);
        })
    )
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ....');
    event.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('[Service Worker] Removing old cache.');
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .then(function(res) {
            return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
        })
        .catch(function(err) {
            return caches.match(event.request);
        })
    );
});