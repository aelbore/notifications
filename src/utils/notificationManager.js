import { NOTIFICATION_TYPES, NOTIFICATION_PLACEMENTS } from './constants.js';

export const showNotification = (message, type = 'info', placement = 'top-right') => {
  if (!NOTIFICATION_TYPES.includes(type)) {
    console.warn(`Invalid notification type: ${type}. Defaulting to 'info'`);
    type = 'info';
  }

  if (!NOTIFICATION_PLACEMENTS[placement]) {
    console.warn(`Invalid placement: ${placement}. Defaulting to 'top-right'`);
    placement = 'top-right';
  }

  const notification = document.createElement('custom-notification');
  notification.setAttribute('type', type);
  notification.setAttribute('placement', placement);
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.textContent = message;
  document.body.appendChild(notification);
  return notification;
};

export const showMultipleNotifications = (notifications, placement = 'top-right') => {
  notifications.forEach((notification, index) => {
    setTimeout(() => {
      showNotification(notification.message, notification.type, placement);
    }, index * 200); // Stagger the notifications
  });
};