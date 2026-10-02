
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ContactSectionProps {
  isDark?: boolean;
}

export default function ContactSection({
  isDark = false,
}: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            subject,
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to send your inquiry"
        );
      }

      setSuccessMessage(
        "Thank you. Your inquiry has been sent successfully. We will get back to you soon."
      );

      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send your inquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className={`min-h-screen ${
        isDark
          ? "bg-[#0A0A0A] text-white"
          : "bg-[#F4EEE7] text-[#171717]"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Contact
          </p>

          <h1 className="mt-5 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Let’s create something meaningful together.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#5F554C]">
            Have a question, an idea, or a special occasion
            in mind? Send us a message and tell us what you
            are looking for. We would love to hear from you.
          </p>
        </div>

        {/* Contact + Form */}
        <div className="mt-12 grid gap-8 rounded-[2rem] border border-[#E7D9C7] bg-[#F9F6F2] p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact information */}
          <div className="flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Email
                </p>

                <a
                  href="mailto:hello@inshongoredecor.com"
                  className="mt-2 inline-block text-base text-[#2D2925] transition hover:text-[#D4AF37]"
                >
                  hello@inshongoredecor.com
                </a>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Phone
                </p>

                <a
                  href="tel:+250788000000"
                  className="mt-2 inline-block text-base text-[#2D2925] transition hover:text-[#D4AF37]"
                >
                  +250 788 000 000
                </a>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]">
                  Location
                </p>

                <p className="mt-2 text-base text-[#2D2925]">
                  Kigali, Rwanda
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#E7D9C7] pt-6 lg:mt-0">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7A6C5D]">
                Planning an event?
              </p>

              <p className="mt-3 text-sm leading-7 text-[#5F554C]">
                If you already know the service you need,
                you can submit a booking request directly.
              </p>

              <Link
                href="/booking"
                className="mt-5 inline-block text-xs uppercase tracking-[0.18em] text-[#D4AF37] transition hover:text-[#171717]"
              >
                Go to booking →
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="grid gap-5"
          >
            {/* Success */}
            {successMessage && (
              <div className="border border-green-600/20 bg-green-600/10 px-4 py-4 text-sm leading-6 text-green-700">
                {successMessage}
              </div>
            )}

            {/* Error */}
            {errorMessage && (
              <div className="border border-red-600/20 bg-red-600/10 px-4 py-4 text-sm leading-6 text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Name + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-[#1F1B18]">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Full name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-[#E3D3B8] bg-white px-4 py-3 text-[#171717] placeholder:text-[#7A6C5D] focus:border-[#D4AF37] focus:outline-none"
                />
              </label>

              <label className="text-sm text-[#1F1B18]">
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
                  className="w-full rounded-xl border border-[#E3D3B8] bg-white px-4 py-3 text-[#171717] placeholder:text-[#7A6C5D] focus:border-[#D4AF37] focus:outline-none"
                />
              </label>
            </div>

            {/* Email */}
            <label className="text-sm text-[#1F1B18]">
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
                required
                className="w-full rounded-xl border border-[#E3D3B8] bg-white px-4 py-3 text-[#171717] placeholder:text-[#7A6C5D] focus:border-[#D4AF37] focus:outline-none"
              />
            </label>

            {/* Subject */}
            <label className="text-sm text-[#1F1B18]">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                Subject
              </span>

              <input
                type="text"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="How can we help?"
                required
                className="w-full rounded-xl border border-[#E3D3B8] bg-white px-4 py-3 text-[#171717] placeholder:text-[#7A6C5D] focus:border-[#D4AF37] focus:outline-none"
              />
            </label>

            {/* Message */}
            <label className="text-sm text-[#1F1B18]">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                Message
              </span>

              <textarea
                rows={6}
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Tell us how we can help..."
                required
                className="w-full resize-none rounded-xl border border-[#E3D3B8] bg-white px-4 py-3 text-[#171717] placeholder:text-[#7A6C5D] focus:border-[#D4AF37] focus:outline-none"
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Sending..."
                : "Send Inquiry"}
            </button>
          </form>
        </div>

        {/* Back Home */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}

