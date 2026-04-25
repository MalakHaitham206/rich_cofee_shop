// ============================================================
// ConfirmationModal.tsx
// Delete / action confirmation modal — mirrors the mobile
// app's ConfirmationModal component exactly in concept:
//   • dark overlay
//   • white card with icon, title, message
//   • cancel (outlined) + confirm (danger/primary) buttons
// ============================================================

import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<Props> = ({
  isOpen, title, message,
  confirmText = 'Confirm', cancelText = 'Cancel',
  onConfirm, onCancel, isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50 backdrop-blur-[2px] p-6" onClick={onCancel}>
      <div className="bg-surface rounded-[24px] p-8 w-full max-w-[400px] shadow-lg animate-modalScale relative" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} color="#ED5151" />
        </div>
        <h3 className="text-center text-[20px] font-semibold text-text-main mb-2">{title}</h3>
        <p className="text-center text-text-muted mb-8 text-[15px] leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button 
            className="flex-1 border border-[#E5E7EB] text-text-main py-3 px-6 rounded-xl font-semibold text-sm bg-white hover:bg-[#F3F4F6] transition-colors" 
            onClick={onCancel} disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className="flex-1 bg-error text-white py-3 px-6 rounded-xl font-semibold text-sm hover:brightness-90 transition-all" 
            onClick={onConfirm} disabled={isLoading}
          >
            {isLoading ? 'Please wait…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
