import Link from "next/link";
import WhatsAppIcon from "@/src/components/ui/WhatsAppIcon";
import InstagramIcon from "@/src/components/ui/InstagramIcon";

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
          <div className="mt-4 flex gap-3">
            <a
              href="https://wa.me/250788282693?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              title="Chat with us on WhatsApp"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#25D366]/60 text-[#25D366] transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white ${theme.link}`}
            >
              <WhatsAppIcon />
            </a>
            <a
              href="https://www.instagram.com/inshongoredecor/"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Instagram"
              title="Follow us on Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1306C]/60 text-[#E1306C] transition hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white"
            >
              <InstagramIcon />
            </a>
          </div>
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
