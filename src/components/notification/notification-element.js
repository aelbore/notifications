import { NOTIFICATION_PLACEMENTS } from '../../utils/constants.js';

export class NotificationElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'placement'];
  }

  connectedCallback() {
    this.render();
    this.position();
    this.show();
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'placement') {
        this.position();
      }
      this.render();
    }
  }

  get type() {
    return this.getAttribute('type') || 'info';
  }

  get placement() {
    return this.getAttribute('placement') || 'top-right';
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.position();
    });
    this.resizeObserver.observe(document.body);
  }

  getNotificationsInSamePlacement() {
    const notifications = document.querySelectorAll('custom-notification');
    return Array.from(notifications).filter(n => n.getAttribute('placement') === this.placement);
  }

  position() {
    const placement = this.placement;
    const notifications = this.getNotificationsInSamePlacement();
    const index = notifications.indexOf(this);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const spacing = isMobile ? 60 : 70;
    const basePosition = NOTIFICATION_PLACEMENTS[placement];
    
    // Apply base position
    Object.entries(basePosition).forEach(([key, value]) => {
      this.style[key] = value;
    });

    // Calculate offset based on placement
    if (placement.startsWith('top-')) {
      this.style.top = `${parseInt(basePosition.top) + (index * spacing)}px`;
    } else if (placement.startsWith('bottom-')) {
      this.style.bottom = `${parseInt(basePosition.bottom) + (index * spacing)}px`;
    }

    // Mobile adjustments
    if (isMobile) {
      this.style.left = '16px';
      this.style.right = '16px';
      this.style.transform = 'none';
    }
  }

  render() {
    const styles = `
      :host {
        position: fixed;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        width: min(calc(100% - 40px), 400px);
      }

      :host([placement^="top-"]) {
        transform: translateY(-100%);
      }

      :host([placement^="bottom-"]) {
        transform: translateY(100%);
      }

      :host([placement$="-right"]) {
        transform: translateX(100%);
      }

      :host([placement$="-left"]) {
        transform: translateX(-100%);
      }

      :host([placement$="-center"]) {
        transform: translate(-50%, -100%);
      }

      :host(.show) {
        opacity: 1;
        transform: translate(0, 0);
      }

      :host([placement$="-center"].show) {
        transform: translate(-50%, 0);
      }

      @media (max-width: 768px) {
        :host {
          width: auto;
          transform: translateY(100%) !important;
        }

        :host(.show) {
          transform: translateY(0) !important;
        }

        .notification {
          margin: 0 !important;
          border-radius: 12px !important;
        }
      }

      @media (max-width: 380px) {
        :host {
          font-size: 14px;
        }

        .notification {
          padding: 12px 16px !important;
        }

        .close-button {
          padding: 8px !important;
        }
      }

      .notification {
        padding: clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px);
        border-radius: clamp(8px, 2vw, 12px);
        color: white;
        font-size: clamp(14px, 3.5vw, 16px);
        font-family: system-ui, -apple-system, sans-serif;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        word-break: break-word;
        display: flex;
        align-items: center;
        gap: 12px;
        backdrop-filter: blur(8px);
      }

      .content {
        flex: 1;
        min-width: 0;
        line-height: 1.5;
      }

      :host([type="success"]) .notification {
        background: rgba(76, 175, 80, 0.95);
      }

      :host([type="error"]) .notification {
        background: rgba(244, 67, 54, 0.95);
      }

      :host([type="warning"]) .notification {
        background: rgba(255, 152, 0, 0.95);
      }

      :host([type="info"]) .notification {
        background: rgba(33, 150, 243, 0.95);
      }

      ::slotted(*) {
        color: white;
        margin: 0;
        font-size: inherit;
      }

      .close-button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        cursor: pointer;
        padding: 6px;
        opacity: 0.8;
        transition: all 0.2s;
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .close-button:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
      }

      @media (hover: none) {
        .close-button {
          opacity: 1;
          padding: 8px;
          width: 32px;
          height: 32px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        :host,
        .close-button {
          transition: none;
        }
      }

      @media (prefers-color-scheme: dark) {
        .notification {
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="notification">
        <div class="content">
          <slot></slot>
        </div>
        <button class="close-button" aria-label="Close notification">×</button>
      </div>
    `;

    this.shadowRoot.querySelector('.close-button').addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss();
    });
  }

  show() {
    requestAnimationFrame(() => {
      this.classList.add('show');
    });

    setTimeout(() => {
      this.dismiss();
    }, 2000);
  }

  dismiss() {
    this.classList.remove('show');
    
    setTimeout(() => {
      this.remove();
      this.repositionAll();
    }, 300);
  }

  repositionAll() {
    const notifications = this.getNotificationsInSamePlacement();
    notifications.forEach(notification => {
      notification.position();
    });
  }
}