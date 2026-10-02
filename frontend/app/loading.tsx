export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white"
    >
      <div className="flex flex-col items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-[#D4AF37]" />
          <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
          Inshongore Decor
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          Loading page...
        </p>
      </div>
    </main>
  );
}
