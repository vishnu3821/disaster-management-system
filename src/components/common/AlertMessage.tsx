import React, { useState, useEffect } from 'react';
import { XCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertProps {
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

const AlertMessage: React.FC = () => {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  // Listen for custom events to show alerts
  useEffect(() => {
    const showAlert = (e: CustomEvent<AlertProps>) => {
      setAlert({
        message: e.detail.message,
        type: e.detail.type || 'info',
        timeout: e.detail.timeout || 5000
      });
    };

    window.addEventListener('showAlert' as any, showAlert);
    
    return () => {
      window.removeEventListener('showAlert' as any, showAlert);
    };
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, alert.timeout);
      
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!alert) return null;

  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  }[alert.type || 'info'];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[alert.type || 'info'];

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className={`${bgColor} border-l-4 p-4 rounded shadow-md`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm">{alert.message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setAlert(null)}
              className="inline-flex text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to show alerts from anywhere in the app
export const showAlert = (props: AlertProps) => {
  const event = new CustomEvent('showAlert', { detail: props });
  window.dispatchEvent(event);
};

export default AlertMessage;