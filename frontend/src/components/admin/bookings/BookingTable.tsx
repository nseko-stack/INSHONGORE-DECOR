"use client";

interface Booking {
  id: number;
  customer: string;
  phone: string;
  email: string;
  service: string;
  eventDate: string;
  location: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

interface BookingTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onView,
}: BookingTableProps) {
  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]";

      case "Confirmed":
        return "border-sky-400/30 bg-sky-400/10 text-sky-300";

      case "Completed":
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

      case "Cancelled":
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }
  };

  return (
    <div className="overflow-hidden border border-white/10 bg-[#111111]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Customer
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Service
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Event Date
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Location
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Status
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="transition hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white/90">
                      {booking.customer}
                    </p>

                    <p className="text-sm text-white/40">
                      {booking.phone}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-white/55">
                  {booking.service}
                </td>

                <td className="px-6 py-4 text-sm text-white/55">
                  {booking.eventDate}
                </td>

                <td className="px-6 py-4 text-sm text-white/55">
                  {booking.location}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(booking)}
                    className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4AF37] transition hover:text-white"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-white/40"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}