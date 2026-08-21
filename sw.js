const CACHE_NAME = 'gymtrack-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

const EXERCISE_FOLDERS = [
  'exercises/Leg_Press',
  'exercises/Goblet_Squat',
  'exercises/Hyperextension_Back_Extension',
  'exercises/Leg_Extensions',
  'exercises/Thigh_Abductor',
  'exercises/Standing_Calf_Raises',
  'exercises/Ab_Crunch_Machine',
  'exercises/Wide-Grip_Lat_Pulldown',
  'exercises/Bent_Over_Two-Dumbbell_Row',
  'exercises/Machine_Bench_Press',
  'exercises/Seated_Dumbbell_Press',
  'exercises/Side_Lateral_Raise',
  'exercises/Reverse_Flyes',
  'exercises/Dead_Bug',
  'exercises/Butterfly',
  'exercises/Triceps_Pushdown_-_Rope_Attachment',
  'exercises/Dumbbell_Bicep_Curl',
  'exercises/Pallof_Press'
];

const IMAGE_ASSETS = EXERCISE_FOLDERS.flatMap(folder => [
  `./${folder}/0.jpg`,
  `./${folder}/1.jpg`
]);

const ALL_ASSETS = [...STATIC_ASSETS, ...IMAGE_ASSETS];

// Instalare sigură: Salvează individual, ignorând fișierele lipsă fără să blocheze aplicația
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ALL_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn(`[SW] Nu s-a putut salva în cache: ${url}`);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// Curățare versiuni vechi de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Servire din Cache, fallback la Rețea
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});