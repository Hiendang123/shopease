import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 sm:px-6 sm:py-4 rounded-2xl shadow-2xl border flex items-center gap-4 bg-slate-900 border-slate-700 text-white`}
            id={`toast-${toast.id}`}
          >
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20" id={`toast-icon-success-${toast.id}`}>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20" id={`toast-icon-error-${toast.id}`}>
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20" id={`toast-icon-info-${toast.id}`}>
                <Info className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex-1">
              <p className="text-sm font-bold text-white leading-normal" id={`toast-text-${toast.id}`}>{toast.text}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-450 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-0.5 shrink-0"
              aria-label="Close notification"
              id={`toast-close-${toast.id}`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
