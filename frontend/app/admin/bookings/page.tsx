
"use client";

import { useEffect, useMemo, useState } from "react";

import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import BookingTable from "@/src/components/admin/bookings/BookingTable";
import BookingDetails from "@/src/components/admin/bookings/BookingDetails";

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

interface Booking {
  id: number;
  customer: string;
  phone: string;
  email: string;
  service: string;
  eventDate: string;
  location: string;
  status: BookingStatus;
  notes?: string;
}

interface ApiBooking {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  service_id: number;
  service_name?: string;
  event_date: string;
  location: string;
  notes: string | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function formatStatus(
  status: ApiBooking["status"]
): BookingStatus {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "CONFIRMED":
      return "Confirmed";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-RW", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(
    []
  );

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Failed to fetch bookings"
        );
      }

      const apiBookings: ApiBooking[] =
        data.bookings ?? data.data ?? [];

      const formattedBookings: Booking[] =
        apiBookings.map((booking) => ({
          id: booking.id,
          customer: booking.customer_name,
          phone: booking.phone,
          email: booking.email ?? "",
          service:
            booking.service_name ??
            `Service #${booking.service_id}`,
          eventDate: formatDate(
            booking.event_date
          ),
          location: booking.location,
          status: formatStatus(
            booking.status
          ),
          notes: booking.notes ?? "",
        }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error(
        "Failed to fetch bookings:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        booking.customer
          .toLowerCase()
          .includes(searchValue) ||
        booking.service
          .toLowerCase()
          .includes(searchValue) ||
        booking.location
          .toLowerCase()
          .includes(searchValue);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [bookings, statusFilter, search]);

  async function handleStatusChange(
    id: number,
    status: BookingStatus
  ) {
    const apiStatus: Record<
      BookingStatus,
      string
    > = {
      Pending: "PENDING",
      Confirmed: "CONFIRMED",
      Completed: "COMPLETED",
      Cancelled: "CANCELLED",
    };

    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: apiStatus[status],
          }),
        }
      );

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to update booking status"
        );
      }

      setBookings(
        (currentBookings) =>
          currentBookings.map((booking) =>
            booking.id === id
              ? {
                  ...booking,
                  status,
                }
              : booking
          )
      );

      setSelectedBooking(
        (current) =>
          current
            ? {
                ...current,
                status,
              }
            : null
      );
    } catch (error) {
      console.error(
        "Failed to update booking status:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update booking status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "Pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) =>
      booking.status === "Confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) =>
      booking.status === "Completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) =>
      booking.status === "Cancelled"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white lg:flex-row">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Management
            </p>

            <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Bookings
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/45">
              Manage customer requests and event
              bookings from one workspace.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Pending
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {pendingCount}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Confirmed
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {confirmedCount}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Completed
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {completedCount}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Cancelled
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {cancelledCount}
              </p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="mb-4 flex flex-col gap-3 border border-white/10 bg-[#111111] p-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search customer, service or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37] md:max-w-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-none border border-white/15 border-l-[#D4AF37] bg-[#171717] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
            >
              <option value="All">
                All Bookings
              </option>
              <option value="Pending">
                Pending
              </option>
              <option value="Confirmed">
                Confirmed
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="border border-white/10 bg-[#111111] p-10 text-center">
              <p className="text-sm text-white/40">
                Loading bookings...
              </p>
            </div>
          ) : (
            <BookingTable
              bookings={filteredBookings}
              onView={setSelectedBooking}
            />
          )}
        </main>
      </div>

      {/* Details modal */}
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() =>
            setSelectedBooking(null)
          }
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

