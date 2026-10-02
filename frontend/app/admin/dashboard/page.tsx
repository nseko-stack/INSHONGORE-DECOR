
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/src/components/admin/AdminSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type Admin = {
  id: number;
  email: string;
};

type DashboardStats = {
  totalBookings: number;
  pendingBookings: number;
  totalServices: number;
  totalGalleryImages: number;
};

type RecentBooking = {
  id: number;
  customer_name: string;
  event_date: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  service_name: string;
};

type DashboardData = {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Check authentication and load dashboard data.
   */
  useEffect(() => {
    async function loadDashboard() {
      try {
        /*
         * First check whether the admin is logged in.
         */
        const authResponse = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!authResponse.ok) {
          router.replace("/admin/login");
          return;
        }

        const authData = await authResponse.json();

        setAdmin(authData.admin);

        /*
         * Now request the actual dashboard data.
         */
        const dashboardResponse = await fetch(
          `${API_URL}/api/dashboard`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!dashboardResponse.ok) {
          throw new Error(
            "Failed to load dashboard data"
          );
        }

        const dashboardData =
          await dashboardResponse.json();

        setDashboard({
          stats: dashboardData.stats,
          recentBookings:
            dashboardData.recentBookings,
        });
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  /*
   * Logout admin.
   */
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
        "Logout failed:",
        error
      );
    } finally {
      router.replace("/admin/login");
    }
  }

  /*
   * Loading screen.
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          Loading dashboard...
        </p>
      </main>
    );
  }

  /*
   * Error screen.
   */
  if (error || !dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 text-white">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400">
            Dashboard Error
          </p>

          <p className="mt-4 text-sm text-white/50">
            {error || "Unable to load dashboard."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 border border-[#D4AF37] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white lg:flex-row">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {/* HEADER */}
        <header className="border-b border-white/10 bg-[#0F0F0F] px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <Image
                src="/logo.png"
                alt="Inshongore Bridal Dress"
                width={42}
                height={42}
                className="h-10 w-10 rounded-full object-contain"
              />

              <span className="text-xs uppercase tracking-[0.2em]">
                Admin
              </span>
            </div>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-5">
              {/* Logged-in admin */}
              <span className="hidden text-[10px] uppercase tracking-[0.12em] text-white/35 sm:block">
                {admin?.email}
              </span>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-[0.16em] text-white/45 transition hover:text-[#D4AF37]"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="p-5 sm:p-8 lg:p-10">
          {/* INTRO */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Overview
            </p>

            <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
              A clear view of your services, gallery
              content, and customer bookings.
            </p>
          </div>

          {/* STATISTICS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="border border-white/10 bg-[#111111] p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Total Bookings
              </p>

              <p className="mt-4 text-3xl font-medium tracking-tight text-[#D4AF37]">
                {dashboard.stats.totalBookings}
              </p>

              <p className="mt-2 text-xs text-white/35">
                All customer bookings
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Pending Bookings
              </p>

              <p className="mt-4 text-3xl font-medium tracking-tight text-[#D4AF37]">
                {dashboard.stats.pendingBookings}
              </p>

              <p className="mt-2 text-xs text-white/35">
                Awaiting confirmation
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Services
              </p>

              <p className="mt-4 text-3xl font-medium tracking-tight text-[#D4AF37]">
                {dashboard.stats.totalServices}
              </p>

              <p className="mt-2 text-xs text-white/35">
                Active services
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Gallery Images
              </p>

              <p className="mt-4 text-3xl font-medium tracking-tight text-[#D4AF37]">
                {dashboard.stats.totalGalleryImages}
              </p>

              <p className="mt-2 text-xs text-white/35">
                Published images
              </p>
            </div>
          </section>

          {/* RECENT BOOKINGS */}
          <section className="mt-8 border border-white/10 bg-[#111111]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-medium">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Latest customer requests
                </p>
              </div>

              <Link
                href="/admin/bookings"
                className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.16em] text-white/35">
                    <th className="px-6 py-4 font-medium">
                      Client
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Service
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Event Date
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentBookings.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-xs text-white/30"
                      >
                        No bookings yet.
                      </td>
                    </tr>
                  ) : (
                    dashboard.recentBookings.map(
                      (booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-white/90">
                            {booking.customer_name}
                          </td>

                          <td className="px-6 py-4 text-sm text-white/50">
                            {booking.service_name}
                          </td>

                          <td className="px-6 py-4 text-sm text-white/50">
                            {new Date(
                              booking.event_date
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                booking.status ===
                                "CONFIRMED"
                                  ? "border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                                  : booking.status ===
                                    "COMPLETED"
                                  ? "border border-green-500/30 bg-green-500/10 text-green-400"
                                  : booking.status ===
                                    "CANCELLED"
                                  ? "border border-red-500/30 bg-red-500/10 text-red-400"
                                  : "border border-white/10 bg-white/5 text-white/50"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

