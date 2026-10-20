import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmationModal, closeConfirmation, language } = useApp();

  if (!confirmationModal || !confirmationModal.isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={closeConfirmation}
    >
      <div
        className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 max-w-md w-full shadow-2xl relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeConfirmation}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {confirmationModal.title}
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {confirmationModal.message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={closeConfirmation}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={confirmationModal.onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-colors"
          >
            {confirmationModal.confirmLabel || (language === 'ar' ? 'تأكيد الحذف' : 'Confirm Action')}
          </button>
        </div>
      </div>
    </div>
  );
};
