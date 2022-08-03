importScripts('https://unpkg.com/@gauntface/logger@3.0.13/build/browser-globals.js')

logger.setPrefix('web-push-study/service worker')

self.addEventListener('install', () => {
	self.skipWaiting()
})

self.addEventListener('push', function (event) {
	const options = {
		...{
			title: 'Hello',
			body: 'Thanks for sending this push msg.',
			icon: 'https://simple-push-demo.vercel.app/images/logo-192x192.png',
			badge: 'https://simple-push-demo.vercel.app/images/badge-72x72.png',
			tag: 'web-push-study-notification',
			data: {
				url: 'https://web.dev/push-notifications-overview/',
			},
		}, ...event.data.json()
	}
	logger.log('Push message received.', options)

	event.waitUntil(self.registration.showNotification(options.title, options))
})

const timestamps = {}
self.addEventListener('notificationclick', function (event) {
	logger.log('Notification clicked.', event)
	event.notification.close()

	if (event.notification.timestamp in timestamps) return
	timestamps[event.notification.timestamp] = true

	let clickResponsePromise = Promise.resolve()
	if (event.action) {
		clickResponsePromise = clients.openWindow(event.action)
	} else if (event.notification.data && event.notification.data.url) {
		clickResponsePromise = clients.openWindow(event.notification.data.url)
	}

	event.waitUntil(clickResponsePromise)
})
