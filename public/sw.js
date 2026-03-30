self.addEventListener('install', (event) => {
  console.log('LoadFlow Service Worker Installed');
});

self.addEventListener('fetch', (event) => {
  // Pass-through for now
});
