"use client";

import { useEffect, useState } from "react";

import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import GalleryGrid from "@/src/components/admin/gallery/GalleryGrid";
import GalleryUpload from "@/src/components/admin/gallery/GalleryUpload";
import { handleBuildComplete } from "next/dist/build/adapter/build-complete";

interface ApiGalleryItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
}

interface GalleryResponse {
  success: boolean;
  gallery?: ApiGalleryItem[];
  data?: ApiGalleryItem[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AdminGalleryPage() {
  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showUpload, setShowUpload] =
    useState(false);

  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<GalleryItem | null>(null);

  async function fetchGallery() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/gallery`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: GalleryResponse =
        await response.json();

      console.log(
        "Gallery API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to fetch gallery"
        );
      }

      const galleryList =
        data.gallery ?? data.data ?? [];

      if (!Array.isArray(galleryList)) {
        throw new Error(
          "Invalid gallery response from server"
        );
      }

      const formattedGallery =
        galleryList.map((item) => ({
          id: item.id,
          title: item.title,
          category:
            item.category ?? "Uncategorized",
          image: item.image_url,
          description:
            item.description ?? "",
          isFeatured: item.is_featured,
          isActive: item.is_active,
        }));

      setGallery(formattedGallery);
    } catch (error) {
      console.error(
        "Failed to fetch gallery:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load gallery"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGallery();
  }, []);

  function handleUploadSuccess() {
    setShowUpload(false);
    setSelectedGalleryItem(null);
    fetchGallery();
  }

  function handleEdit(item: GalleryItem) {
    setSelectedGalleryItem(item);
    setShowUpload(true);
  }

  function handleCloseUpload() {
    setShowUpload(false);
    setSelectedGalleryItem(null);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/gallery/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to delete image"
        );
      }

      await fetchGallery();
    } catch (error) {
      console.error(
        "Failed to delete gallery image:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete image"
      );
    }
  }

  const weddingCount =
    gallery.filter(
      (item) =>
        item.category === "Wedding"
    ).length;

  const otherProjectsCount =
    gallery.filter(
      (item) =>
        item.category !== "Wedding"
    ).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white lg:flex-row">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                Management
              </p>

              <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                Gallery
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/45">
                Manage the projects and work
                displayed to customers.
              </p>
            </div>

            <button
              onClick={() =>
                setShowUpload(true)
              }
              className="border border-[#D4AF37] bg-[#D4AF37] px-5 py-3 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
            >
              Add Image
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 border border-red-500/20 bg-red-500/10 px-5 py-4">
              <p className="text-xs text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* STATS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Total images
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {gallery.length}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Wedding
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {weddingCount}
              </p>
            </div>

            <div className="border border-white/10 bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Other projects
              </p>

              <p className="mt-3 text-2xl font-medium text-[#D4AF37]">
                {otherProjectsCount}
              </p>
            </div>
          </div>

          {/* GALLERY */}
          {loading ? (
            <div className="border border-white/10 bg-[#111111] px-6 py-16 text-center">
              <p className="text-sm text-white/50">
                Loading gallery...
              </p>
            </div>
          ) : (
            <GalleryGrid
              items={gallery}
              onDelete={handleDelete}
              onRefresh={fetchGallery}
              onEdit={handleEdit}
            />
          )}
        </main>
      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <GalleryUpload
          item={selectedGalleryItem}
          onClose={handleCloseUpload}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
