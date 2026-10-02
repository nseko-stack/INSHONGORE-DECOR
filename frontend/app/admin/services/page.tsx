
"use client";

import { useEffect, useState } from "react";

import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import ServiceTable from "@/src/components/admin/services/ServiceTable";
import ServiceForm from "@/src/components/admin/services/ServiceForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ApiService {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServicesResponse {
  success: boolean;
  services?: ApiService[];
  data?: ApiService[];
  message?: string;
}

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  status: "Active" | "Inactive";
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Convert one service from the backend format
   * into the format expected by the frontend UI.
   */
  function formatService(
    service: ApiService
  ): Service {
    return {
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description ?? "",
      status: service.is_active
        ? "Active"
        : "Inactive",
    };
  }

  /*
   * Load services from the backend.
   */
  async function fetchServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/admin`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load services (${response.status})`
        );
      }

      const data: ServicesResponse =
        await response.json();

      console.log(
        "Services API response:",
        data
      );

      /*
       * Support the possible response structures:
       *
       * {
       *   success: true,
       *   services: [...]
       * }
       *
       * OR
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       */

      const serviceList =
        data.services ?? data.data ?? [];

      if (!Array.isArray(serviceList)) {
        throw new Error(
          "Invalid services response from server"
        );
      }

      const formattedServices =
        serviceList.map(
          (service) =>
            formatService(service)
        );

      setServices(formattedServices);
    } catch (error) {
      console.error(
        "Failed to fetch services:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load services. Please try again."
      );

      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Load services when the page opens.
   */
  useEffect(() => {
    fetchServices();
  }, []);

  /*
   * Open the form for creating a new service.
   */
  function handleAddService() {
    setSelectedService(null);
    setShowForm(true);
  }

  /*
   * Open the form for editing an existing service.
   */
  function handleEditService(
    service: Service
  ) {
    setSelectedService(service);
    setShowForm(true);
  }

  /*
   * Close the service form.
   */
  function handleCloseForm() {
    setShowForm(false);
    setSelectedService(null);
  }

  async function handleFormSuccess() {
    handleCloseForm();
    await fetchServices();
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white lg:flex-row">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                Management
              </p>

              <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                Services
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/45">
                Manage the services displayed to
                customers across the public site.
              </p>
            </div>

            <button
              onClick={handleAddService}
              className="border border-[#D4AF37] bg-[#D4AF37] px-5 py-3 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
            >
              Add Service
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex items-center justify-between border border-red-500/20 bg-red-500/10 px-5 py-4">
              <p className="text-xs text-red-400">
                {error}
              </p>

              <button
                onClick={fetchServices}
                className="text-[10px] uppercase tracking-[0.16em] text-red-300 hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* STATISTICS */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Total services
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {services.length}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Active
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {
                  services.filter(
                    (service) =>
                      service.status === "Active"
                  ).length
                }
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Inactive
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {
                  services.filter(
                    (service) =>
                      service.status === "Inactive"
                  ).length
                }
              </p>
            </div>
          </div>

          {/* SERVICE TABLE */}
          <ServiceTable
            services={services}
            onEdit={handleEditService}
            onRefresh={handleFormSuccess}
          />
        </main>
      </div>

      {/* SERVICE FORM */}
      {showForm && (
        <ServiceForm
          service={selectedService}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

