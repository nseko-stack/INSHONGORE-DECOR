import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inshongoredecor.com"),
  title: {
    default: "Inshongore Decor | Wedding Styling & Event Decoration in Rwanda",
    template: "%s | Inshongore Decor",
  },
  description:
    "Luxury wedding styling, bridal rental, consultations, and event decoration for meaningful celebrations in Rwanda.",
  keywords: [
    "Inshongore Decor",
    "wedding styling Rwanda",
    "event decoration Kigali",
    "bridal dress rental Rwanda",
    "wedding planner Rwanda",
    "special event decor Kigali",
  ],
  openGraph: {
    title: "Inshongore Decor",
    description:
      "Wedding styling, consultations, and event decoration for memorable celebrations in Rwanda.",
    url: "https://inshongoredecor.com",
    siteName: "Inshongore Decor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inshongore Decor",
    description:
      "Luxury wedding styling, bridal looks, and event decor for meaningful celebrations in Rwanda.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
