// ============================================================
// LoadingSpinner.tsx
// Simple animated spinner — same coffee brown color as mobile.
// Used as a full-screen loader during async operations.
// ============================================================

interface Props { fullScreen?: boolean; }

export const LoadingSpinner: React.FC<Props> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F9F9F9] z-[100]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin-slow" />
      </div>
    );
  }
  return <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin-slow" />;
};
