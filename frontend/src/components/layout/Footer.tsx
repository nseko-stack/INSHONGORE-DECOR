import Link from "next/link";

type FooterProps = {
  isDark?: boolean;
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Book an event", href: "/booking" },
];

export default function Footer({ isDark = false }: FooterProps) {
  const theme = isDark
    ? {
        footer: "border-white/10 bg-[#0A0A0A] text-white/65",
        heading: "text-white",
        muted: "text-white/40",
        link: "text-white/60 hover:text-[#D4AF37]",
        divider: "border-white/10",
      }
    : {
        footer: "border-[#E7DED0] bg-[#F5F1EA] text-[#413C35]",
        heading: "text-[#171717]",
        muted: "text-[#756D62]",
        link: "text-[#5F554C] hover:text-[#A98216]",
        divider: "border-[#E7DED0]",
      };

  return (
    <footer className={`border-t ${theme.footer}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Link href="/" className={`text-lg font-medium tracking-wide ${theme.heading}`}>
            Inshongore Decor
          </Link>
          <p className={`mt-4 max-w-xs text-sm leading-6 ${theme.muted}`}>
            Wedding fashion, consultations, and thoughtful event decoration for meaningful celebrations.
          </p>
        </div>

        <div>
          <h2 className={`text-[10px] uppercase tracking-[0.2em] ${theme.heading}`}>
            Explore
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={`transition ${theme.link}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={`text-[10px] uppercase tracking-[0.2em] ${theme.heading}`}>
            Get in touch
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href="mailto:hello@inshongoredecor.com" className={`transition ${theme.link}`}>
                hello@inshongoredecor.com
              </a>
            </li>
            <li>
              <a href="tel:+250788282693"  className={`transition ${theme.link}`}>
                +250788282693
              </a>
            </li>
            <li className={theme.muted}>Kigali, Rwanda</li>
          </ul>
        </div>

        <div>
          <h2 className={`text-[10px] uppercase tracking-[0.2em] ${theme.heading}`}>
            Connect
          </h2>
          <p className={`mt-4 text-sm leading-6 ${theme.muted}`}>
            Follow our latest work and get in touch about your event.
          </p>
          <a
            href="https://wa.me/250788282693"
            target="how can we help you?"
            rel="noreferrer"
            className={`mt-4 inline-flex border border-[#D4AF37]/50 px-4 py-2 text-xs uppercase tracking-[0.14em] transition hover:border-[#D4AF37] hover:text-[#D4AF37] ${theme.link}`}
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className={`border-t ${theme.divider}`}>
        <div className={`mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10 ${theme.muted}`}>
          <p>© {new Date().getFullYear()} Inshongore Decor. All rights reserved.</p>
          <p>Made for celebrations worth remembering.</p>
        </div>
      </div>
    </footer>
  );
}
