/**
 * Event-Driven Toast Notification System
 */

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(type: ToastMessage['type'], message: string, title?: string, duration = 4000): void {
    const toast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      message,
      duration,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  public success(message: string, title = 'Success', duration = 4000): void {
    this.notify('success', message, title, duration);
  }

  public error(message: string, title = 'Error', duration = 5000): void {
    this.notify('error', message, title, duration);
  }

  public info(message: string, title = 'Information', duration = 4000): void {
    this.notify('info', message, title, duration);
  }

  public warning(message: string, title = 'Warning', duration = 4000): void {
    this.notify('warning', message, title, duration);
  }
}

export const toast = new ToastManager();
