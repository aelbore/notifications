import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { NotificationElement } from './src/components/notification/notification-element.js'
import { showNotification, showMultipleNotifications } from './src/utils/notificationManager.js'

// Register the web component
customElements.define('custom-notification', NotificationElement);

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
      <div class="notification-demo">
        <h3>Single Notifications</h3>
        <div class="button-group">
          <button onclick="showNotification('Top Right Notification', 'success', 'top-right')">Top Right</button>
          <button onclick="showNotification('Top Left Notification', 'info', 'top-left')">Top Left</button>
          <button onclick="showNotification('Top Center Notification', 'warning', 'top-center')">Top Center</button>
          <button onclick="showNotification('Bottom Right Notification', 'error', 'bottom-right')">Bottom Right</button>
          <button onclick="showNotification('Bottom Left Notification', 'success', 'bottom-left')">Bottom Left</button>
          <button onclick="showNotification('Bottom Center Notification', 'info', 'bottom-center')">Bottom Center</button>
        </div>
        
        <h3>Multiple Notifications</h3>
        <div class="button-group">
          <button id="showMultipleTopRight">Multiple Top Right</button>
          <button id="showMultipleBottomLeft">Multiple Bottom Left</button>
        </div>
      </div>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

// Make showNotification available globally for onclick handlers
window.showNotification = showNotification;

// Demo multiple notifications
document.querySelector('#showMultipleTopRight').addEventListener('click', () => {
  const notifications = [
    { message: 'First notification', type: 'success' },
    { message: 'Second notification', type: 'warning' },
    { message: 'Third notification', type: 'error' },
    { message: 'Fourth notification', type: 'info' }
  ];
  
  showMultipleNotifications(notifications, 'top-right');
});

document.querySelector('#showMultipleBottomLeft').addEventListener('click', () => {
  const notifications = [
    { message: 'First notification', type: 'info' },
    { message: 'Second notification', type: 'success' },
    { message: 'Third notification', type: 'warning' },
    { message: 'Fourth notification', type: 'error' }
  ];
  
  showMultipleNotifications(notifications, 'bottom-left');
});