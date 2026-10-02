import Image from "next/image";
import { siteContent } from "@/src/content/siteContent";

type AboutProps = {
  isDark?: boolean;
};

export default function About({ isDark = false }: AboutProps) {
  return (
    <section
      id="about"
      className={
        isDark
          ? "bg-[#0A0A0A] py-16 text-white sm:py-20 lg:py-24"
          : "bg-[#F5F1EA] py-16 text-[#171717] sm:py-20 lg:py-24"
      }
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:gap-12 sm:px-6 md:grid-cols-2 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#D9D2C8] bg-[#F1E9DF] shadow-2xl shadow-black/10">
          <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[520px]">
            <Image
              src="/decor.jpg"
              alt="Decor and styling details"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/10 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            About Us
          </p>

          <h2 className="max-w-xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            We turn meaningful moments into a complete visual story.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-current/75">
            {siteContent.about.description}
          </p>

          <p className="mt-5 max-w-xl text-base leading-8 text-current/75">
            {siteContent.about.secondaryDescription}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {siteContent.about.highlights.map((item) => (
              <div key={item.label} className="border-l border-[#D4AF37]/60 pl-4">
                <div className="text-3xl font-semibold text-[#D4AF37]">{item.value}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-current/60">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
