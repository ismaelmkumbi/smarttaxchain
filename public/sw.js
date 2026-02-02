// Service Worker for TRA Public Audit Portal
// Provides offline functionality and performance optimization

const CACHE_NAME = 'tra-audit-portal-v1';
const urlsToCache = [
  '/',
  '/public-audit-portal',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'feedback-sync') {
    event.waitUntil(syncFeedback());
  }
});

async function syncFeedback() {
  // Handle offline feedback submissions when connection is restored
  const feedbackStore = await getStoredFeedback();
  
  for (const feedback of feedbackStore) {
    try {
      await submitFeedback(feedback);
      await removeFeedbackFromStore(feedback.id);
    } catch (error) {
      console.log('Failed to sync feedback:', error);
    }
  }
}

async function getStoredFeedback() {
  // Implementation would retrieve stored feedback from IndexedDB
  return [];
}

async function submitFeedback(feedback) {
  // Implementation would submit feedback to server
  return fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback)
  });
}

async function removeFeedbackFromStore(id) {
  // Implementation would remove feedback from IndexedDB
  console.log('Removing feedback from store:', id);
}
