"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Gallery",
    href: "#gallery",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

type NavbarProps = {
  isDark?: boolean;
  onToggle?: () => void;
};

export default function Navbar({ isDark = false, onToggle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleNavClick = () => setIsOpen(false);
  const resolveHref = (href: string, label: string) => {
    if (isHomePage) return href;
    if (label === "Contact") return "/contact";
    return href.startsWith("#") ? `/${href}` : href;
  };

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/90 shadow-sm backdrop-blur-md"
    >
      <nav className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 sm:py-2.5 lg:px-10 lg:py-3">
        <div className="flex items-center justify-between gap-3">
          <a href={isHomePage ? "#home" : "/"} aria-label="Inshongore Bridal Dress home" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Inshongore Bridal Dress"
              width={68}
              height={68}
              priority
              className="h-10 w-10 rounded-full object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
            />
          </a>

          <div className="hidden items-center gap-3 md:flex lg:gap-6">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={resolveHref(item.href, item.label)}
                className="text-[9px] uppercase tracking-[0.12em] text-white/90 transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] lg:text-[10px]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onToggle && <button
              type="button"
              aria-pressed={isDark}
              onClick={onToggle}
              className="hidden rounded-full border border-white/30 bg-white/5 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white transition duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] md:inline-flex"
            >
              {isDark ? "Light" : "Dark"}
            </button>}

            <a
              href={isHomePage ? "#book" : "/booking"}
              className="hidden border border-[#D4AF37] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-[#D4AF37] transition duration-200 hover:-translate-y-0.5 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] md:inline-flex lg:px-4"
            >
              Book Now
            </a>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center flex-col gap-1.5 text-white transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] md:hidden"
            >
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-2 rounded-lg border border-white/10 bg-[#0F0F0F]/95 p-3 shadow-lg backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={resolveHref(item.href, item.label)}
                  onClick={handleNavClick}
                  className="py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/90 transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                >
                  {item.label}
                </a>
              ))}

              <a
                href={isHomePage ? "#book" : "/booking"}
                onClick={handleNavClick}
                className="mt-1 inline-flex w-fit border border-[#D4AF37] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-[#D4AF37] transition duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                Book Now
              </a>

              {onToggle && <button
                type="button"
                aria-pressed={isDark}
                onClick={onToggle}
                className="mt-1 w-fit rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-white transition duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                {isDark ? "Switch to light" : "Switch to dark"}
              </button>}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
