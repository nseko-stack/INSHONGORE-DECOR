import Link from "next/link";

const steps = [
  "Share your vision",
  "We design the concept",
  "We style the experience",
];

type BookingCTAProps = {
  isDark?: boolean;
};

export default function BookingCTA({ isDark = false }: BookingCTAProps) {
  return (
    <section id="book" className={isDark ? "bg-[#111111] py-16 text-white sm:py-20 lg:py-24" : "bg-[#F2EDE5] py-16 text-[#171717] sm:py-20 lg:py-24"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div
          className={
            isDark
              ? "overflow-hidden rounded-[2rem] border border-[#D4AF37]/30 bg-gradient-to-r from-[#171717] via-[#1D1D1D] to-[#0F0F0F] p-8 shadow-2xl shadow-black/40 sm:p-12 lg:p-16"
              : "overflow-hidden rounded-[2rem] border border-[#D9CDBA] bg-gradient-to-r from-[#FBF7F2] via-[#F4EDE4] to-[#EEE3D5] p-8 shadow-2xl shadow-[#B7A694]/20 sm:p-12 lg:p-16"
          }
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
                Book Your Event
              </p>

              <h2 className="mt-5 max-w-2xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Let’s create a celebration that feels deeply personal.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-current/75">
                Whether it’s intimate and romantic or grand and immersive, we help shape
                the details that make your day feel distinctly yours.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-7 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
                >
                  Book a Consultation
                </Link>

                <Link
                  href="/services"
                  className={
                    isDark
                      ? "inline-block border border-white/20 px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      : "inline-block border border-[#B89E73] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#171717] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }
                >
                  View Services
                </Link>
              </div>
            </div>

            <div
              className={
                isDark
                  ? "rounded-[1.5rem] border border-white/10 bg-black/20 p-6"
                  : "rounded-[1.5rem] border border-[#D9CDBA] bg-white/60 p-6"
              }
            >
              <p className="text-xs uppercase tracking-[0.28em] text-current/60">
                Our Process
              </p>

              <div className="mt-6 space-y-5">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 text-sm font-semibold text-[#D4AF37]">
                      {index + 1}
                    </div>
                    <p className="text-sm uppercase tracking-[0.18em] text-current/80">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
