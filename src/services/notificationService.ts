export class NotificationService {
  static requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        resolve(false);
        return;
      }

      if (Notification.permission === 'granted') {
        resolve(true);
        return;
      }

      if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          resolve(permission === 'granted');
        });
      } else {
        resolve(false);
      }
    });
  }

  static sendNotification(title: string, options?: NotificationOptions): Notification | null {
    if (Notification.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ff6b35"/><text x="50" y="60" font-size="60" text-anchor="middle" fill="white" font-weight="bold">⏰</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ff6b35"/></svg>',
      ...options,
    });

    // Play sound
    this.playSound();

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  static playSound(): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
}
