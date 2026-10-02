import Image from 'next/image'; // Make sure this import is here!
import { siteContent } from "@/src/content/siteContent";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/decor.jpg"
          alt="Elegant wedding backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="max-w-4xl">
          <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] sm:mb-6 sm:text-xs sm:tracking-[0.35em]">
            {siteContent.hero.eyebrow}
          </p>

          <h1 className="text-[2.8rem] leading-[0.9] tracking-[-0.05em] text-white sm:text-6xl lg:text-[6rem]">
            Moments
            <br />
            Worth
            <br />
            <strong className="font-bold">Remembering.</strong>
          </h1>

          <p className="mt-6 max-w-xl text-[11px] leading-7 tracking-[0.08em] text-white sm:text-xs sm:leading-relaxed">
            {siteContent.hero.description}
          </p>

          <div className="mt-8 sm:mt-10">
            <a
              href="/services"
              className="inline-block border border-white/40 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black sm:px-7 sm:py-4 sm:text-xs"
            >
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
