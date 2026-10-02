
"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Controls the loading state of the login button
  const [loading, setLoading] = useState(false);

  // Stores login errors
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          // Important:
          // Allows the browser to receive/store the HttpOnly cookie
          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      console.log("Login successful:", data);

      // Login succeeded → go to admin dashboard
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex">
          <Image
            src="/decor.jpg"
            alt="Elegant event decoration"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#0A0A0A]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Inshongore Bridal Dress"
                width={68}
                height={68}
                className="h-16 w-16 rounded-full object-contain"
              />

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-white">
                  Inshongore
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Bridal Dress
                </p>
              </div>
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                Administration
              </p>

              <h1 className="text-5xl font-medium leading-[1.05] tracking-tight">
                Shape every detail with intention.
              </h1>

              <p className="mt-6 max-w-sm text-base leading-8 text-white/65">
                Manage services, showcase your work, and keep track of customer
                bookings from one considered workspace.
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              © {new Date().getFullYear()} Inshongore Bridal Dress
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center border-l border-white/5 bg-[#0F0F0F] px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <Image
                src="/logo.png"
                alt="Inshongore Bridal Dress"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-contain"
              />

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white">
                  Inshongore
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Bridal Dress
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                Admin Portal
              </p>

              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/50">
                Sign in to manage your services, images, and inquiries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/65"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF37] focus:bg-white/[0.07]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] uppercase tracking-[0.2em] text-white/65"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.12em] text-[#D4AF37]/75 transition hover:text-[#D4AF37]"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF37] focus:bg-white/[0.07]"
                />
              </div>

              {/* Login error */}
              {error && (
                <div className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-[#D4AF37] bg-[#D4AF37] px-4 py-4 text-xs uppercase tracking-[0.22em] text-black transition hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.16em] text-white/30">
              Authorized personnel only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

