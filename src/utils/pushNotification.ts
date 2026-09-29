/**
 * Helper to request Notification permission and fire Web/PWA notifications.
 */

export async function requestPhoneNotificationPermission(): Promise<NotificationPermission> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support desktop or phone push notifications.');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission (likely sandboxed iframe):', err);
    return 'denied';
  }
}

export function getNotificationPermission(): NotificationPermission {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    return Notification.permission;
  } catch {
    return 'denied';
  }
}

export const requestNotificationPermission = requestPhoneNotificationPermission;
export const hasNotificationPermission = (): boolean => getNotificationPermission() === 'granted';

export function sendPushNotification(title: string, options?: { body?: string; tag?: string; icon?: string; requireInteraction?: boolean }) {
  return triggerSystemNotification(title, options?.body || '', options?.icon || '/icon.svg');
}

export function triggerSystemNotification(title: string, body: string, icon = '/icon.svg') {
  if (!('Notification' in window)) return null;

  if (Notification.permission === 'granted') {
    try {
      // Use ServiceWorkerRegistration.showNotification if service worker exists, else standard Notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon,
            badge: icon,
            tag: 'procurement-alert',
            renotify: true,
            vibrate: [200, 100, 200, 100, 400],
          } as NotificationOptions);
        });
      } else {
        return new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'procurement-alert',
        });
      }
    } catch (e) {
      console.warn('Could not launch system notification:', e);
    }
  }
  return null;
}
