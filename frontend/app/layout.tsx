import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inshongore Bridal Dress",
  description: "Luxury wedding and event styling by Inshongore Bridal Dress",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
