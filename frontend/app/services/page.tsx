
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to fetch services"
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

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load services"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Our Services
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Fashion, guidance, and beautiful
          spaces for memorable occasions.
        </h1>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-[1.75rem] border border-[#EADFCB] bg-white p-7 shadow-sm"
              >
                <div className="h-12 w-12 rounded-full bg-[#EADFCB]" />

                <div className="mt-6 h-7 w-2/3 rounded bg-[#EADFCB]" />

                <div className="mt-5 space-y-3">
                  <div className="h-4 rounded bg-[#EADFCB]" />
                  <div className="h-4 rounded bg-[#EADFCB]" />
                  <div className="h-4 w-4/5 rounded bg-[#EADFCB]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-12 border border-red-200 bg-red-50 px-6 py-5">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Services */}
        {!loading &&
          !error &&
          services.length > 0 && (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[1.75rem] border border-[#EADFCB] bg-white p-7 shadow-sm"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-lg text-[#D4AF37]">
                    ✦
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                    {service.category}
                  </p>

                  <h2 className="mt-3 text-2xl font-medium text-[#171717]">
                    {service.name}
                  </h2>

                  <p className="mt-5 text-base leading-8 text-[#4D443D]">
                    {service.description ??
                      "Contact us for more information about this service."}
                  </p>

                  <div className="mt-6 border-t border-[#EADFCB] pt-5">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#8A7E73]">
                      Starting Price
                    </p>

                    <p className="mt-2 text-lg font-medium text-[#171717]">
                      {service.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Empty state */}
        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="mt-12 rounded-[1.75rem] border border-[#EADFCB] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#4D443D]">
                Our services are currently being
                updated.
              </p>
            </div>
          )}

        <div className="mt-12">
          <Link
            href="/"
            className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

