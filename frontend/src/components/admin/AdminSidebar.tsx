
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "HOME",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: "SERV",
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: "IMG",
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: "BOOK",
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: "MSG",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      window.location.href =
        "/admin/login";
    }
  }

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-[#101010] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex min-h-0 flex-col lg:min-h-screen">
        <div className="border-b border-white/10 px-5 py-4 lg:px-6 lg:py-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Inshongore Bridal Dress"
              width={54}
              height={54}
              className="h-12 w-12 rounded-full object-contain"
            />

            <div>
              <p className="text-xs uppercase tracking-[0.22em]">
                Inshongore
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.26em] text-[#D4AF37]">
                Bridal Dress
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-x-auto px-3 py-3 lg:space-y-1 lg:px-4 lg:py-7">
          <p className="mb-3 hidden px-3 text-[10px] uppercase tracking-[0.25em] text-white/30 lg:mb-4 lg:block">
            Management
          </p>

          <div className="flex gap-2 lg:block lg:space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-w-max items-center gap-2 border-b-2 px-3 py-2.5 text-xs transition lg:flex lg:gap-3 lg:border-b-0 lg:border-l-2 lg:py-3 lg:text-sm ${
                    isActive
                      ? "border-[#D4AF37] bg-white/[0.06] text-[#D4AF37]"
                      : "border-transparent text-white/50 hover:border-[#D4AF37] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-[8px] font-medium tracking-[0.08em] text-current/70 lg:h-7 lg:w-7 lg:text-[9px]">
                    {item.icon}
                  </span>

                  <span>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="my-7 hidden border-t border-white/10 lg:block" />

          <p className="mb-4 hidden px-3 text-[10px] uppercase tracking-[0.25em] text-white/30 lg:block">
            Account
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-sm text-white/50 transition hover:border-[#D4AF37] hover:bg-white/[0.04] hover:text-white lg:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center text-[9px] tracking-[0.08em]">
              EXIT
            </span>

            <span>Logout</span>
          </button>
        </nav>

        <div className="hidden border-t border-white/10 p-5 lg:block">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.18em] text-white/40 transition hover:text-[#D4AF37]"
          >
            View public site
          </Link>

          <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-white/25">
            Admin Portal
          </p>
        </div>
      </div>
    </aside>
  );
}

