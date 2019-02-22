/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received: "${event.data.text()}"');
  const title = 'Clean Air Cluj';
  var i = 'images/logo@2x.png', t = event.data.text(), n = (parseInt(t));
  if (!isNaN(n)) { if (n>=500) n=499; i = 'images/' + Math.floor(n/50) + '.png'; }
  const options = {
    body: t,
    icon: i,
    badge: 'images/air-bad.png'
    /* , "vibrate": [200, 100, 200, 100, 200, 100, 400], "tag": "request", "actions": [ { "action": "yes", "title": "Yes", "icon": "images/y.png" },{ "action": "no", "title": "No", "icon": "images/.." } ] */ 
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://cluj.ml')
  );
});

const version = "1.16.0";
const cacheName = 'cleanair-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/js/app.js',
        '/images/logo.png',
        '/images/exhaust.svg',
        '/images/molecule.svg',
'/images/icons/0.svg','/images/icons/1.svg','/images/icons/2.svg','/images/icons/3.svg','/images/icons/4.svg','/images/icons/5.svg','/images/icons/6.svg','/images/icons/7.svg','/images/icons/8.svg','images/icons/9.svg','/images/icons/clear-night.svg','/images/icons/partly-cloudy-night.svg','/images/icons/partly-cloudy-day.svg','/images/icons/partly-cloudy.svg','/images/icons/rain.svg','/images/icons/snow.svg','/images/icons/wind.svg','/images/icons/clear-day.svg','/images/icons/cloudy.svg','/images/icons/fog.svg',
        '/images/feelslike.svg',
        '/images/icon-umberella.png', '/images/dewpoint.svg', '/images/waterdrop.svg', '/images/cloudcover.svg', '/images/visibility.svg', '/images/sunblock.svg', '/images/windy.svg', '/images/icon-wind.png', '/images/icon-compass.png', '/images/pressure.svg', '/images/o3-cloud.svg', 
        '/images/bell.svg',
        '/images/silent.svg'
      ])
          .then(() => self.skipWaiting());
    })
  );
});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});	

/* self.addEventListener('fetch', event => {
  console.log(event.request.url);    
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
}); */

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'api';
  console.log ('request.url='+e.request.url);
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(cacheName).then(function(cache) { 
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.open(cacheName)
      .then(cache => cache.match(e.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(e.request);
      })
    );
  }
}); 

/* '/images/0.png', '/images/1.png', '/images/2.png', '/images/3.png', '/images/4.png', '/images/5.png', '/images/6.png', '/images/7.png', '/images/8.png', '/images/9.png' */