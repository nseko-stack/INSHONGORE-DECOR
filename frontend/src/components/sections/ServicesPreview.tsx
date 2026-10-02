
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: string;
  is_active: boolean;
};

type ServicesPreviewProps = {
  isDark?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function ServicesPreview({
  isDark = false,
}: ServicesPreviewProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          `${API_URL}/api/services`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ?? "Failed to fetch services"
          );
        }

        setServices(
          data.services ?? data.data ?? []
        );
      } catch (error) {
        console.error(
          "Failed to fetch services:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const previewServices = services.slice(0, 4);

  return (
    <section
      id="services"
      className={
        isDark
          ? "bg-[#0A0A0A] py-16 text-white sm:py-20 lg:py-24"
          : "bg-[#F5F1EA] py-16 text-[#171717] sm:py-20 lg:py-24"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Our Services
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Thoughtful styling for every unforgettable occasion.
            </h2>
          </div>

          {services.length > 4 && (
            <Link
              href="/services"
              className={
                isDark
                  ? "inline-block border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  : "inline-block border border-[#D4AF37]/50 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#171717] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }
            >
              View More
            </Link>
          )}
        </div>

        {loading ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={
                  isDark
                    ? "h-80 animate-pulse rounded-[1.75rem] bg-[#171717]"
                    : "h-80 animate-pulse rounded-[1.75rem] bg-[#E6DCCB]"
                }
              />
            ))}
          </div>
        ) : previewServices.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {previewServices.map((service) => (
              <div
                key={service.id}
                className={
                  isDark
                    ? "group rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-[#1B1B1B] to-[#101010] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60"
                    : "group rounded-[1.75rem] border border-[#E6DCCB] bg-gradient-to-b from-[#FBF8F4] to-[#F0E5D7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60"
                }
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-lg text-[#D4AF37]">
                  ✦
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  {service.category}
                </p>

                <h3 className="mt-3 text-2xl font-medium text-current">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="mt-5 text-base leading-8 text-current/70">
                    {service.description}
                  </p>
                )}

                <div className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Learn more
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[1.75rem] border border-[#E6DCCB] bg-[#FBF8F4] px-6 py-12 text-center">
            <p className="text-sm text-[#4D443D]">
              Our services are being updated.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

