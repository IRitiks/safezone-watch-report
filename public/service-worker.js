
// Service worker for SafeZone PWA

const CACHE_NAME = 'safezone-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-new-reports') {
    event.waitUntil(syncNewReports());
  }
});

// Function to sync reports that were made offline
async function syncNewReports() {
  const dbName = 'safezone-offline-db';
  const storeName = 'pending-reports';
  
  // This is a placeholder for IndexedDB operations
  // In a real implementation, you would:
  // 1. Open IndexedDB
  // 2. Get all pending reports
  // 3. Send them to your API
  // 4. Delete them from IndexedDB once confirmed
  
  console.log('Syncing reports that were saved offline');
  
  // Placeholder for notification after sync
  self.registration.showNotification('SafeZone', {
    body: 'Your offline reports have been submitted.',
    icon: '/icons/icon-192x192.png'
  });
}
