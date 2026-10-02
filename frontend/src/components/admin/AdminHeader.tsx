
"use client";

import Image from "next/image";

export default function AdminHeader() {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-white/10 bg-[#0F0F0F] px-5 py-4 text-white sm:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <Image
          src="/logo.png"
          alt="Inshongore Bridal Dress"
          width={44}
          height={44}
          className="h-10 w-10 rounded-full object-contain"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.22em]">Inshongore</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
            Bridal Dress
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
          Administration
        </p>
        <p className="mt-1 text-sm text-white/45">Content workspace</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white/90">Admin</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            Administrator
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/10 text-sm font-medium text-[#D4AF37]">
          A
        </div>
      </div>
    </header>
  );
}

