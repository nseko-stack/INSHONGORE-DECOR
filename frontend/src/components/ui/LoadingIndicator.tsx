interface LoadingIndicatorProps {
  label: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingIndicator({
  label,
  fullScreen = false,
  className = "",
}: LoadingIndicatorProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-current/20 border-t-[#D4AF37]"
      />
      <span>{label}</span>
    </>
  );

  if (fullScreen) {
    return (
      <main
        role="status"
        aria-live="polite"
        aria-label={label}
        className={`flex min-h-screen items-center justify-center gap-4 bg-[#0A0A0A] text-sm text-white/60 ${className}`}
      >
        {content}
      </main>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-3 text-sm text-white/50 ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-current/20 border-t-[#D4AF37]"
      />
      <span>{label}</span>
    </div>
  );
}
