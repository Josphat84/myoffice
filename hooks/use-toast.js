// hooks/use-toast.js
'use client';

import * as React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// Toast component (moved inside the same file)
function Toast({ title, description, variant = 'default', onClose }) {
  const toastVariants = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  };

  const toastIcons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle,
  };

  const Icon = toastIcons[variant] || toastIcons.default;

  // Simple cn function for class merging
  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div
      className={cn(
        'border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-full duration-300',
        toastVariants[variant]
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm mt-1">{description}</div>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-md p-1 hover:bg-gray-100 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const ToastContext = React.createContext({
  toast: () => {},
});

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}