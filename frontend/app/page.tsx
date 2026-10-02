"use client";

import { useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import BookingCTA from "@/src/components/sections/BookingCTA";
import ServicesPreview from "@/src/components/sections/ServicesPreview";
import GalleryPreview from "@/src/components/sections/GalleryPreview";
import ContactSection from "@/src/components/sections/ContactSection";
import Footer from "@/src/components/layout/Footer";
import BackToTop from "@/src/components/ui/BackToTop";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <main
      className={
        isDark
          ? "bg-[#0A0A0A] text-white transition-colors duration-300"
          : "bg-[#F5F1EA] text-[#171717] transition-colors duration-300"
      }
    >
      <Navbar isDark={isDark} onToggle={() => setIsDark((value) => !value)} />
      <Hero />
      <About isDark={isDark} />
      <BookingCTA isDark={isDark} />
      <ServicesPreview isDark={isDark} />
      <GalleryPreview isDark={isDark} />
      <ContactSection isDark={isDark} />
      <Footer isDark={isDark} />
      <BackToTop />
    </main>
  );
}
