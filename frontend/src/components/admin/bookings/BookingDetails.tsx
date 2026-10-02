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
  notes?: string;
}

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (
    id: number,
    status: Booking["status"]
  ) => void;
}

export default function BookingDetails({
  booking,
  onClose,
  onStatusChange,
}: BookingDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="my-2 max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto border border-white/10 bg-[#111111] text-white shadow-2xl sm:my-0 sm:max-h-[calc(100dvh-3rem)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
              Booking #{booking.id}
            </p>

            <h2 className="mt-2 text-xl font-medium text-white">
              Booking Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-2xl leading-none text-white/35 transition hover:text-[#D4AF37]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section>
            <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Customer Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/35">Name</p>
                <p className="font-medium text-white/90">
                  {booking.customer}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">Phone</p>
                <p className="font-medium text-white/90">
                  {booking.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">Email</p>
                <p className="font-medium text-white/90 break-words">
                  {booking.email}
                </p>
              </div>
            </div>
          </section>

          {/* Event */}
          <section>
            <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Event Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/35">Service</p>
                <p className="font-medium text-white/90">
                  {booking.service}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">Event Date</p>
                <p className="font-medium text-white/90">
                  {booking.eventDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">Location</p>
                <p className="font-medium text-white/90">
                  {booking.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">Status</p>

                <p className="font-medium text-[#D4AF37]">
                  {booking.status}
                </p>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Customer Notes
            </h3>

            <div className="border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
              {booking.notes || "No additional notes provided."}
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6">
          <button
            onClick={onClose}
            className="border border-white/15 px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white/60 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Close
          </button>

          {booking.status === "Pending" && (
            <>
              <button
                onClick={() =>
                  onStatusChange(booking.id, "Cancelled")
                }
                className="border border-red-400/30 px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/10"
              >
                Cancel Booking
              </button>

              <button
                onClick={() =>
                  onStatusChange(booking.id, "Confirmed")
                }
                className="border border-[#D4AF37] bg-[#D4AF37] px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
              >
                Confirm Booking
              </button>
            </>
          )}

          {booking.status === "Confirmed" && (
            <button
              onClick={() =>
                onStatusChange(booking.id, "Completed")
              }
              className="border border-[#D4AF37] bg-[#D4AF37] px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}