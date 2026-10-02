
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: string;
  is_active: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

        setErrorMessage(
          "Unable to load services. Please try again."
        );
      } finally {
        setLoadingServices(false);
      }
    }

    fetchServices();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: customerName,
            phone,
            email,
            service_id: Number(serviceId),
            event_date: eventDate,
            location,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Failed to submit booking"
        );
      }

      setSuccessMessage(
        "Your booking request has been submitted successfully. We will contact you soon."
      );

      setCustomerName("");
      setPhone("");
      setEmail("");
      setServiceId("");
      setEventDate("");
      setLocation("");
      setNotes("");
    } catch (error) {
      console.error(
        "Booking submission error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex text-xs uppercase tracking-[0.16em] text-white/45 transition hover:text-[#D4AF37]"
        >
          Back to home
        </Link>

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Book Now
        </p>

        <h1 className="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Reserve your next unforgettable occasion.
        </h1>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-[#111111] p-6 sm:p-8">
          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-4 text-sm text-green-400">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-5"
          >
            {/* Name + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Name
                </span>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:outline-none"
                />
              </label>

              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Phone
                </span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="07XXXXXXXX"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:outline-none"
                />
              </label>
            </div>

            {/* Email + Service */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:outline-none"
                />
              </label>

              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Service
                </span>

                <select
                  value={serviceId}
                  onChange={(event) =>
                    setServiceId(event.target.value)
                  }
                  required
                  disabled={loadingServices || services.length === 0}
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {loadingServices
                      ? "Loading services..."
                      : services.length === 0
                        ? "No services available"
                        : "Select a service"}
                  </option>

                  {services
                    .filter((service) => service.is_active)
                    .map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {service.price}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            {/* Event date + location */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Event date
                </span>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </label>

              <label className="text-sm text-white/80">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Event location
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Venue or area"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:outline-none"
                />
              </label>
            </div>

            {/* Notes */}
            <label className="text-sm text-white/80">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                Additional details
              </span>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tell us about your event or any special requests."
                rows={4}
                className="w-full resize-y rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || loadingServices || services.length === 0}
              className="mt-2 w-full rounded-xl border border-[#D4AF37] bg-[#D4AF37] px-5 py-4 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit booking request"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

