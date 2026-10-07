import React, { useEffect, useState } from 'react';
import { toast, type ToastMessage } from '@/lib/utils/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss toast after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/80 text-rose-200';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/80 text-amber-200';
      case 'info':
      default:
        return 'border-primary/30 bg-surface/90 text-foreground';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start justify-between gap-3 animate-slide-up transition-all ${getBorderColor(
            t.type
          )}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(t.type)}
            <div className="space-y-0.5">
              {t.title && <h4 className="text-xs font-bold font-mono tracking-wider">{t.title}</h4>}
              <p className="text-xs leading-relaxed">{t.message}</p>
            </div>
          </div>

          <button
            onClick={() => dismissToast(t.id)}
            className="p-1 rounded text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
