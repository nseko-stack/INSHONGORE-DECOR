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
      className={`z-50 w-full ${
        isHomePage
          ? "absolute top-0 left-0"
          : "relative bg-[#0A0A0A]"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
        <div className="flex items-center justify-between gap-3">
          <a href={isHomePage ? "#home" : "/"} aria-label="Inshongore Bridal Dress home" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Inshongore Bridal Dress"
              width={68}
              height={68}
              priority
              className="h-14 w-14 rounded-full object-contain sm:h-[4.25rem] sm:w-[4.25rem]"
            />
          </a>

          <div className="hidden items-center gap-4 md:flex md:gap-8 lg:gap-10">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={resolveHref(item.href, item.label)}
                className="text-[10px] uppercase tracking-[0.18em] text-white/90 transition-colors duration-300 hover:text-[#D4AF37] sm:text-xs"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onToggle && <button
              type="button"
              aria-pressed={isDark}
              onClick={onToggle}
              className="hidden rounded-full border border-white/30 bg-white/5 px-2 py-2 text-[9px] uppercase tracking-[0.16em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:px-3 sm:py-2 sm:text-[10px] md:inline-flex"
            >
              {isDark ? "Light" : "Dark"}
            </button>}

            <a
              href={isHomePage ? "#book" : "/booking"}
              className="hidden border border-[#D4AF37] px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black sm:px-5 sm:py-3 sm:text-[10px] md:inline-flex"
            >
              Book Now
            </a>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex flex-col gap-1.5 text-white md:hidden"
            >
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0F0F0F]/90 p-4 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-3">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={resolveHref(item.href, item.label)}
                  onClick={handleNavClick}
                  className="text-xs uppercase tracking-[0.2em] text-white/90 transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  {item.label}
                </a>
              ))}

              {onToggle && <button
                type="button"
                aria-pressed={isDark}
                onClick={onToggle}
                className="mt-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
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
