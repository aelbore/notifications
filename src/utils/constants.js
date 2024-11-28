export const NOTIFICATION_TYPES = ['success', 'error', 'warning', 'info'];

export const NOTIFICATION_PLACEMENTS = {
  'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
  'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
  'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
  'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
  'top-center': { top: '20px', left: '50%', bottom: 'auto', right: 'auto', transform: 'translateX(-50%)' },
  'bottom-center': { bottom: '20px', left: '50%', top: 'auto', right: 'auto', transform: 'translateX(-50%)' }
};