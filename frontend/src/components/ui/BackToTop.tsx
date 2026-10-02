"use client";

export default function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37] bg-[#0A0A0A] text-xl text-[#D4AF37] shadow-lg transition hover:bg-[#D4AF37] hover:text-black"
    >
      ↑
    </button>
  );
}
