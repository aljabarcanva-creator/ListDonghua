import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-lg rounded-lg py-3 px-4 flex items-center gap-3 min-w-[300px] transition-colors">
        <div className="bg-gray-900 dark:bg-slate-900 rounded-full p-0.5">
             <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors">{message}</span>
      </div>
    </div>
  );
};