"use client";

import { useState } from "react";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  status: "Active" | "Inactive";
}

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onRefresh: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function ServiceTable({
  services,
  onEdit,
  onRefresh,
}: ServiceTableProps) {
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");

  async function handleStatusChange(
    service: Service
  ) {
    const isCurrentlyActive =
      service.status === "Active";

    const newStatus = !isCurrentlyActive;

    const action = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `${newStatus ? "Activate" : "Deactivate"} "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(service.id);
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/${service.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            `Failed to ${action} service`
        );
      }

      /*
       * Reload services from PostgreSQL
       * after successful status change.
       */
      await onRefresh();
    } catch (error) {
      console.error(
        `Failed to ${action} service:`,
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${action} service`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="overflow-hidden border border-white/10 bg-[#111111]">
      {/* ERROR */}
      {error && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-3">
          <p className="text-xs text-red-400">
            {error}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Service
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Category
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Description
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Starting Price
              </th>

              <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Status
              </th>

              <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm text-white/60">
                    No services yet.
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Add your first service to
                    publish it to the website.
                  </p>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-white/5 last:border-0"
                >
                  {/* SERVICE */}
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-white/90">
                      {service.name}
                    </p>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5 text-sm text-white/50">
                    {service.category}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="max-w-xs px-6 py-5 text-sm leading-6 text-white/45">
                    {service.description}
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-5 text-sm text-white/50">
                    {service.price}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
                        service.status ===
                        "Active"
                          ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "border-white/10 bg-white/5 text-white/40"
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-4">
                      {/* EDIT */}
                      <button
                        onClick={() =>
                          onEdit(service)
                        }
                        disabled={
                          updatingId ===
                          service.id
                        }
                        className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Edit
                      </button>

                      {/* ACTIVATE / DEACTIVATE */}
                      <button
                        onClick={() =>
                          handleStatusChange(
                            service
                          )
                        }
                        disabled={
                          updatingId ===
                          service.id
                        }
                        className={`text-[10px] uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          service.status ===
                          "Active"
                            ? "text-white/40 hover:text-red-400"
                            : "text-white/40 hover:text-[#D4AF37]"
                        }`}
                      >
                        {updatingId ===
                        service.id
                          ? "..."
                          : service.status ===
                              "Active"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}