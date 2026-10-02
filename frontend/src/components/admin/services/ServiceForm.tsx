
"use client";

import { FormEvent, useState } from "react";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  status: "Active" | "Inactive";
}

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function ServiceForm({
  service,
  onClose,
  onSuccess,
}: ServiceFormProps) {
  const [name, setName] = useState(
    service?.name ?? ""
  );

  const [category, setCategory] = useState(
    service?.category ?? ""
  );

  const [price, setPrice] = useState(
    service?.price ?? ""
  );

  const [description, setDescription] =
    useState(
      service?.description ?? ""
    );

  const [status, setStatus] =
    useState<Service["status"]>(
      service?.status ?? "Active"
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      /*
       * Data sent to the backend.
       *
       * The backend expects:
       * name
       * category
       * description
       * price
       */
      const serviceData = {
        name: name.trim(),
        category: category.trim(),
        price: price.trim(),
        description: description.trim(),
      };

      /*
       * Create a new service.
       */
      if (!service) {
        const response = await fetch(
          `${API_URL}/api/services`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify(
              serviceData
            ),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to create service"
          );
        }

        /*
         * Service was created successfully.
         */
        onSuccess();

        return;
      }

      /*
       * Update an existing service.
       */
      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            serviceData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to update service"
        );
      }

      if (status !== service.status) {
        const statusResponse = await fetch(
          `${API_URL}/api/services/${service.id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              is_active: status === "Active",
            }),
          }
        );

        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(
            statusData.message ??
              "Failed to update service status"
          );
        }
      }

      /*
       * Service was updated successfully.
       */
      onSuccess();
    } catch (error) {
      console.error(
        "Service form error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden border border-white/10 bg-[#111111] text-white shadow-2xl sm:my-0 sm:max-h-[calc(100dvh-3rem)]">
        <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Service content
            </p>

            <h2 className="text-xl font-medium sm:text-2xl">
              {service
                ? "Edit Service"
                : "Add Service"}
            </h2>

            <p className="mt-1 max-w-xs text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
              {service
                ? "Update the service information."
                : "Create a new decoration service."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="ml-4 text-2xl leading-none text-white/35 transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6"
        >
          <div className="space-y-4 sm:space-y-5">
            {/* ERROR */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-xs leading-5 text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* SERVICE NAME */}
            <div>
              <label
                htmlFor="service-name"
                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                Service name
              </label>

              <input
                id="service-name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Wedding Decoration"
                required
                disabled={loading}
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label
                htmlFor="service-category"
                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                Category
              </label>

              <select
                id="service-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                required
                disabled={loading}
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-[#171717] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Select category
                </option>

                <option value="Wedding">
                  Wedding
                </option>

                <option value="Planning">
                  Planning
                </option>

                <option value="Events">
                  Events
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label
                htmlFor="service-price"
                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                Starting price
              </label>

              <input
                id="service-price"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="150,000 RWF"
                required
                disabled={loading}
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="service-description"
                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                Description
              </label>

              <textarea
                id="service-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe what customers receive."
                rows={3}
                required
                disabled={loading}
                className="w-full resize-y rounded-none border border-white/15 border-l-[#D4AF37] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* STATUS */}
            <div>
              <label
                htmlFor="service-status"
                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                Status
              </label>

              <select
                id="service-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as Service["status"]
                  )
                }
                disabled={
                  loading || !service
                }
                className="w-full rounded-none border border-white/15 border-l-[#D4AF37] bg-[#171717] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              {!service && (
                <p className="mt-2 text-[10px] leading-4 text-white/30">
                  New services are created as
                  active.
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/65 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 border border-[#D4AF37] bg-[#D4AF37] px-4 py-3 text-xs uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : service
                    ? "Save Changes"
                    : "Create Service"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

