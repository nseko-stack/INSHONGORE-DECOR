
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface GalleryItem {
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<
    GalleryItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/gallery`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Failed to fetch gallery"
          );
        }

        setGallery(
          data.gallery ??
            data.data ??
            []
        );
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

    fetchGallery();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Our Gallery
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          A collection of our work,
          celebrations, and creative details.
        </h1>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white"
                >
                  <div className="aspect-[4/3] bg-[#EADFCB]" />

                  <div className="p-6">
                    <div className="h-3 w-20 rounded bg-[#EADFCB]" />

                    <div className="mt-3 h-6 w-2/3 rounded bg-[#EADFCB]" />

                    <div className="mt-4 h-4 rounded bg-[#EADFCB]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-12 border border-red-200 bg-red-50 px-6 py-5">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Gallery */}
        {!loading &&
          !error &&
          gallery.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* Featured */}
                    {item.is_featured && (
                      <div className="absolute left-4 top-4 rounded-full border border-[#D4AF37]/50 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                        <span className="text-[9px] uppercase tracking-[0.16em] text-[#D4AF37]">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {item.category && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                        {item.category}
                      </p>
                    )}

                    <h2 className="mt-2 text-xl font-medium text-[#171717]">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mt-3 text-sm leading-7 text-[#4D443D]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

        {/* Empty */}
        {!loading &&
          !error &&
          gallery.length === 0 && (
            <div className="mt-12 rounded-[1.75rem] border border-[#EADFCB] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#4D443D]">
                Our gallery is being updated.
              </p>
            </div>
          )}

        {/* Back */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-block border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-[#D4AF37]"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

