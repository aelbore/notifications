export class Notification {
  constructor(message, type = 'info') {
    this.message = message;
    this.type = type;
    this.element = null;
    this.timeout = null;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = `notification notification-${this.type}`;
    this.element.textContent = this.message;
    
    return this;
  }

  show() {
    document.body.appendChild(this.element);
    
    // Trigger animation
    setTimeout(() => {
      this.element.classList.add('show');
    }, 10);

    // Auto dismiss after 2 seconds
    this.timeout = setTimeout(() => {
      this.dismiss();
    }, 2000);

    return this;
  }

  dismiss() {
    if (!this.element) return;
    
    this.element.classList.remove('show');
    
    // Wait for fade out animation before removing
    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 300);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}